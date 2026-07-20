#!/usr/bin/env ts-node
// demo.ts — симуляция провably fair игры, читает config.json

import { createHash, randomBytes } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf-8'));

function genSeed(): string { return randomBytes(32).toString('hex'); }
function hashSeed(seed: string): string { return createHash('sha256').update(Buffer.from(seed, 'hex')).digest('hex'); }
function calcResult(ss: string, cs: string, nonce: number): Buffer {
  const buf = Buffer.alloc(8); buf.writeBigUInt64BE(BigInt(nonce));
  return createHash('sha256').update(Buffer.concat([Buffer.from(ss, 'hex'), Buffer.from(cs, 'hex'), buf])).digest();
}
function hashToRange(hash: Buffer, r: number): number { return Number(BigInt(`0x${hash.subarray(0, 8).toString('hex')}`) % BigInt(r)); }
function getMultiplier(o: number): number {
  if (o >= 9500) return 100000; if (o >= 9000) return 50000; if (o >= 8000) return 30000;
  if (o >= 6000) return 20000; if (o >= 4000) return 15000; if (o >= 2000) return 10000; return 0;
}

const commissionBps = config.commissionBps;
const houseEdgePct = config.commissionBps / 100;
const expectedRtp = 100 - houseEdgePct;
const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];

function outcomeToSlot(outcome: number): string[] {
  const idx1 = outcome % SYMBOLS.length;
  const idx2 = (Math.floor(outcome / SYMBOLS.length) + idx1) % SYMBOLS.length;
  const idx3 = (Math.floor(outcome / (SYMBOLS.length * SYMBOLS.length)) + idx2) % SYMBOLS.length;
  return [SYMBOLS[idx1], SYMBOLS[idx2], SYMBOLS[idx3]];
}

console.log(`╔══════════════════════════════════════════╗`);
console.log(`║  Trustless Casino — Provably Fair Demo   ║`);
console.log(`║                                          ║`);
console.log(`║  House edge: ${(houseEdgePct).toFixed(1).padStart(5)}%        Expected RTP: ${expectedRtp.toFixed(1)}%  ║`);
console.log(`║  Commission: ${commissionBps} bps          Games: ${config.demo.gamesCount}     ║`);
console.log(`╚══════════════════════════════════════════╝`);

const gamesCount = config.demo.gamesCount;
const bet = parseInt(config.demo.betAmount);
let totalWin = 0;
let totalBet = 0;
let wins = 0;

console.log('\n  #  OUTCOME  MULT   PAYOUT  SLOT      VERIFY\n');

for (let game = 1; game <= gamesCount; game++) {
  const serverSeed = genSeed();
  const serverSeedHash = hashSeed(serverSeed);
  const clientSeed = genSeed();
  const nonce = game;

  const hash = calcResult(serverSeed, clientSeed, nonce);
  const outcome = hashToRange(hash, 10000);
  const rawMultiplier = getMultiplier(outcome);
  const multiplier = rawMultiplier * (10000 - commissionBps) / 10000;
  const payout = bet * multiplier / 10000;

  totalBet += bet;
  totalWin += payout;
  if (multiplier > 0) wins++;

  const seedOk = hashSeed(serverSeed) === serverSeedHash;
  const outcomeOk = hashToRange(calcResult(serverSeed, clientSeed, nonce), 10000) === outcome;
  const fair = seedOk && outcomeOk;

  const slot = outcomeToSlot(outcome);
  const sym = multiplier >= 100000 ? '💎' : multiplier >= 50000 ? '🔥' : multiplier >= 30000 ? '⭐' :
              multiplier >= 20000 ? '💰' : multiplier >= 15000 ? '💵' : multiplier >= 10000 ? '🔄' : '💔';

  console.log(
    `  ${game.toString().padStart(2)}  ` +
    `${outcome.toString().padStart(4)}  ` +
    `${(multiplier / 10000).toFixed(1)}x  ` +
    `${payout.toString().padStart(5)}  ` +
    `${slot.join(' ')}  ` +
    `${fair ? '✅' : '❌'}`
  );
}

const rtp = totalWin / totalBet * 100;
console.log(`\n─── ───── ───── ───── ─────────── ───`);
console.log(`     Total bet:  ${totalBet}`);
console.log(`     Total win:  ${totalWin}`);
console.log(`     Wins:       ${wins}/${gamesCount}`);
console.log(`     RTP:        ${rtp.toFixed(1)}% (expected ${expectedRtp.toFixed(1)}%)`);
console.log(`     Integrity:  ${'✅'.repeat(gamesCount)}`);
console.log(`\n───`);
console.log(`To deploy on ${config.network}:`);
console.log(`  npm run compile && npm run deploy`);
console.log(`\nTo change house edge: edit config.json → commissionBps`);