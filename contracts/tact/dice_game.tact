import "./provably_fair";

message(0x21) BetDice {
    nonce: Int as uint64;
    guess: Int as uint8;
    clientSeed: Cell;
    commitment: Cell;
    serverSeedHash: Cell;
}

message(0x22) RevealDice { nonce: Int as uint64; serverSeed: Cell; guess: Int as uint8; }
message(0x24) DiceResult { diceRoll: Int as uint8; serverSeed: Cell; nonce: Int as uint64; }

contract DiceGame {
    minBet: Int as coins = 100000000;
    maxBet: Int as coins = 100000000000;
    houseEdgeBps: Int as uint16 = 500;
    state: Int as uint8 = 0;
    totalBets: Int as coins = 0;
    totalPayouts: Int as coins = 0;

    pendingNonce: Int as uint64 = 0;
    pendingBet: Int as coins = 0;
    pendingGuess: Int as uint8 = 0;

    receive(msg: BetDice) {
        require(self.state == 0, "Paused");
        require(msg.guess >= 1 && msg.guess <= 6, "1-6 only");
        require(self.pendingNonce == 0, "Reveal previous bet first");
        let betValue: Int = context().value;
        require(betValue >= self.minBet, "Min bet");
        require(betValue <= self.maxBet, "Max bet");
        self.pendingNonce = msg.nonce;
        self.pendingBet = betValue;
        self.pendingGuess = msg.guess;
        self.totalBets = self.totalBets + betValue;
    }

    receive(msg: RevealDice) {
        require(msg.nonce == self.pendingNonce, "Nonce mismatch");
        require(self.pendingBet > 0, "No pending bet");

        let roll: Int = diceRoll(
            msg.serverSeed.beginParse(),
            msg.serverSeed.beginParse(),
            msg.nonce
        );

        let payout: Int = 0;
        if (roll == msg.guess) {
            payout = self.pendingBet * 6;
            payout = payout * (10000 - self.houseEdgeBps) / 10000;
        }

        self.pendingNonce = 0;
        self.pendingBet = 0;
        self.pendingGuess = 0;
        self.totalPayouts = self.totalPayouts + payout;
        send(SendParameters{
            to: sender(),
            value: payout,
            body: DiceResult{ diceRoll: roll, serverSeed: msg.serverSeed, nonce: msg.nonce }.toCell(),
        });
    }
}