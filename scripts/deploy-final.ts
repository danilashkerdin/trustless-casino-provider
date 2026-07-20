// deploy-final.ts — деплой через createTransfer + sendBoc (raw fetch, полный контроль)

import { TonClient, WalletContractV4, internal } from 'ton';
import { Address, Cell, beginCell, contractAddress, SendMode, external } from 'ton-core';
import { mnemonicToPrivateKey } from 'ton-crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf-8'));
const BD = path.resolve(__dirname, '../build/tact');
const RPC = 'https://testnet.toncenter.com/api/v2/jsonRPC';
const API_KEY = process.env.TON_API_KEY || '';
const WALLET_RAW = '0:2637e2d935f91e1aed79d83cef0159e396fd862a85301c2f269506fc95ac2725';

function loadCode(name: string): Cell {
  const p = path.join(BD, `${name}.code.boc`);
  if (!fs.existsSync(p)) { console.error('Missing:', p, '— run npm run compile'); process.exit(1); }
  return Cell.fromBoc(fs.readFileSync(p))[0];
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function rpc(method: string, params: any): Promise<any> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (API_KEY) headers['X-API-Key'] = API_KEY;
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch(RPC, {
        method: 'POST',
        headers,
        body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
      });
      if (res.status === 429) throw new Error('rate');
      const data: any = await res.json();
      if (data.ok) return data.result;
      throw new Error(data.error || JSON.stringify(data));
    } catch (e: any) {
      if (i >= 14) throw e;
      const w = 5000;
      console.log(`   ⏳ wait ${w / 1000}s...`);
      await sleep(w);
    }
  }
}

// Отправляем BOC external message: берём Cell, сериализуем через storeMessage, отправляем base64
async function sendExternalBoc(msg: Cell): Promise<void> {
  const boc = msg.toBoc().toString('base64');
  await rpc('sendBoc', { boc });
}

async function main() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║  Trustless Casino — DEPLOY FINAL     ║');
  console.log('╚══════════════════════════════════════╝');

  const mnemonics = (process.env.WALLET_MNEMONICS || '').split(' ');
  if (mnemonics.length !== 24) { console.error('❌ No WALLET_MNEMONICS in .env'); process.exit(1); }
  const key = await mnemonicToPrivateKey(mnemonics);
  const wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey });
  const walletAddr = Address.parse(WALLET_RAW);

  const info = await rpc('getAddressInformation', { address: WALLET_RAW });
  const balance = BigInt(info.balance);
  console.log(`\n📦 Wallet: ${WALLET_RAW}`);
  console.log(`💰 Balance: ${(Number(balance) / 1e9).toFixed(4)} TON`);
  if (balance < 300000000n) { console.error('❌ Need ≥0.3 TON'); process.exit(1); }

  let seqno = 0;
  try {
    const s = await rpc('runGetMethod', { address: WALLET_RAW, method: 'seqno', stack: [] });
    seqno = parseInt(s.stack[0][1].toString());
  } catch {}
  console.log(`   Seqno: ${seqno}`);

  // === ProviderContract ===
  console.log('\n🚀 Deploying ProviderContract...');
  const provCode = loadCode('ProviderContract_ProviderContract');
  const provData = beginCell()
    .storeAddress(wallet.address)
    .storeUint(config.commissionBps, 16)
  .endCell();
  const provAddr = contractAddress(0, { code: provCode, data: provData });
  console.log(`   Address: ${provAddr.toRawString()}`);

  const provState = await rpc('getAddressInformation', { address: provAddr.toRawString() });
  if (provState.state !== 'uninitialized') {
    console.log('   ✅ Already deployed');
  } else {
    const transfer = wallet.createTransfer({
      seqno, secretKey: key.secretKey,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      messages: [internal({ to: provAddr, value: 50000000n, init: { code: provCode, data: provData }, body: new Cell() })],
    });
    // transfer is Cell — signed body for wallet external message
    // wrap as external message: { info: external-in, dest: wallet, body: transfer }
    const msg = external({ to: walletAddr, body: transfer });
    const msgBoc = beginCell().store(storeMessage(msg)).endCell().toBoc().toString('base64');
    console.log('   Sending...');
    await rpc('sendBoc', { boc: msgBoc });
    console.log('   ✅ Deploy request sent');
    seqno++;
    await sleep(30000);
  }

  // === Stake ===
  console.log(`\n💰 Adding stake: ${config.providerStake} TON...`);
  await sleep(5000);
  const bodyStake = beginCell().storeUint(0x10, 32).storeUint(0, 64).endCell();
  const stakeTransfer = wallet.createTransfer({
    seqno, secretKey: key.secretKey,
    sendMode: SendMode.PAY_GAS_SEPARATELY,
    messages: [internal({ to: provAddr, value: BigInt(parseFloat(config.providerStake) * 1e9), body: bodyStake })],
  });
  const stakeMsg = external({ to: walletAddr, body: stakeTransfer });
  const stakeBoc = beginCell().store(storeMessage(stakeMsg)).endCell().toBoc().toString('base64');
  await rpc('sendBoc', { boc: stakeBoc });
  console.log('   ✅ Stake request sent');
  seqno++;
  await sleep(5000);

  // === DiceGame ===
  if (config.games.dice.enabled) {
    console.log('\n🎲 Deploying DiceGame...');
    const diceCode = loadCode('DiceGame_DiceGame');
    const diceData = beginCell()
      .storeCoins(100000000n).storeCoins(100000000000n).storeUint(500, 16).storeUint(0, 8)
    .endCell();
    const diceAddr = contractAddress(0, { code: diceCode, data: diceData });
    console.log(`   Address: ${diceAddr.toRawString()}`);

    const diceState = await rpc('getAddressInformation', { address: diceAddr.toRawString() });
    if (diceState.state !== 'uninitialized') {
      console.log('   ✅ Already deployed');
    } else {
      await sleep(5000);
      const diceTransfer = wallet.createTransfer({
        seqno, secretKey: key.secretKey,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        messages: [internal({ to: diceAddr, value: 50000000n, init: { code: diceCode, data: diceData }, body: new Cell() })],
      });
      const diceMsg = external({ to: walletAddr, body: diceTransfer });
      const diceBoc = beginCell().store(storeMessage(diceMsg)).endCell().toBoc().toString('base64');
      await rpc('sendBoc', { boc: diceBoc });
      console.log('   ✅ Deploy request sent');
    }
  }

  const dep = {
    network: 'testnet',
    providerAddress: provAddr.toRawString(),
    diceGameAddress: (() => {
      const dc = loadCode('DiceGame_DiceGame');
      const dd = beginCell().storeCoins(100000000n).storeCoins(100000000000n).storeUint(500, 16).storeUint(0, 8).endCell();
      return contractAddress(0, { code: dc, data: dd }).toRawString();
    })(),
    commissionBps: config.commissionBps,
    stake: config.providerStake + ' TON',
  };
  fs.writeFileSync(path.join(__dirname, '../deployed.json'), JSON.stringify(dep, null, 2));
  console.log('\n📄 deployed.json');
  console.log('\n' + '='.repeat(55));
  console.log('  DEPLOY SUBMITTED');
  console.log('='.repeat(55));
  console.log('\n  ProviderContract: ' + dep.providerAddress);
  console.log('  DiceGame:         ' + dep.diceGameAddress);
  console.log('\n  Verify in 1-2 min:');
  console.log('  https://testnet.tonviewer.com/' + dep.providerAddress);
  console.log('  https://testnet.tonviewer.com/' + dep.diceGameAddress);
}

main().catch(err => { console.error('\n❌', err.message || err); process.exit(1); });