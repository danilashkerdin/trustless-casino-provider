// test_deploy_wallet.ts — деплой кошелька если он uninitialized

import { TonClient, WalletContractV4, internal } from 'ton';
import { Address, Cell, beginCell, SendMode } from 'ton-core';
import { mnemonicToPrivateKey } from 'ton-crypto';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
  const mnemonics = (process.env.WALLET_MNEMONICS || '').split(' ');
  const key = await mnemonicToPrivateKey(mnemonics);
  const wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey });

  const client = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: process.env.TON_API_KEY || '',
  });

  const deployed = await client.isContractDeployed(wallet.address);
  console.log('Contract deployed?', deployed);

  if (!deployed) {
    console.log('Wallet not deployed. Deploying...');
    // force deploy by sending external message with init
    const msg = wallet.createTransfer({
      seqno: 0,
      secretKey: key.secretKey,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      messages: [internal({
        to: wallet.address,  // send to self as first message
        value: 1n,  // minimal
        body: new Cell(),
      })],
    });
    // sendExternalMessage will add init automatically
    await client.sendExternalMessage(wallet, msg);
    console.log('✅ Wallet deploy sent');
  } else {
    const opened = client.open(wallet);
    const seqno = await opened.getSeqno();
    console.log('Seqno:', seqno);
  }
}

run().catch(console.error);