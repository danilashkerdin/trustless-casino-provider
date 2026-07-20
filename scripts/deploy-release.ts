import { TonClient, WalletContractV4, internal } from 'ton';
import { Cell, beginCell, contractAddress, SendMode } from 'ton-core';
import { mnemonicToPrivateKey } from 'ton-crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf-8'));
const BD = path.resolve(__dirname, '../build/tact');
const RPC = 'https://testnet.toncenter.com/api/v2/jsonRPC';
const API_KEY = process.env.TON_API_KEY || '';

function loadCode(name: string): Cell {
  const p = path.join(BD, `${name}.code.boc`);
  if (!fs.existsSync(p)) { console.error('Missing:', p, '— run npm run compile'); process.exit(1); }
  return Cell.fromBoc(fs.readFileSync(p))[0];
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║  Trustless Casino — RELEASE DEPLOY   ║');
  console.log('╚══════════════════════════════════════╝');

  const mnemonics = (process.env.WALLET_MNEMONICS || '').split(' ');
  if (mnemonics.length !== 24) { console.error('❌ No WALLET_MNEMONICS in .env'); process.exit(1); }
  const key = await mnemonicToPrivateKey(mnemonics);
  const wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey });
  const walletAddrStr = wallet.address.toRawString();

  const info = await rpc('getAddressInformation', { address: walletAddrStr });
  const balance = BigInt(info.balance);
  console.log(`\n📦 Wallet: ${walletAddrStr}`);
  console.log(`💰 Balance: ${(Number(balance) / 1e9).toFixed(4)} TON`);
  if (balance < 300000000n) { console.error('❌ Need ≥0.3 TON'); process.exit(1); }

  const client = new TonClient({ endpoint: RPC, apiKey: API_KEY });
  const opened = client.open(wallet);

  // === Step 1: Deploy DiceGame (stateless, owner = provider addr) ===
  console.log('\n🎲 Deploying DiceGame (stateless)...');
  const diceCode = loadCode('DiceGame_DiceGame');
  const diceData = beginCell()
    .storeAddress(wallet.address) // owner = provider (wallet)
  .endCell();
  const diceAddr = contractAddress(0, { code: diceCode, data: diceData });
  console.log(`   Address: ${diceAddr.toRawString()}`);

  let state = await rpc('getAddressInformation', { address: diceAddr.toRawString() });
  if (state.state !== 'uninitialized') {
    console.log('   ✅ Already deployed');
  } else {
    const seqno = await opened.getSeqno();
    await opened.sendTransfer({
      seqno, secretKey: key.secretKey,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      messages: [internal({ to: diceAddr, value: 50000000n, init: { code: diceCode, data: diceData }, body: new Cell() })],
    });
    console.log('   ✅ Deploy sent');
    await sleep(15000);
  }

  // === Step 2: Deploy ProviderContract (new: knows diceGame) ===
  console.log('\n🚀 Deploying ProviderContract...');
  const provCode = loadCode('ProviderContract_ProviderContract');
  const provData = beginCell()
    .storeAddress(wallet.address) // owner
    .storeUint(config.commissionBps, 16) // commissionBps
  .endCell();
  const provAddr = contractAddress(0, { code: provCode, data: provData });
  console.log(`   Address: ${provAddr.toRawString()}`);

  state = await rpc('getAddressInformation', { address: provAddr.toRawString() });
  if (state.state !== 'uninitialized') {
    console.log('   ✅ Already deployed');
  } else {
    const seqno = await opened.getSeqno();
    await opened.sendTransfer({
      seqno, secretKey: key.secretKey,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      messages: [internal({ to: provAddr, value: 50000000n, init: { code: provCode, data: provData }, body: new Cell() })],
    });
    console.log('   ✅ Deploy sent');
    await sleep(15000);
  }

  // === Step 3: Stake ===
  console.log(`\n💰 Adding stake: ${config.providerStake} TON...`);
  const bodyStake = beginCell().storeUint(0x10, 32).storeUint(0, 64).endCell();
  const seqno = await opened.getSeqno();
  await opened.sendTransfer({
    seqno, secretKey: key.secretKey,
    sendMode: SendMode.PAY_GAS_SEPARATELY,
    messages: [internal({ to: provAddr, value: BigInt(parseFloat(config.providerStake) * 1e9), body: bodyStake })],
  });
  console.log('   ✅ Stake sent');

  // === Save ===
  const dep = {
    network: 'testnet',
    providerAddress: provAddr.toRawString(),
    diceGameAddress: diceAddr.toRawString(),
    commissionBps: config.commissionBps,
    stake: config.providerStake + ' TON',
    deployedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(__dirname, '../deployed.json'), JSON.stringify(dep, null, 2));
  console.log('\n📄 deployed.json saved');
  console.log('\n' + '='.repeat(55));
  console.log('  DEPLOYMENT SUBMITTED');
  console.log('='.repeat(55));
  console.log('\n  ProviderContract: ' + dep.providerAddress);
  console.log('  DiceGame:         ' + dep.diceGameAddress);
  console.log('  Commission:       ' + dep.commissionBps + ' bps (' + (dep.commissionBps / 100) + '%)');
  console.log('\n  Check:');
  console.log('    https://testnet.tonviewer.com/' + dep.providerAddress);
  console.log('    https://testnet.tonviewer.com/' + dep.diceGameAddress);
}

async function rpc(method: string, params: any): Promise<any> {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
        body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
      });
      const data: any = await res.json();
      if (data.ok) return data.result;
      if (data.error?.includes('limit') || data?.result?.includes('limit') || res.status === 429) throw new Error('rate');
      throw new Error(data.error || JSON.stringify(data));
    } catch (e: any) {
      const isRate = e.message?.includes('rate') || e.message?.includes('429');
      if (i === 49 || !isRate) throw e;
      const w = Math.min(5000 * (i + 1), 60000);
      console.log(`   ⏳ retry ${i + 1}/50 in ${w / 1000}s...`);
      await sleep(w);
    }
  }
}

main().catch(err => { console.error('\n❌', err.message || err); process.exit(1); });