import { ProvablyFairCore, ProvablyFairVerifier } from './provablyFair';
import { GameResult, VerificationResult, SlashProof } from '../types';

interface SeedEntry {
  seed: string;
  hash: string;
  used: boolean;
}

export class ProviderSDK {
  private seeds: Map<string, SeedEntry> = new Map();
  private usedNonces: Set<string> = new Set();

  constructor(
    public readonly ownerAddress: string,
    public readonly providerAddress: string,
    public stake: bigint = BigInt(0),
    public commissionBps: number = 100
  ) {}

  initGame(gameId: string): { serverSeedHash: string } {
    const seed = ProvablyFairCore.generateSeed();
    const hash = ProvablyFairCore.hashSeed(seed);
    this.seeds.set(gameId, { seed, hash, used: false });
    return { serverSeedHash: hash };
  }

  createClientCommitment(serverSeedHash: string, clientSeed: string): string {
    return ProvablyFairCore.createCommitment(serverSeedHash, clientSeed);
  }

  resolveGame(
    gameId: string,
    clientSeed: string,
    nonce: number,
    betAmount: bigint
  ): GameResult {
    const entry = this.seeds.get(gameId);
    if (!entry || entry.used) throw new Error(`No active seed for game ${gameId}`);

    const nonceKey = `${gameId}:${nonce}`;
    if (this.usedNonces.has(nonceKey)) throw new Error(`Nonce ${nonce} reused`);
    this.usedNonces.add(nonceKey);

    const hash = ProvablyFairCore.calculateResult(entry.seed, clientSeed, nonce);
    const outcome = ProvablyFairCore.hashToRange(hash, 10000);
    const multiplier = ProvablyFairCore.getMultiplier(outcome);
    const payout = ProvablyFairCore.calcPayout(betAmount, multiplier);

    entry.used = true;

    const result: GameResult = {
      serverSeed: entry.seed,
      serverSeedHash: entry.hash,
      clientSeed,
      nonce,
      outcome,
      multiplier,
      payout: payout.toString(),
    };

    return result;
  }

  calculatePayoutWithFee(result: GameResult): bigint {
    const payout = BigInt(result.payout);
    const fee = (payout * BigInt(this.commissionBps)) / BigInt(10000);
    return payout - fee;
  }

  getSeedForGame(gameId: string): { seed: string; hash: string } | null {
    const entry = this.seeds.get(gameId);
    return entry ? { seed: entry.seed, hash: entry.hash } : null;
  }

  cleanupOldSessions(maxAgeMs: number = 3600000): void {
  }
}

export class PlayerSDK {
  constructor(public readonly address: string) {}

  generateClientSeed(): string {
    return ProvablyFairCore.generateSeed();
  }

  verifyGame(
    serverSeed: string,
    serverSeedHash: string,
    clientSeed: string,
    nonce: number,
    expectedOutcome: number
  ): VerificationResult {
    return ProvablyFairVerifier.verify(
      serverSeed, serverSeedHash, clientSeed, nonce, expectedOutcome
    );
  }

  verifyDice(
    serverSeed: string,
    serverSeedHash: string,
    clientSeed: string,
    nonce: number,
    expectedRoll: number
  ): VerificationResult {
    return ProvablyFairVerifier.verifyDice(
      serverSeed, serverSeedHash, clientSeed, nonce, expectedRoll
    );
  }

  createSlashProof(
    serverSeed: string,
    nonce: number,
    playerAddress: string
  ): SlashProof {
    return ProvablyFairVerifier.createSlashProof(serverSeed, nonce, playerAddress);
  }
}