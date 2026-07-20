// deploy-now.ts — деплой с актуальным seqno

import { TonClient, WalletContractV4, internal } from 'ton';
import { Address, Cell, beginCell, contractAddress, SendMode } from 'ton-core';
import { mnemonicToPrivateKey } from 'ton-crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf-8'));
const BD = path.resolve(__dirname, '../build/tact');

function loadCode(name: string): Cell {
  const p = path.join(BD, `${name}.code.boc`);
  if (!fs.existsSync(p)) { console.error('Missing:', p); process.exit(1); }
  return Cell.fromBoc(fs.readFileSync(p))[0];
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const mnemonics = (process.env.WALLET_MNEMONICS || '').split(' ');
  const key = await mnemonicToPrivateKey(mnemonics);
  const wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey });

  const client = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: process.env.TON_API_KEY || '',
  });
  const opened = client.open(wallet);

  console.log('Wallet:', wallet.address.toRawString());
  const bal = await client.getBalance(wallet.address);
  console.log('Balance:', Number(bal) / 1e9, 'TON');

  const seqno = await opened.getSeqno();
  console.log('Seqno:', seqno);

  // === ProviderContract ===
  console.log('\n🚀 ProviderContract...');
  const provCode = loadCode('ProviderContract_ProviderContract');
  const provData = beginCell()
    .storeAddress(wallet.address)
    .storeUint(config.commissionBps, 16)
  .endCell();
  const provAddr = contractAddress(0, { code: provCode, data: provData });
  console.log('Addr:', provAddr.toRawString());

  await opened.sendTransfer({
    seqno: seqno,
    secretKey: key.secretKey,
    sendMode: SendMode.PAY_GAS_SEPARATELY,
    messages: [internal({
      to: provAddr, value: 50000000n,
      init: { code: provCode, data: provData },
      body: new Cell(),
    })],
  });
  console.log('✅ Deploy sent!');
}

main().catch(console.error);