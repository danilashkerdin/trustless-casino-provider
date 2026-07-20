// ProvablyFair — core functions for trustless casino

fun makeBetKey(sender: Address, nonce: Int): Int {
    return sha256(beginCell()
        .storeAddress(sender)
        .storeUint(nonce, 64)
    .endCell().asSlice());
}

fun calculateResult(serverSeed: Slice, clientSeed: Slice, nonce: Int): Int {
    return sha256(beginCell()
        .storeSlice(serverSeed)
        .storeSlice(clientSeed)
        .storeUint(nonce, 64)
    .endCell().asSlice()) % 10000;
}

fun diceRoll(serverSeed: Slice, clientSeed: Slice, nonce: Int): Int {
    return (sha256(beginCell()
        .storeSlice(serverSeed)
        .storeSlice(clientSeed)
        .storeUint(nonce, 64)
    .endCell().asSlice()) % 6) + 1;
}

fun getMultiplier(outcome: Int): Int {
    if (outcome >= 9500) { return 100000; }
    if (outcome >= 9000) { return 50000; }
    if (outcome >= 8000) { return 30000; }
    if (outcome >= 6000) { return 20000; }
    if (outcome >= 4000) { return 15000; }
    if (outcome >= 2000) { return 10000; }
    return 0;
}

fun calcPayout(bet: Int, multiplier: Int): Int {
    return bet * multiplier / 10000;
}