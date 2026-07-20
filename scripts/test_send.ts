// test_send.ts — тест отправки external message

import { TonClient, WalletContractV4, internal } from 'ton';
import { Address, Cell, beginCell, SendMode } from 'ton-core';
import { mnemonicToPrivateKey } from 'ton-crypto';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const mnemonics = (process.env.WALLET_MNEMONICS || '').split(' ');
  const key = await mnemonicToPrivateKey(mnemonics);
  const wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey });
  console.log('Wallet:', wallet.address.toRawString());
  console.log('WalletId:', wallet.walletId);

  const provAddr = Address.parse('0:9581c0c315b5c956cc713aeccedc5678b288e3ca299e68999b088cb25b62b4e5');

  const client = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: process.env.TON_API_KEY || '',
  });

  // Option 1: sendTransfer (full flow)
  console.log('\n--- Test 1: sendTransfer ---');
  try {
    const opened = client.open(wallet);
    await opened.sendTransfer({
      seqno: 85143,
      secretKey: key.secretKey,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      messages: [internal({ to: provAddr, value: 50000000n, body: new Cell() })],
    });
    console.log('OK');
  } catch (e: any) {
    console.error('Error:', e.message);
    if (e.response?.data) console.error('Data:', JSON.stringify(e.response.data));
  }

  // Option 2: direct sendExternalMessage
  console.log('\n--- Test 2: sendExternalMessage ---');
  try {
    const transfer = wallet.createTransfer({
      seqno: 85143,
      secretKey: key.secretKey,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      messages: [internal({ to: provAddr, value: 50000000n, body: new Cell() })],
    });
    await client.sendExternalMessage(wallet, transfer);
    console.log('OK');
  } catch (e: any) {
    console.error('Error:', e.message);
    if (e.response?.data) console.error('Data:', JSON.stringify(e.response.data));
  }
}

main().catch(console.error);