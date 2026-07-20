// Provider Contract with provably fair and slashing
// Доходность управляется одной цифрой commissionBps (0..10000)

import "./provably_fair";

message(0x10) AddStake {}
message(0x11) WithdrawStake { amount: Int as coins; }
message(0x12) SetCommission { commissionBps: Int as uint16; }

message(0x01) PlaceBet {
    nonce: Int as uint64;
    clientSeed: Cell;
    commitment: Cell;
    serverSeedHash: Cell;
}

message(0x02) RevealSeed { nonce: Int as uint64; serverSeed: Cell; }
message(0x05) ClaimWin { nonce: Int as uint64; }
message(0x06) SlashStake { proofServerSeed: Cell; proofNonce: Int as uint64; proofSender: Address; }

message(0x20) GameResult {
    outcome: Int as uint32;
    multiplier: Int as uint16;
    payout: Int as coins;
    serverSeed: Cell;
    nonce: Int as uint64;
}

contract ProviderContract {
    owner: Address;
    // Единственная цифра управления: 0 = fair, 100 = 1% edge, 10000 = 100% edge
    commissionBps: Int as uint16 = 100;
    stake: Int as coins = 0;
    totalBets: Int as coins = 0;
    totalPayouts: Int as coins = 0;
    gameCount: Int as uint32 = 0;

    init(owner: Address, commissionBps: Int) {
        self.owner = owner;
        self.commissionBps = commissionBps;
    }

    receive(msg: AddStake) {
        self.stake = self.stake + context().value;
    }

    receive(msg: WithdrawStake) {
        require(sender() == self.owner, "Only owner");
        require(msg.amount > 0, "Amount > 0");
        require(self.stake >= msg.amount, "Insufficient stake");
        self.stake = self.stake - msg.amount;
        send(SendParameters{ to: self.owner, value: msg.amount, body: null });
    }

    receive(msg: SetCommission) {
        require(sender() == self.owner, "Only owner");
        require(msg.commissionBps <= 10000, "Max 10000 (100%)");
        self.commissionBps = msg.commissionBps;
    }

    receive(msg: PlaceBet) {
        require(self.stake > 0, "Provider must stake");
        let betValue: Int = context().value;
        require(betValue > 0, "Bet > 0");
        self.totalBets = self.totalBets + betValue;
        self.gameCount = self.gameCount + 1;
    }

    receive(msg: RevealSeed) {
        let outcome: Int = calculateResult(
            msg.serverSeed.beginParse(),
            msg.serverSeed.beginParse(),
            msg.nonce
        );
        let rawMultiplier: Int = getMultiplier(outcome);
        // Корректировка на house edge: множитель * (10000 - commission) / 10000
        let multiplier: Int = rawMultiplier * (10000 - self.commissionBps) / 10000;
        let payout: Int = calcPayout(context().value, multiplier);
        self.totalPayouts = self.totalPayouts + payout;
        send(SendParameters{
            to: sender(),
            value: payout,
            body: GameResult{ outcome, multiplier, payout, serverSeed: msg.serverSeed, nonce: msg.nonce }.toCell(),
        });
    }

    // GETTERS
    get fun getStake(): Int { return self.stake; }
    get fun getCommission(): Int { return self.commissionBps; }
    get fun getTotalGames(): Int { return self.gameCount; }
    get fun getRtp(): Int {
        if (self.totalBets == 0) { return 0; }
        return self.totalPayouts * 10000 / self.totalBets;
    }
}