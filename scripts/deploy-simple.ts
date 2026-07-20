// deploy-simple.ts — деплой через fetch (один запрос за раз, нет rate limit)
import { Address, Cell, beginCell, contractAddress, storeStateInit } from 'ton-core';
import { mnemonicToPrivateKey, sign } from 'ton-crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf-8'));
const BD = path.resolve(__dirname, '../build/tact');
const RPC = 'https://testnet.toncenter.com/api/v2/jsonRPC';

function toNano(t: string) { return BigInt(Math.floor(parseFloat(t) * 1e9)); }
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }
function loadCode(name: string): Cell {
  const p = path.join(BD, `${name}.code.boc`);
  if (!fs.existsSync(p)) { console.error('Missing: ' + p + ' — run npm run compile'); process.exit(1); }
  return Cell.fromBoc(fs.readFileSync(p))[0];
}

async function call(method: string, params: any): Promise<any> {
  const res = await fetch(RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
  });
  const data: any = await res.json();
  if (!data.ok) throw new Error(data.error || JSON.stringify(data));
  return data.result;
}

async function main() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║  Trustless Casino — Deploy           ║');
  console.log('╚══════════════════════════════════════╝');

  const mnemonics = (process.env.WALLET_MNEMONICS || '').split(' ');
  const key = await mnemonicToPrivateKey(mnemonics);
  const walletAddr = '0:2637e2d935f91e1aed79d83cef0159e396fd862a85301c2f269506fc95ac2725';

  const info = await call('getAddressInformation', { address: walletAddr });
  const balance = BigInt(info.balance);
  console.log(`\n📦 Wallet: ${walletAddr}`);
  console.log(`💰 Balance: ${(Number(balance) / 1e9).toFixed(4)} TON`);
  if (balance < toNano('0.3')) { console.error('❌ Balance too low'); process.exit(1); }

  await sleep(1100);

  // === Deploy ProviderContract ===
  console.log('\n🚀 ProviderContract...');
  const provCode = loadCode('ProviderContract_ProviderContract');
  const provData = beginCell()
    .storeAddress(Address.parse(walletAddr))
    .storeUint(config.commissionBps, 16)
  .endCell();
  const provInit = { code: provCode, data: provData };
  const provAddr = contractAddress(0, provInit);
  console.log(`   Address: ${provAddr.toRawString()}`);

  try {
    await sleep(1100);
    const st = await call('getAddressInformation', { address: provAddr.toRawString() });
    if (st.state !== 'uninitialized') {
      console.log('   ✅ Already deployed');
    } else {
      throw new Error('uninit');
    }
  } catch {
    console.log('   Status: ready to deploy');
    console.log('   To deploy: open Tonkeeper > Developer > Deploy Contract');
    console.log(`   Paste code from: ${BD}/ProviderContract_ProviderContract.code.boc`);
    console.log(`   Data (hex): ${provData.toBoc().toString('hex')}`);
    console.log(`   Amount: 0.05 TON`);
  }

  await sleep(1100);

  // === Deploy DiceGame ===
  console.log('\n🎲 DiceGame...');
  const diceCode = loadCode('DiceGame_DiceGame');
  const diceData = beginCell()
    .storeCoins(toNano(config.games.dice.minBet))
    .storeCoins(toNano(config.games.dice.maxBet))
    .storeUint(500, 16)
    .storeUint(0, 8)
  .endCell();
  const diceInit = { code: diceCode, data: diceData };
  const diceAddr = contractAddress(0, diceInit);
  console.log(`   Address: ${diceAddr.toRawString()}`);

  try {
    await sleep(1100);
    const st = await call('getAddressInformation', { address: diceAddr.toRawString() });
    if (st.state !== 'uninitialized') {
      console.log('   ✅ Already deployed');
    } else {
      throw new Error('uninit');
    }
  } catch {
    console.log('   Status: ready to deploy');
    console.log(`   Data (hex): ${diceData.toBoc().toString('hex')}`);
    console.log(`   Amount: 0.05 TON`);
  }

  // === Save ===
  const dep = {
    network: 'testnet',
    providerAddress: provAddr.toRawString(),
    diceGameAddress: diceAddr.toRawString(),
    commissionBps: config.commissionBps,
    stake: config.providerStake + ' TON',
  };
  fs.writeFileSync(path.join(__dirname, '../deployed.json'), JSON.stringify(dep, null, 2));
  console.log('\n📄 deployed.json saved');

  console.log('\n' + '='.repeat(55));
  console.log('  DEPLOY INSTRUCTIONS');
  console.log('='.repeat(55));
  console.log(`\n  1. Tonkeeper → Settings → Network → Testnet`);
  console.log(`  2. Import 24 words from .env`);
  console.log(`  3. Tonkeeper → Developer → Deploy Contract`);
  console.log(`\n  ProviderContract (0.05 TON):`);
  console.log(`    Code: ${BD}/ProviderContract_ProviderContract.code.boc`);
  console.log(`    Addr: ${dep.providerAddress}`);
  console.log(`\n  DiceGame (0.05 TON):`);
  console.log(`    Code: ${BD}/DiceGame_DiceGame.code.boc`);
  console.log(`    Addr: ${dep.diceGameAddress}`);
  console.log(`\n  After deploy — Stake:`);
  console.log(`    Send 1 TON → ${dep.providerAddress}`);
  console.log(`    Body hex: 00000010 + 0000000000000000`);
  console.log(`\n  View:`);
  console.log(`    https://testnet.tonviewer.com/${dep.providerAddress}`);
  console.log(`    https://testnet.tonviewer.com/${dep.diceGameAddress}`);
}

main().catch(console.error);