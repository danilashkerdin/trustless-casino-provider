import { describe, it, expect } from 'vitest';
import { ProvablyFairCore, ProvablyFairVerifier } from '../contracts/ts/sdk/provablyFair';
import { ProviderSDK, PlayerSDK } from '../contracts/ts/sdk/providerSDK';

describe('ProvablyFairCore', () => {
  it('generateSeed produces 32-byte hex string', () => {
    const seed = ProvablyFairCore.generateSeed();
    expect(seed).toHaveLength(64);
    expect(/^[0-9a-f]+$/.test(seed)).toBe(true);
  });

  it('hashSeed returns SHA256 of seed', () => {
    const seed = 'aa'.repeat(32);
    const hash = ProvablyFairCore.hashSeed(seed);
    expect(hash).toHaveLength(64);
  });

  it('hashSeed matches manual SHA256 of hex buffer', () => {
    const seedHex = 'abcdef1234567890'.repeat(8);
    const hashHex = ProvablyFairCore.hashSeed(seedHex);
    const { createHash } = require('crypto');
    const manual = createHash('sha256').update(Buffer.from(seedHex, 'hex')).digest('hex');
    expect(hashHex).toBe(manual);
  });

  it('calculateResult is deterministic', () => {
    const a = ProvablyFairCore.calculateResult('aa', 'bb', 1);
    const b = ProvablyFairCore.calculateResult('aa', 'bb', 1);
    expect(a.equals(b)).toBe(true);
  });

  it('calculateResult changes when nonce changes', () => {
    const a = ProvablyFairCore.calculateResult('aa', 'bb', 1);
    const b = ProvablyFairCore.calculateResult('aa', 'bb', 2);
    expect(a.equals(b)).toBe(false);
  });

  it('hashToRange returns value in [0, range)', () => {
    const hash = ProvablyFairCore.calculateResult('aa', 'bb', 1);
    for (const range of [6, 100, 10000]) {
      const val = ProvablyFairCore.hashToRange(hash, range);
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(range);
    }
  });

  it('diceResult returns 1-6', () => {
    for (let i = 0; i < 100; i++) {
      const seed = ProvablyFairCore.generateSeed();
      const client = ProvablyFairCore.generateSeed();
      const roll = ProvablyFairCore.diceResult(seed, client, i);
      expect(roll).toBeGreaterThanOrEqual(1);
      expect(roll).toBeLessThanOrEqual(6);
    }
  });

  it('getMultiplier returns expected values', () => {
    expect(ProvablyFairCore.getMultiplier(9500)).toBe(100000);
    expect(ProvablyFairCore.getMultiplier(9000)).toBe(50000);
    expect(ProvablyFairCore.getMultiplier(8000)).toBe(30000);
    expect(ProvablyFairCore.getMultiplier(6000)).toBe(20000);
    expect(ProvablyFairCore.getMultiplier(4000)).toBe(15000);
    expect(ProvablyFairCore.getMultiplier(2000)).toBe(10000);
    expect(ProvablyFairCore.getMultiplier(0)).toBe(0);
  });

  it('createCommitment matches SHA256(serverSeedHash + clientSeed)', () => {
    const ssh = 'aa'.repeat(32);
    const cs = 'bb'.repeat(32);
    const commitment = ProvablyFairCore.createCommitment(ssh, cs);
    expect(commitment).toHaveLength(64);
    // Deterministic
    expect(ProvablyFairCore.createCommitment(ssh, cs)).toBe(commitment);
  });

  it('calcPayout: 10 TON @ x2 = 20 TON', () => {
    const payout = ProvablyFairCore.calcPayout(BigInt(10_000_000_000), 20000);
    expect(payout).toBe(BigInt(20_000_000_000));
  });

  it('calcPayout: 10 TON @ lose = 0', () => {
    const payout = ProvablyFairCore.calcPayout(BigInt(10_000_000_000), 0);
    expect(payout).toBe(BigInt(0));
  });
});

describe('ProvablyFairVerifier', () => {
  it('verifies a fair game', () => {
    const serverSeed = ProvablyFairCore.generateSeed();
    const clientSeed = ProvablyFairCore.generateSeed();
    const nonce = 42;

    const serverSeedHash = ProvablyFairCore.hashSeed(serverSeed);
    const hash = ProvablyFairCore.calculateResult(serverSeed, clientSeed, nonce);
    const outcome = ProvablyFairCore.hashToRange(hash, 10000);

    const result = ProvablyFairVerifier.verify(
      serverSeed, serverSeedHash, clientSeed, nonce, outcome
    );

    expect(result.gameIsFair).toBe(true);
    expect(result.serverSeedIntegrity).toBe(true);
    expect(result.outcomeIntegrity).toBe(true);
  });

  it('detects tampered serverSeed', () => {
    const realSeed = ProvablyFairCore.generateSeed();
    const fakeSeed = ProvablyFairCore.generateSeed();
    const clientSeed = ProvablyFairCore.generateSeed();
    const nonce = 42;

    const serverSeedHash = ProvablyFairCore.hashSeed(realSeed);
    const hash = ProvablyFairCore.calculateResult(realSeed, clientSeed, nonce);
    const outcome = ProvablyFairCore.hashToRange(hash, 10000);

    const result = ProvablyFairVerifier.verify(
      fakeSeed, serverSeedHash, clientSeed, nonce, outcome
    );

    expect(result.gameIsFair).toBe(false);
    expect(result.serverSeedIntegrity).toBe(false);
  });

  it('detects outcome manipulation', () => {
    const serverSeed = ProvablyFairCore.generateSeed();
    const clientSeed = ProvablyFairCore.generateSeed();
    const nonce = 42;

    const serverSeedHash = ProvablyFairCore.hashSeed(serverSeed);

    const result = ProvablyFairVerifier.verify(
      serverSeed, serverSeedHash, clientSeed, nonce, 9999
    );

    expect(result.gameIsFair).toBe(false);
    expect(result.outcomeIntegrity).toBe(false);
  });

  it('verifies dice game', () => {
    const serverSeed = ProvablyFairCore.generateSeed();
    const clientSeed = ProvablyFairCore.generateSeed();
    const nonce = 42;

    const serverSeedHash = ProvablyFairCore.hashSeed(serverSeed);
    const diceRoll = ProvablyFairCore.diceResult(serverSeed, clientSeed, nonce);

    const result = ProvablyFairVerifier.verifyDice(
      serverSeed, serverSeedHash, clientSeed, nonce, diceRoll
    );

    expect(result.gameIsFair).toBe(true);
    expect(result.details.computedOutcome).toBe(diceRoll);
  });

  it('createSlashProof returns correct proof', () => {
    const proof = ProvablyFairVerifier.createSlashProof('seed', 42, 'addr');
    expect(proof.serverSeed).toBe('seed');
    expect(proof.nonce).toBe(42);
    expect(proof.playerAddress).toBe('addr');
  });
});

describe('ProviderSDK + PlayerSDK integration', () => {
  it('full game lifecycle with verification', () => {
    const provider = new ProviderSDK(
      'EQD...owner',
      'EQD...provider',
      BigInt(1000) * BigInt(10**9),
      100
    );
    const player = new PlayerSDK('EQD...player');

    const gameId = 'game-001';
    const betAmount = BigInt(10) * BigInt(10**9);

    const { serverSeedHash } = provider.initGame(gameId);
    expect(serverSeedHash).toHaveLength(64);

    const clientSeed = player.generateClientSeed();
    const commitment = provider.createClientCommitment(serverSeedHash, clientSeed);
    expect(commitment).toHaveLength(64);

    const nonce = 1;
    const result = provider.resolveGame(gameId, clientSeed, nonce, betAmount);
    expect(result.outcome).toBeGreaterThanOrEqual(0);
    expect(result.outcome).toBeLessThan(10000);

    const verification = player.verifyGame(
      result.serverSeed,
      serverSeedHash,
      clientSeed,
      nonce,
      result.outcome
    );

    expect(verification.gameIsFair).toBe(true);
    expect(verification.serverSeedIntegrity).toBe(true);
    expect(verification.outcomeIntegrity).toBe(true);

    // Verify seeds are available
    const seedData = provider.getSeedForGame(gameId);
    expect(seedData?.seed).toBe(result.serverSeed);
    expect(seedData?.hash).toBe(serverSeedHash);
  });

  it('full lifecycle with commission deduction', () => {
    const provider = new ProviderSDK('owner', 'provider', BigInt(1000e9), 500); // 5%
    const player = new PlayerSDK('player');

    const gameId = 'game-002';
    provider.initGame(gameId);
    const result = provider.resolveGame(gameId, player.generateClientSeed(), 1, BigInt(100e9));

    const payoutWithFee = provider.calculatePayoutWithFee(result);
    const expectedFee = BigInt(result.payout) * BigInt(500) / BigInt(10000);
    expect(payoutWithFee).toBe(BigInt(result.payout) - expectedFee);
  });

  it('detects cheating provider', () => {
    const provider = new ProviderSDK('EQD...owner', 'EQD...provider');
    const player = new PlayerSDK('EQD...player');

    const gameId = 'cheat-game';
    const { serverSeedHash } = provider.initGame(gameId);
    const clientSeed = player.generateClientSeed();

    const fakeGameId = 'fake-game';
    provider.initGame(fakeGameId);
    const fakeSeed = provider.getSeedForGame(fakeGameId)!;

    const verification = player.verifyGame(
      fakeSeed.seed,
      serverSeedHash,
      clientSeed,
      1,
      5000
    );

    expect(verification.gameIsFair).toBe(false);
    expect(verification.serverSeedIntegrity).toBe(false);

    const slashProof = player.createSlashProof(fakeSeed.seed, 1, player.address);
    expect(slashProof.serverSeed).toBe(fakeSeed.seed);
    expect(slashProof.nonce).toBe(1);
  });

  it('rejects reused nonce within same game', () => {
    const provider = new ProviderSDK('owner', 'provider');
    const player = new PlayerSDK('player');

    const gameId = 'nonce-test';
    const clientSeed = player.generateClientSeed();

    // Resolve with nonce 1
    provider.initGame(gameId);
    provider.resolveGame(gameId, clientSeed, 1, BigInt(10e9));

    // Try to use nonce 1 again (same gameId) — different seed entry so init again
    provider.initGame(gameId);
    expect(() => {
      provider.resolveGame(gameId, clientSeed, 1, BigInt(10e9));
    }).toThrow('Nonce 1 reused');
  });
});