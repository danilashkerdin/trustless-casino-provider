export interface GameResult {
  serverSeed: string;
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
  outcome: number;
  multiplier: number;
  payout: string;
}

export interface BetInfo {
  sender: string;
  nonce: number;
  clientSeed: string;
  commitment: string;
  serverSeedHash: string;
  betAmount: string;
  deadline: number;
  status: 'active' | 'revealed' | 'claimed' | 'expired';
}

export interface ProviderInfo {
  address: string;
  owner: string;
  stake: string;
  commissionBps: number;
  totalBets: string;
  totalPayouts: string;
  gameCount: number;
}

export interface VerificationResult {
  gameIsFair: boolean;
  serverSeedIntegrity: boolean;  // SHA256(serverSeed) === serverSeedHash
  outcomeIntegrity: boolean;     // F(serverSeed, clientSeed, nonce) === outcome
  details: {
    computedServerSeedHash: string;
    expectedServerSeedHash: string;
    computedOutcome: number;
    expectedOutcome: number;
  };
}

export interface SlashProof {
  serverSeed: string;
  nonce: number;
  playerAddress: string;
}