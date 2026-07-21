import "./provably_fair";

message(0x10) AddStake {}
message(0x11) WithdrawStake { amount: Int as coins; }
message(0x12) SetCommission { commissionBps: Int as uint16; }
message(0x13) WithdrawCommission { amount: Int as coins; }

message(0x01) PlaceBet {
    nonce: Int as uint64;
    guess: Int as uint8;
    clientSeed: Cell;
    serverSeedHash: Int as uint256;
}

message(0x02) RevealSeed {
    nonce: Int as uint64;
    serverSeed: Slice;
    serverSeedHash: Int as uint256;
    guess: Int as uint8;
    clientSeed: Cell;
}

message(0x20) GameResult {
    outcome: Int as uint32;
    win: Bool;
    multiplierBps: Int as uint16;
    grossPayout: Int as coins;
    commissionTaken: Int as coins;
    netPayout: Int as coins;
    serverSeed: Cell;
    nonce: Int as uint64;
}

message(0x30) SlashStake {
    nonce: Int as uint64;
    expectedHash: Int as uint256;
    actualServerSeed: Slice;
    clientSeed: Cell;
    betAmount: Int as coins;
    guess: Int as uint8;
}

contract ProviderContract {
    owner: Address;
    commissionBps: Int as uint16 = 100;
    stake: Int as coins = 0;
    totalBets: Int as coins = 0;
    totalPayouts: Int as coins = 0;
    totalCommission: Int as coins = 0;
    gameCount: Int as uint32 = 0;

    pendingSender: Address;
    pendingBetAmount: Int as coins = 0;
    pendingGuess: Int as uint8 = 0;
    pendingSeedHash: Int as uint256 = 0;

    init(owner: Address, commissionBps: Int) {
        self.owner = owner;
        self.commissionBps = commissionBps;
        self.pendingSender = owner;
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

    receive(msg: WithdrawCommission) {
        require(sender() == self.owner, "Only owner");
        require(msg.amount > 0, "Amount > 0");
        require(self.totalCommission >= msg.amount, "Insufficient commission");
        self.totalCommission = self.totalCommission - msg.amount;
        send(SendParameters{ to: self.owner, value: msg.amount, body: null });
    }

    receive(msg: PlaceBet) {
        require(self.stake > 0, "Provider stake required");
        require(msg.guess >= 1 && msg.guess <= 6, "Guess 1-6");
        let betValue: Int = context().value;
        require(betValue > 0, "Bet > 0");
        require(self.pendingBetAmount == 0, "Resolve previous bet first");

        self.pendingSender = sender();
        self.pendingBetAmount = betValue;
        self.pendingGuess = msg.guess;
        self.pendingSeedHash = msg.serverSeedHash;
        self.totalBets = self.totalBets + betValue;
        self.gameCount = self.gameCount + 1;
    }

    receive(msg: RevealSeed) {
        require(self.stake > 0, "No stake");
        require(self.pendingBetAmount > 0, "No pending bet");

        // Verify: sha256(serverSeed) == stored serverSeedHash
        let computedHash: Int = sha256(msg.serverSeed);
        require(computedHash == self.pendingSeedHash, "Seed mismatch — slash!");

        let roll: Int = diceRoll(
            msg.serverSeed,
            msg.clientSeed.beginParse(),
            msg.nonce
        );

        let win: Bool = roll == self.pendingGuess;

        let grossPayout: Int = 0;
        let commissionTaken: Int = 0;
        let netPayout: Int = 0;

        if (win) {
            grossPayout = self.pendingBetAmount * 6;
            commissionTaken = grossPayout * self.commissionBps / 10000;
            if (commissionTaken > grossPayout) { commissionTaken = grossPayout; }
            netPayout = grossPayout - commissionTaken;
            require(self.stake >= netPayout, "Insufficient stake");
            self.stake = self.stake - netPayout;
            self.totalPayouts = self.totalPayouts + netPayout;
            self.totalCommission = self.totalCommission + commissionTaken;
        }

        self.pendingBetAmount = 0;
        self.pendingGuess = 0;
        self.pendingSeedHash = 0;

        let replyBody: Cell = beginCell()
            .storeUint(roll, 32)
            .storeBit(win)
            .storeUint(win ? 60000 : 0, 16)
            .storeCoins(grossPayout)
            .storeCoins(commissionTaken)
            .storeCoins(netPayout)
            .storeSlice(msg.serverSeed)
            .storeUint(msg.nonce, 64)
        .endCell();

        send(SendParameters{
            to: self.pendingSender,
            value: netPayout,
            body: replyBody,
        });
    }

    receive(msg: SlashStake) {
        let computedHash: Int = sha256(msg.actualServerSeed);
        require(computedHash != msg.expectedHash, "Seed matches — no slash");

        // Provider cheated: pay player as if they won
        let owed: Int = msg.betAmount * 6;
        if (owed > self.stake) { owed = self.stake; }
        self.stake = self.stake - owed;
        self.totalPayouts = self.totalPayouts + owed;
        send(SendParameters{ to: sender(), value: owed, body: null });
    }

    get fun getStake(): Int { return self.stake; }
    get fun getCommission(): Int { return self.commissionBps; }
    get fun getTotalCommission(): Int { return self.totalCommission; }
    get fun getTotalGames(): Int { return self.gameCount; }
    get fun getRtp(): Int {
        if (self.totalBets == 0) { return 0; }
        return self.totalPayouts * 10000 / self.totalBets;
    }
}