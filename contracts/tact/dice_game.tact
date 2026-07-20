import "./provably_fair";

// DiceGame — stateless: только вычисляет результат, НЕ держит деньги.
// Все финансы — в ProviderContract.

message(0x21) BetDice {
    nonce: Int as uint64;
    guess: Int as uint8;
    clientSeed: Cell;
    serverSeedHash: Cell;
}

message(0x22) RevealDice {
    nonce: Int as uint64;
    serverSeed: Cell;
    guess: Int as uint8;
    clientSeed: Cell;
}

message(0x24) DiceResult {
    diceRoll: Int as uint8;
    win: Bool;
    payoutMultiplier: Int as uint16; // в basis points: 60000 = 6x
    serverSeedHash: Cell;
    nonce: Int as uint64;
}

contract DiceGame {
    owner: Address;

    init(owner: Address) {
        self.owner = owner;
    }

    // Вычисляет результат броска, возвращает payout multiplier bps
    // Вызывается ProviderContract, НЕ напрямую игроком
    receive(msg: RevealDice) {
        require(sender() == self.owner, "Only provider");

        let roll: Int = diceRoll(
            msg.serverSeed.beginParse(),
            msg.clientSeed.beginParse(),
            msg.nonce
        );

        // guess 1-6, roll 1-6, прямой гейт
        let win: Bool = roll == msg.guess;
        let payoutBps: Int = 0;
        if (win) {
            // 6x = 60000 bps
            payoutBps = 60000;
        }

        send(SendParameters{
            to: sender(),
            value: 0,
            body: DiceResult{
                diceRoll: roll,
                win: win,
                payoutMultiplier: payoutBps,
                serverSeedHash: beginCell().storeSlice(msg.serverSeed.beginParse()).endCell(),
                nonce: msg.nonce
            }.toCell(),
        });
    }
}