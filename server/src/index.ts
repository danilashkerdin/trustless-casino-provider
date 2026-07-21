import express from 'express';
import cors from 'cors';
import path from 'path';
import { CasinoProvider } from './provider';

const app = express();
const PORT = process.env.PORT || 3000;
const RPC = 'https://testnet.toncenter.com/api/v2/jsonRPC';
const API_KEY = process.env.TON_API_KEY || '';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://trustless-casino-provider.onrender.com';

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

let provider: CasinoProvider;

async function init() {
  try {
    provider = await CasinoProvider.init(RPC, API_KEY);
    console.log('Provider wallet:', provider.address);
    console.log('ProviderContract:', provider.providerAddrRaw);
  } catch (e: any) {
    console.error('Provider init failed:', e.message);
    process.exit(1);
  }
}

// ── Provider management ──

app.post('/api/stake', async (req, res) => {
  try {
    const amount = BigInt(req.body.amount || '1000000000');
    const tx = await provider.addStake(amount);
    res.json({ ok: true, tx, amount: amount.toString() });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/api/withdraw-stake', async (req, res) => {
  try {
    const amount = BigInt(req.body.amount || '0');
    const tx = await provider.withdrawStake(amount);
    res.json({ ok: true, tx });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/api/withdraw-commission', async (req, res) => {
  try {
    const amount = BigInt(req.body.amount || '0');
    const tx = await provider.withdrawCommission(amount);
    res.json({ ok: true, tx });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ── Game flow ──

app.post('/api/init-game', (req, res) => {
  try {
    const { seed, hash } = provider.generateGameSeed();
    res.json({ ok: true, serverSeed: seed, serverSeedHash: hash });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/api/reveal', async (req, res) => {
  try {
    const { nonce, serverSeed, serverSeedHash, guess, clientSeed } = req.body;
    if (!nonce || !serverSeed || !serverSeedHash || !guess || !clientSeed) {
      res.status(400).json({ ok: false, error: 'Missing fields' });
      return;
    }
    const tx = await provider.revealSeed({ nonce, serverSeed, serverSeedHash, guess, clientSeed });
    res.json({ ok: true, tx });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/api/status', (_req, res) => {
  res.json({
    status: 'ok',
    network: 'testnet',
    providerAddress: provider?.providerAddrRaw || '',
    diceAddress: provider?.diceAddr.toRawString() || '',
  });
});

app.get('/api/config', (_req, res) => {
  res.json({
    providerAddress: provider?.providerAddrRaw || '',
    network: 'testnet',
    rpc: RPC,
    commissionBps: 500,
  });
});

app.post('/api/build-bet-payload', async (req, res) => {
  try {
    const { nonce, guess, clientSeed, serverSeedHash } = req.body;
    if (!nonce || !guess || !clientSeed || !serverSeedHash) {
      res.status(400).json({ ok: false, error: 'Missing fields' });
      return;
    }
    const { beginCell } = await import('ton-core');
    const clientSeedBuff = Buffer.from(clientSeed, 'hex');
    const seedHashVal = BigInt(`0x${serverSeedHash}`);
    const cell = beginCell()
      .storeUint(0x01, 32)
      .storeUint(0, 64)
      .storeUint(nonce, 64)
      .storeUint(guess, 8)
      .storeBuffer(clientSeedBuff)
      .storeUint(seedHashVal, 256)
    .endCell();
    const boc = cell.toBoc().toString('hex');
    res.json({ ok: true, payload: boc });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

init().then(() => {
  app.listen(PORT, () => {
    console.log(`Trustless Casino Server — http://localhost:${PORT}`);
    console.log(`API: ${PORT}/api/status`);
  });
});