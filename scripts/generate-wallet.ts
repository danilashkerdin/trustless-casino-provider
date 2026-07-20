// generate-wallet.ts — генерирует новый testnet кошелек

import { mnemonicNew, mnemonicToPrivateKey } from 'ton-crypto';
import { WalletContractV4 } from 'ton';

async function main() {
  const mnemonics = await mnemonicNew(24);
  const key = await mnemonicToPrivateKey(mnemonics);
  const wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey });

  const addr = wallet.address.toRawString();

  console.log('\n' + '='.repeat(60));
  console.log('  NEW TESTNET WALLET');
  console.log('='.repeat(60));
  console.log('\n  Address: ' + addr);
  console.log('\n  24 words (SAVE THESE!):\n');
  for (const w of mnemonics) console.log('  ' + w);
  console.log('\n' + '='.repeat(60));
  console.log('\n  Next:');
  console.log('  1. Save to .env:');
  console.log('     echo \'WALLET_MNEMONICS="' + mnemonics.slice(0, 3).join(' ') + '..."\' > .env');
  console.log('  2. Get test TON: https://t.me/testgiver_ton_bot');
  console.log('     Send to: ' + addr);
  console.log('  3. Then run: npm run deploy\n');
}

main().catch(console.error);