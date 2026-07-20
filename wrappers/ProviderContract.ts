import { Contract, ContractProvider, Sender, Address, Cell, beginCell, contractAddress, StateInit } from 'ton-core';
import { TonClient } from 'ton';

export class ProviderContract implements Contract {
  constructor(readonly address: Address, readonly init?: StateInit) {}
  
  static createFromConfig(config: { owner: Address; commissionBps: number }, code: Cell): ProviderContract {
    const data = beginCell()
      .storeAddress(config.owner)
      .storeUint(config.commissionBps, 16)
    .endCell();
    const init = { code, data };
    const address = contractAddress(0, init);
    return new ProviderContract(address, init);
  }
}

export class DiceGame implements Contract {
  constructor(readonly address: Address, readonly init?: StateInit) {}
  
  static createFromConfig(code: Cell): DiceGame {
    const data = beginCell()
      .storeCoins(100000000)    // minBet 0.1 TON
      .storeCoins(100000000000) // maxBet 100 TON
      .storeUint(500, 16)       // houseEdgeBps
      .storeUint(0, 8)          // state
    .endCell();
    const init = { code, data };
    const address = contractAddress(0, init);
    return new DiceGame(address, init);
  }
}