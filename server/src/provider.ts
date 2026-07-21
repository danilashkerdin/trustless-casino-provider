import { TonClient, WalletContractV4, internal } from 'ton';
import { Cell, beginCell, Address, SendMode, contractAddress } from 'ton-core';
import { mnemonicToPrivateKey } from 'ton-crypto';
import { ProvablyFairCore } from '../../contracts/ts/sdk/provablyFair';
import path from 'path';
import fs from 'fs';

const ROOT = process.cwd();
const BD = path.resolve(ROOT, 'build/tact');

function loadCode(name: string): Cell {
  const p = path.join(BD, `${name}.code.boc`);
  if (!fs.existsSync(p)) throw new Error(`Code not found: ${p}`);
  return Cell.fromBoc(fs.readFileSync(p))[0];
}

export class CasinoProvider {
  client: TonClient;
  wallet: any;
  opened: any;
  address: string;
  seqno: number = 0;

  providerAddr: Address;
  providerAddrRaw: string;
  diceAddr: Address;

  private constructor(
    client: TonClient,
    wallet: any,
    opened: any,
    address: string,
    providerAddr: Address,
    providerAddrRaw: string,
    diceAddr: Address,
  ) {
    this.client = client;
    this.wallet = wallet;
    this.opened = opened;
    this.address = address;
    this.providerAddr = providerAddr;
    this.providerAddrRaw = providerAddrRaw;
    this.diceAddr = diceAddr;
  }

  static async init(rpc: string, apiKey: string): Promise<CasinoProvider> {
    const deployData = JSON.parse(
      fs.readFileSync(path.resolve(ROOT, 'deployed.json'), 'utf-8'),
    );
    const mnemonics = (process.env.WALLET_MNEMONICS || '').split(' ');
    if (mnemonics.length !== 24) throw new Error('WALLET_MNEMONICS required');

    const key = await mnemonicToPrivateKey(mnemonics);
    const wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey });
    const client = new TonClient({ endpoint: rpc, apiKey });
    const opened = client.open(wallet);

    const providerAddr = Address.parse(deployData.providerAddress);
    const diceAddr = Address.parse(deployData.diceGameAddress);

    return new CasinoProvider(client, wallet, opened, wallet.address.toRawString(), providerAddr, deployData.providerAddress, diceAddr);
  }

  async refreshSeqno() {
    try { this.seqno = await this.opened.getSeqno(); } catch { this.seqno = 0; }
  }

  async addStake(amount: bigint): Promise<string> {
    await this.refreshSeqno();
    const body = beginCell().storeUint(0x10, 32).storeUint(0, 64).endCell();
    const msg = internal({ to: this.providerAddr, value: amount, body });
    await this.opened.sendTransfer({ seqno: this.seqno, secretKey: (await this._getKey()).secretKey, sendMode: SendMode.PAY_GAS_SEPARATELY, messages: [msg] });
    return this.providerAddrRaw;
  }

  async withdrawStake(amount: bigint): Promise<string> {
    await this.refreshSeqno();
    const body = beginCell().storeUint(0x11, 32).storeUint(0, 64).storeCoins(amount).endCell();
    const msg = internal({ to: this.providerAddr, value: 50000000n, body });
    await this.opened.sendTransfer({ seqno: this.seqno, secretKey: (await this._getKey()).secretKey, sendMode: SendMode.PAY_GAS_SEPARATELY, messages: [msg] });
    return this.providerAddrRaw;
  }

  async withdrawCommission(amount: bigint): Promise<string> {
    await this.refreshSeqno();
    const body = beginCell().storeUint(0x13, 32).storeUint(0, 64).storeCoins(amount).endCell();
    const msg = internal({ to: this.providerAddr, value: 50000000n, body });
    await this.opened.sendTransfer({ seqno: this.seqno, secretKey: (await this._getKey()).secretKey, sendMode: SendMode.PAY_GAS_SEPARATELY, messages: [msg] });
    return this.providerAddrRaw;
  }

  async revealSeed(params: { nonce: number; serverSeed: string; serverSeedHash: string; guess: number; clientSeed: string; }): Promise<string> {
    await this.refreshSeqno();
    const body = beginCell()
      .storeUint(0x02, 32).storeUint(0, 64)
      .storeUint(params.nonce, 64)
      .storeBuffer(Buffer.from(params.serverSeed, 'hex'))
      .storeUint(BigInt(`0x${params.serverSeedHash}`), 256)
      .storeUint(params.guess, 8)
      .storeBuffer(Buffer.from(params.clientSeed, 'hex'))
    .endCell();
    const msg = internal({ to: this.providerAddr, value: 50000000n, body });
    await this.opened.sendTransfer({ seqno: this.seqno, secretKey: (await this._getKey()).secretKey, sendMode: SendMode.PAY_GAS_SEPARATELY, messages: [msg] });
    return this.providerAddrRaw;
  }

  generateGameSeed(): { seed: string; hash: string } {
    const seed = ProvablyFairCore.generateSeed();
    const hash = ProvablyFairCore.hashSeed(seed);
    return { seed, hash };
  }

  private async _getKey() {
    const mnemonics = (process.env.WALLET_MNEMONICS || '').split(' ');
    return mnemonicToPrivateKey(mnemonics);
  }
}