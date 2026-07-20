import { createHash, randomBytes } from 'crypto';
import { VerificationResult } from '../types';

function sha256Buffer(data: Buffer): Buffer {
  return createHash('sha256').update(data).digest();
}

export class ProvablyFairCore {
  static generateSeed(): string {
    return randomBytes(32).toString('hex');
  }

  static hashSeed(seed: string): string {
    return sha256Buffer(Buffer.from(seed, 'hex')).toString('hex');
  }

  static createCommitment(
    serverSeedHash: string,
    clientSeed: string
  ): string {
    const data = Buffer.concat([
      Buffer.from(serverSeedHash, 'hex'),
      Buffer.from(clientSeed, 'hex'),
    ]);
    return sha256Buffer(data).toString('hex');
  }

  static calculateResult(
    serverSeed: string,
    clientSeed: string,
    nonce: number
  ): Buffer {
    const buf = Buffer.alloc(8);
    buf.writeBigUInt64BE(BigInt(nonce));
    const data = Buffer.concat([
      Buffer.from(serverSeed, 'hex'),
      Buffer.from(clientSeed, 'hex'),
      buf,
    ]);
    return createHash('sha256').update(data).digest();
  }

  static hashToRange(hash: Buffer, range: number): number {
    const val = BigInt(`0x${hash.subarray(0, 8).toString('hex')}`);
    return Number(val % BigInt(range));
  }

  static hashToDice(hash: Buffer): number {
    return ProvablyFairCore.hashToRange(hash, 6) + 1;
  }

  static diceResult(serverSeed: string, clientSeed: string, nonce: number): number {
    return ProvablyFairCore.hashToDice(
      ProvablyFairCore.calculateResult(serverSeed, clientSeed, nonce)
    );
  }

  static getMultiplier(outcome: number): number {
    if (outcome >= 9500) return 100000;
    if (outcome >= 9000) return 50000;
    if (outcome >= 8000) return 30000;
    if (outcome >= 6000) return 20000;
    if (outcome >= 4000) return 15000;
    if (outcome >= 2000) return 10000;
    return 0;
  }

  static calcPayout(betAmount: bigint, multiplier: number): bigint {
    return (betAmount * BigInt(multiplier)) / BigInt(10000);
  }
}

export class ProvablyFairVerifier {
  /**
   * Полная верификация игры.
   * Клиент вызывает после того как провайдер раскрыл serverSeed.
   * 
   * Проверяет:
   * 1. SHA256(serverSeed) === serverSeedHash (провайдер не подменил seed)
   * 2. outcome === F(serverSeed, clientSeed, nonce) (результат честный)
   */
  static verify(
    serverSeed: string,
    serverSeedHash: string,
    clientSeed: string,
    nonce: number,
    expectedOutcome: number
  ): VerificationResult {
    const computedSeedHash = ProvablyFairCore.hashSeed(serverSeed);
    const serverSeedIntegrity = computedSeedHash === serverSeedHash;

    const hash = ProvablyFairCore.calculateResult(serverSeed, clientSeed, nonce);
    const computedOutcome = ProvablyFairCore.hashToRange(hash, 10000);
    const outcomeIntegrity = computedOutcome === expectedOutcome;

    return {
      gameIsFair: serverSeedIntegrity && outcomeIntegrity,
      serverSeedIntegrity,
      outcomeIntegrity,
      details: {
        computedServerSeedHash: computedSeedHash,
        expectedServerSeedHash: serverSeedHash,
        computedOutcome,
        expectedOutcome,
      },
    };
  }

  static verifyDice(
    serverSeed: string,
    serverSeedHash: string,
    clientSeed: string,
    nonce: number,
    expectedRoll: number
  ): VerificationResult {
    const computedSeedHash = ProvablyFairCore.hashSeed(serverSeed);
    const serverSeedIntegrity = computedSeedHash === serverSeedHash;

    const computedRoll = ProvablyFairCore.diceResult(serverSeed, clientSeed, nonce);
    const outcomeIntegrity = computedRoll === expectedRoll;

    return {
      gameIsFair: serverSeedIntegrity && outcomeIntegrity,
      serverSeedIntegrity,
      outcomeIntegrity,
      details: {
        computedServerSeedHash: computedSeedHash,
        expectedServerSeedHash: serverSeedHash,
        computedOutcome: computedRoll,
        expectedOutcome: expectedRoll,
      },
    };
  }

  /**
   * Создает доказательство мухлежа.
   * Если провайдер раскрыл serverSeed НЕ совпадающий с serverSeedHash,
   * игрок может вызвать slash_stake в контракте.
   */
  static createSlashProof(
    serverSeed: string,
    nonce: number,
    playerAddress: string
  ) {
    return {
      serverSeed,
      nonce,
      playerAddress,
    };
  }
}