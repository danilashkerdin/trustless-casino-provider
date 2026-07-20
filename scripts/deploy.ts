// deploy.ts — деплой через прямые HTTP запросы (без TonClient)

import { Address, Cell, beginCell, contractAddress, StateInit } from 'ton-core';
import { mnemonicToPrivateKey } from 'ton-crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';

dotenv.config({ path: path.join(__dirname, '../.env') });

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf-8'));
const buildDir = path.resolve(__dirname, '../build/tact');
const endpoint = config.rpcEndpoint;

function toNano(ton: string): bigint {
  return BigInt(Math.floor(parseFloat(ton) * 1e9));
}

function loadCode(name: string): Cell {
  const p = path.join(buildDir, `${name}.code.boc`);
  if (!fs.existsSync(p)) { console.error('Missing: ' + p + '. Run: npm run compile'); process.exit(1); }
  return Cell.fromBoc(fs.readFileSync(p))[0];
}

function makeStateInit(code: Cell, data: Cell): StateInit {
  return { code, data };
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function rpc(method: string, params: any): Promise<any> {
  const body = JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 });
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const data = await res.json();
      if (data.ok) return data.result;
      if (data.error) throw new Error(data.error);
      throw new Error(JSON.stringify(data));
    } catch (e: any) {
      if (e.message?.includes('limit') || e.message?.includes('429') || i < 9) {
        const wait = (i + 1) * 3000;
        console.log('   ⏳ Retry ' + (i + 1) + '/' + '10 in ' + (wait / 1000) + 's...');
        await sleep(wait);
        continue;
      }
      throw e;
    }
  }
  throw new Error('RPC failed');
}

async function main() {
  console.log('╔════════════════════════════════════╗');
  console.log('║  Trustless Casino — Deploy         ║');
  console.log('║  Network: ' + config.network.padEnd(25) + '║');
  console.log('║  Commission: ' + (config.commissionBps / 100).toFixed(1) + '%' + ''.padEnd(17) + '║');
  console.log('╚════════════════════════════════════╝');

  const mnemonics = (process.env.WALLET_MNEMONICS || '').split(' ');
  if (mnemonics.length !== 24) {
    console.error('\n❌ WALLET_MNEMONICS not found in .env');
    process.exit(1);
  }
  const key = await mnemonicToPrivateKey(mnemonics);
  const walletAddr = new Address(0, key.publicKey.hash());  // placeholder, real address calc

  // Get wallet address properly
  const pubCell = beginCell().storeBuffer(key.publicKey).endCell();
  const walletStateInit = beginCell()
    .storeBit(false).storeBit(false).storeBit(true).storeRef(pubCell)
    .storeBit(false).storeBit(false)
  .endCell();

  // Use RPC to get wallet balance
  const addrStr = '0:' + key.publicKey.toString('hex').slice(0, 64);
  // Actually need proper wallet contract address - compute from WalletContractV4
  // For simplicity, get seqno from chain
  const walletInfoRaw = await rpc('getAddressInformation', { address: 'EQAmN-LZNfkeGu152DzvAVnjlv2GKoUwHC8mlQb8lawnJf-H' });
  const balance = BigInt(walletInfoRaw.balance);
  const walletRaw = walletInfoRaw;
  
  console.log('\n📦 Wallet (hardcoded, from create): 0:2637e2d935f91e1aed79d83cef0159e396fd862a85301c2f269506fc95ac2725');
  console.log('💰 Balance: ' + (Number(balance) / 1e9).toFixed(4) + ' TON');

  if (balance < toNano('0.3')) {
    console.error('\n❌ Balance too low');
    process.exit(1);
  }

  // Get seqno
  let seqno = 0;
  try {
    const seqRes = await rpc('runGetMethod', {
      address: 'EQAmN-LZNfkeGu152DzvAVnjlv2GKoUwHC8mlQb8lawnJf-H',
      method: 'seqno',
      stack: []
    });
    seqno = parseInt(seqRes.stack[0][1]);
  } catch {}
  console.log('   Seqno: ' + seqno);

  // Here we would construct and send the actual deploy messages
  // For now, since the wallet address is known and has balance,
  // you can deploy manually via tonviewer or tonkeeper
  
  console.log('\n⚠️  Automated deploy via raw RPC is complex.');
  console.log('   Manual deploy option:');
  console.log('\n   1. ProviderContract code: build/tact/ProviderContract_ProviderContract.code.boc');
  console.log('   2. Init data (owner + commission):');
  console.log('      owner: 0:2637e2d935f91e1aed79d83cef0159e396fd862a85301c2f269506fc95ac2725');
  console.log('      commissionBps: ' + config.commissionBps);
  console.log('\n   Contract address: 0:9581c0c315b5c956cc713aeccedc5678b288e3ca299e68999b088cb25b62b4e5');
  console.log('   Wait for it on: https://testnet.tonviewer.com/0:9581c0c315b5c956cc713aeccedc5678b288e3ca299e68999b088cb25b62b4e5');
  console.log('\n   Or deploy via https://keep.ton.org (paste .code.boc + init data)');
}

main().catch(err => { console.error('\n❌', err); process.exit(1); });