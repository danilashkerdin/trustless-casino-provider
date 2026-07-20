# Tact compilation report
Contract: ProviderContract
BoC Size: 950 bytes

## Structures (Structs and Messages)
Total structures: 19

### DataSize
TL-B: `_ cells:int257 bits:int257 refs:int257 = DataSize`
Signature: `DataSize{cells:int257,bits:int257,refs:int257}`

### SignedBundle
TL-B: `_ signature:fixed_bytes64 signedData:remainder<slice> = SignedBundle`
Signature: `SignedBundle{signature:fixed_bytes64,signedData:remainder<slice>}`

### StateInit
TL-B: `_ code:^cell data:^cell = StateInit`
Signature: `StateInit{code:^cell,data:^cell}`

### Context
TL-B: `_ bounceable:bool sender:address value:int257 raw:^slice = Context`
Signature: `Context{bounceable:bool,sender:address,value:int257,raw:^slice}`

### SendParameters
TL-B: `_ mode:int257 body:Maybe ^cell code:Maybe ^cell data:Maybe ^cell value:int257 to:address bounce:bool = SendParameters`
Signature: `SendParameters{mode:int257,body:Maybe ^cell,code:Maybe ^cell,data:Maybe ^cell,value:int257,to:address,bounce:bool}`

### MessageParameters
TL-B: `_ mode:int257 body:Maybe ^cell value:int257 to:address bounce:bool = MessageParameters`
Signature: `MessageParameters{mode:int257,body:Maybe ^cell,value:int257,to:address,bounce:bool}`

### DeployParameters
TL-B: `_ mode:int257 body:Maybe ^cell value:int257 bounce:bool init:StateInit{code:^cell,data:^cell} = DeployParameters`
Signature: `DeployParameters{mode:int257,body:Maybe ^cell,value:int257,bounce:bool,init:StateInit{code:^cell,data:^cell}}`

### StdAddress
TL-B: `_ workchain:int8 address:uint256 = StdAddress`
Signature: `StdAddress{workchain:int8,address:uint256}`

### VarAddress
TL-B: `_ workchain:int32 address:^slice = VarAddress`
Signature: `VarAddress{workchain:int32,address:^slice}`

### BasechainAddress
TL-B: `_ hash:Maybe int257 = BasechainAddress`
Signature: `BasechainAddress{hash:Maybe int257}`

### AddStake
TL-B: `add_stake#00000010  = AddStake`
Signature: `AddStake{}`

### WithdrawStake
TL-B: `withdraw_stake#00000011 amount:coins = WithdrawStake`
Signature: `WithdrawStake{amount:coins}`

### SetCommission
TL-B: `set_commission#00000012 commissionBps:uint16 = SetCommission`
Signature: `SetCommission{commissionBps:uint16}`

### PlaceBet
TL-B: `place_bet#00000001 nonce:uint64 clientSeed:^cell commitment:^cell serverSeedHash:^cell = PlaceBet`
Signature: `PlaceBet{nonce:uint64,clientSeed:^cell,commitment:^cell,serverSeedHash:^cell}`

### RevealSeed
TL-B: `reveal_seed#00000002 nonce:uint64 serverSeed:^cell = RevealSeed`
Signature: `RevealSeed{nonce:uint64,serverSeed:^cell}`

### ClaimWin
TL-B: `claim_win#00000005 nonce:uint64 = ClaimWin`
Signature: `ClaimWin{nonce:uint64}`

### SlashStake
TL-B: `slash_stake#00000006 proofServerSeed:^cell proofNonce:uint64 proofSender:address = SlashStake`
Signature: `SlashStake{proofServerSeed:^cell,proofNonce:uint64,proofSender:address}`

### GameResult
TL-B: `game_result#00000020 outcome:uint32 multiplier:uint16 payout:coins serverSeed:^cell nonce:uint64 = GameResult`
Signature: `GameResult{outcome:uint32,multiplier:uint16,payout:coins,serverSeed:^cell,nonce:uint64}`

### ProviderContract$Data
TL-B: `_ owner:address commissionBps:uint16 stake:coins totalBets:coins totalPayouts:coins gameCount:uint32 = ProviderContract`
Signature: `ProviderContract{owner:address,commissionBps:uint16,stake:coins,totalBets:coins,totalPayouts:coins,gameCount:uint32}`

## Get methods
Total get methods: 4

## getStake
No arguments

## getCommission
No arguments

## getTotalGames
No arguments

## getRtp
No arguments

## Exit codes
* 2: Stack underflow
* 3: Stack overflow
* 4: Integer overflow
* 5: Integer out of expected range
* 6: Invalid opcode
* 7: Type check error
* 8: Cell overflow
* 9: Cell underflow
* 10: Dictionary error
* 11: 'Unknown' error
* 12: Fatal error
* 13: Out of gas error
* 14: Virtualization error
* 32: Action list is invalid
* 33: Action list is too long
* 34: Action is invalid or not supported
* 35: Invalid source address in outbound message
* 36: Invalid destination address in outbound message
* 37: Not enough Toncoin
* 38: Not enough extra currencies
* 39: Outbound message does not fit into a cell after rewriting
* 40: Cannot process a message
* 41: Library reference is null
* 42: Library change action error
* 43: Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree
* 50: Account state size exceeded limits
* 128: Null reference exception
* 129: Invalid serialization prefix
* 130: Invalid incoming message
* 131: Constraints error
* 132: Access denied
* 133: Contract stopped
* 134: Invalid argument
* 135: Code of a contract was not found
* 136: Invalid standard address
* 138: Not a basechain address
* 11977: Amount > 0
* 20824: Max 10000 (100%)
* 21245: Insufficient stake
* 35499: Only owner
* 43379: Provider must stake
* 56646: Bet > 0

## Trait inheritance diagram

```mermaid
graph TD
ProviderContract
ProviderContract --> BaseTrait
```

## Contract dependency diagram

```mermaid
graph TD
ProviderContract
```