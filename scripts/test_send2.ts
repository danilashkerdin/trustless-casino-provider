// test_send2.ts — тест с получением свежего seqno

import { TonClient, WalletContractV4, internal } from 'ton';
import { Address, Cell, beginCell, SendMode } from 'ton-core';
import { mnemonicToPrivateKey } from 'ton-crypto';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
  const mnemonics = (process.env.WALLET_MNEMONICS || '').split(' ');
  const key = await mnemonicToPrivateKey(mnemonics);
  const wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey });
  const walletAddr = wallet.address.toRawString();

  const client = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: process.env.TON_API_KEY || '',
  });

  // Get fresh seqno
  const opened = client.open(wallet);
  const seqno = await opened.getSeqno();
  console.log('Seqno:', seqno);

  // Send simple 0.01 TON transfer (no init)
  const dest = Address.parse('0:9581c0c315b5c956cc713aeccedc5678b288e3ca299e68999b088cb25b62b4e5');
  const body = beginCell().storeUint(0, 32).storeUint(0, 64).endCell();

  console.log('Sending simple transfer...');
  await opened.sendTransfer({
    seqno,
    secretKey: key.secretKey,
    sendMode: SendMode.PAY_GAS_SEPARATELY,
    messages: [internal({ to: dest, value: 10000000n, body })],
  });
  console.log('✅ Sent!');
}

run().catch(console.error);