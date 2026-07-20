import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    address,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type DataSize = {
    $$type: 'DataSize';
    cells: bigint;
    bits: bigint;
    refs: bigint;
}

export function storeDataSize(src: DataSize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}

export function loadDataSize(slice: Slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadGetterTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function storeTupleDataSize(source: DataSize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}

export function dictValueParserDataSize(): DictionaryValue<DataSize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    }
}

export type SignedBundle = {
    $$type: 'SignedBundle';
    signature: Buffer;
    signedData: Slice;
}

export function storeSignedBundle(src: SignedBundle) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.signedData.asBuilder());
    };
}

export function loadSignedBundle(slice: Slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadBuffer(64);
    const _signedData = sc_0;
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadGetterTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function storeTupleSignedBundle(source: SignedBundle) {
    const builder = new TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.signedData.asCell());
    return builder.build();
}

export function dictValueParserSignedBundle(): DictionaryValue<SignedBundle> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSignedBundle(src)).endCell());
        },
        parse: (src) => {
            return loadSignedBundle(src.loadRef().beginParse());
        }
    }
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadGetterTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function storeTupleStateInit(source: StateInit) {
    const builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

export function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounceable: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadGetterTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function storeTupleContext(source: Context) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

export function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadSendParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleSendParameters(source: SendParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type MessageParameters = {
    $$type: 'MessageParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadMessageParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleMessageParameters(source: MessageParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    }
}

export type DeployParameters = {
    $$type: 'DeployParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    bounce: boolean;
    init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}

export function loadDeployParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadGetterTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function storeTupleDeployParameters(source: DeployParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}

export function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleStdAddress(source: StdAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

export function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleVarAddress(source: VarAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

export function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type BasechainAddress = {
    $$type: 'BasechainAddress';
    hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
    };
}

export function loadBasechainAddress(slice: Slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadGetterTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function storeTupleBasechainAddress(source: BasechainAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}

export function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    }
}

export type AddStake = {
    $$type: 'AddStake';
}

export function storeAddStake(src: AddStake) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(16, 32);
    };
}

export function loadAddStake(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 16) { throw Error('Invalid prefix'); }
    return { $$type: 'AddStake' as const };
}

export function loadTupleAddStake(source: TupleReader) {
    return { $$type: 'AddStake' as const };
}

export function loadGetterTupleAddStake(source: TupleReader) {
    return { $$type: 'AddStake' as const };
}

export function storeTupleAddStake(source: AddStake) {
    const builder = new TupleBuilder();
    return builder.build();
}

export function dictValueParserAddStake(): DictionaryValue<AddStake> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAddStake(src)).endCell());
        },
        parse: (src) => {
            return loadAddStake(src.loadRef().beginParse());
        }
    }
}

export type WithdrawStake = {
    $$type: 'WithdrawStake';
    amount: bigint;
}

export function storeWithdrawStake(src: WithdrawStake) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(17, 32);
        b_0.storeCoins(src.amount);
    };
}

export function loadWithdrawStake(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 17) { throw Error('Invalid prefix'); }
    const _amount = sc_0.loadCoins();
    return { $$type: 'WithdrawStake' as const, amount: _amount };
}

export function loadTupleWithdrawStake(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'WithdrawStake' as const, amount: _amount };
}

export function loadGetterTupleWithdrawStake(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'WithdrawStake' as const, amount: _amount };
}

export function storeTupleWithdrawStake(source: WithdrawStake) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserWithdrawStake(): DictionaryValue<WithdrawStake> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeWithdrawStake(src)).endCell());
        },
        parse: (src) => {
            return loadWithdrawStake(src.loadRef().beginParse());
        }
    }
}

export type SetCommission = {
    $$type: 'SetCommission';
    commissionBps: bigint;
}

export function storeSetCommission(src: SetCommission) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(18, 32);
        b_0.storeUint(src.commissionBps, 16);
    };
}

export function loadSetCommission(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 18) { throw Error('Invalid prefix'); }
    const _commissionBps = sc_0.loadUintBig(16);
    return { $$type: 'SetCommission' as const, commissionBps: _commissionBps };
}

export function loadTupleSetCommission(source: TupleReader) {
    const _commissionBps = source.readBigNumber();
    return { $$type: 'SetCommission' as const, commissionBps: _commissionBps };
}

export function loadGetterTupleSetCommission(source: TupleReader) {
    const _commissionBps = source.readBigNumber();
    return { $$type: 'SetCommission' as const, commissionBps: _commissionBps };
}

export function storeTupleSetCommission(source: SetCommission) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.commissionBps);
    return builder.build();
}

export function dictValueParserSetCommission(): DictionaryValue<SetCommission> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetCommission(src)).endCell());
        },
        parse: (src) => {
            return loadSetCommission(src.loadRef().beginParse());
        }
    }
}

export type PlaceBet = {
    $$type: 'PlaceBet';
    nonce: bigint;
    clientSeed: Cell;
    commitment: Cell;
    serverSeedHash: Cell;
}

export function storePlaceBet(src: PlaceBet) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1, 32);
        b_0.storeUint(src.nonce, 64);
        b_0.storeRef(src.clientSeed);
        b_0.storeRef(src.commitment);
        b_0.storeRef(src.serverSeedHash);
    };
}

export function loadPlaceBet(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1) { throw Error('Invalid prefix'); }
    const _nonce = sc_0.loadUintBig(64);
    const _clientSeed = sc_0.loadRef();
    const _commitment = sc_0.loadRef();
    const _serverSeedHash = sc_0.loadRef();
    return { $$type: 'PlaceBet' as const, nonce: _nonce, clientSeed: _clientSeed, commitment: _commitment, serverSeedHash: _serverSeedHash };
}

export function loadTuplePlaceBet(source: TupleReader) {
    const _nonce = source.readBigNumber();
    const _clientSeed = source.readCell();
    const _commitment = source.readCell();
    const _serverSeedHash = source.readCell();
    return { $$type: 'PlaceBet' as const, nonce: _nonce, clientSeed: _clientSeed, commitment: _commitment, serverSeedHash: _serverSeedHash };
}

export function loadGetterTuplePlaceBet(source: TupleReader) {
    const _nonce = source.readBigNumber();
    const _clientSeed = source.readCell();
    const _commitment = source.readCell();
    const _serverSeedHash = source.readCell();
    return { $$type: 'PlaceBet' as const, nonce: _nonce, clientSeed: _clientSeed, commitment: _commitment, serverSeedHash: _serverSeedHash };
}

export function storeTuplePlaceBet(source: PlaceBet) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.nonce);
    builder.writeCell(source.clientSeed);
    builder.writeCell(source.commitment);
    builder.writeCell(source.serverSeedHash);
    return builder.build();
}

export function dictValueParserPlaceBet(): DictionaryValue<PlaceBet> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePlaceBet(src)).endCell());
        },
        parse: (src) => {
            return loadPlaceBet(src.loadRef().beginParse());
        }
    }
}

export type RevealSeed = {
    $$type: 'RevealSeed';
    nonce: bigint;
    serverSeed: Cell;
}

export function storeRevealSeed(src: RevealSeed) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2, 32);
        b_0.storeUint(src.nonce, 64);
        b_0.storeRef(src.serverSeed);
    };
}

export function loadRevealSeed(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2) { throw Error('Invalid prefix'); }
    const _nonce = sc_0.loadUintBig(64);
    const _serverSeed = sc_0.loadRef();
    return { $$type: 'RevealSeed' as const, nonce: _nonce, serverSeed: _serverSeed };
}

export function loadTupleRevealSeed(source: TupleReader) {
    const _nonce = source.readBigNumber();
    const _serverSeed = source.readCell();
    return { $$type: 'RevealSeed' as const, nonce: _nonce, serverSeed: _serverSeed };
}

export function loadGetterTupleRevealSeed(source: TupleReader) {
    const _nonce = source.readBigNumber();
    const _serverSeed = source.readCell();
    return { $$type: 'RevealSeed' as const, nonce: _nonce, serverSeed: _serverSeed };
}

export function storeTupleRevealSeed(source: RevealSeed) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.nonce);
    builder.writeCell(source.serverSeed);
    return builder.build();
}

export function dictValueParserRevealSeed(): DictionaryValue<RevealSeed> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRevealSeed(src)).endCell());
        },
        parse: (src) => {
            return loadRevealSeed(src.loadRef().beginParse());
        }
    }
}

export type ClaimWin = {
    $$type: 'ClaimWin';
    nonce: bigint;
}

export function storeClaimWin(src: ClaimWin) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(5, 32);
        b_0.storeUint(src.nonce, 64);
    };
}

export function loadClaimWin(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 5) { throw Error('Invalid prefix'); }
    const _nonce = sc_0.loadUintBig(64);
    return { $$type: 'ClaimWin' as const, nonce: _nonce };
}

export function loadTupleClaimWin(source: TupleReader) {
    const _nonce = source.readBigNumber();
    return { $$type: 'ClaimWin' as const, nonce: _nonce };
}

export function loadGetterTupleClaimWin(source: TupleReader) {
    const _nonce = source.readBigNumber();
    return { $$type: 'ClaimWin' as const, nonce: _nonce };
}

export function storeTupleClaimWin(source: ClaimWin) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.nonce);
    return builder.build();
}

export function dictValueParserClaimWin(): DictionaryValue<ClaimWin> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeClaimWin(src)).endCell());
        },
        parse: (src) => {
            return loadClaimWin(src.loadRef().beginParse());
        }
    }
}

export type SlashStake = {
    $$type: 'SlashStake';
    proofServerSeed: Cell;
    proofNonce: bigint;
    proofSender: Address;
}

export function storeSlashStake(src: SlashStake) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(6, 32);
        b_0.storeRef(src.proofServerSeed);
        b_0.storeUint(src.proofNonce, 64);
        b_0.storeAddress(src.proofSender);
    };
}

export function loadSlashStake(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 6) { throw Error('Invalid prefix'); }
    const _proofServerSeed = sc_0.loadRef();
    const _proofNonce = sc_0.loadUintBig(64);
    const _proofSender = sc_0.loadAddress();
    return { $$type: 'SlashStake' as const, proofServerSeed: _proofServerSeed, proofNonce: _proofNonce, proofSender: _proofSender };
}

export function loadTupleSlashStake(source: TupleReader) {
    const _proofServerSeed = source.readCell();
    const _proofNonce = source.readBigNumber();
    const _proofSender = source.readAddress();
    return { $$type: 'SlashStake' as const, proofServerSeed: _proofServerSeed, proofNonce: _proofNonce, proofSender: _proofSender };
}

export function loadGetterTupleSlashStake(source: TupleReader) {
    const _proofServerSeed = source.readCell();
    const _proofNonce = source.readBigNumber();
    const _proofSender = source.readAddress();
    return { $$type: 'SlashStake' as const, proofServerSeed: _proofServerSeed, proofNonce: _proofNonce, proofSender: _proofSender };
}

export function storeTupleSlashStake(source: SlashStake) {
    const builder = new TupleBuilder();
    builder.writeCell(source.proofServerSeed);
    builder.writeNumber(source.proofNonce);
    builder.writeAddress(source.proofSender);
    return builder.build();
}

export function dictValueParserSlashStake(): DictionaryValue<SlashStake> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSlashStake(src)).endCell());
        },
        parse: (src) => {
            return loadSlashStake(src.loadRef().beginParse());
        }
    }
}

export type GameResult = {
    $$type: 'GameResult';
    outcome: bigint;
    multiplier: bigint;
    payout: bigint;
    serverSeed: Cell;
    nonce: bigint;
}

export function storeGameResult(src: GameResult) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(32, 32);
        b_0.storeUint(src.outcome, 32);
        b_0.storeUint(src.multiplier, 16);
        b_0.storeCoins(src.payout);
        b_0.storeRef(src.serverSeed);
        b_0.storeUint(src.nonce, 64);
    };
}

export function loadGameResult(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 32) { throw Error('Invalid prefix'); }
    const _outcome = sc_0.loadUintBig(32);
    const _multiplier = sc_0.loadUintBig(16);
    const _payout = sc_0.loadCoins();
    const _serverSeed = sc_0.loadRef();
    const _nonce = sc_0.loadUintBig(64);
    return { $$type: 'GameResult' as const, outcome: _outcome, multiplier: _multiplier, payout: _payout, serverSeed: _serverSeed, nonce: _nonce };
}

export function loadTupleGameResult(source: TupleReader) {
    const _outcome = source.readBigNumber();
    const _multiplier = source.readBigNumber();
    const _payout = source.readBigNumber();
    const _serverSeed = source.readCell();
    const _nonce = source.readBigNumber();
    return { $$type: 'GameResult' as const, outcome: _outcome, multiplier: _multiplier, payout: _payout, serverSeed: _serverSeed, nonce: _nonce };
}

export function loadGetterTupleGameResult(source: TupleReader) {
    const _outcome = source.readBigNumber();
    const _multiplier = source.readBigNumber();
    const _payout = source.readBigNumber();
    const _serverSeed = source.readCell();
    const _nonce = source.readBigNumber();
    return { $$type: 'GameResult' as const, outcome: _outcome, multiplier: _multiplier, payout: _payout, serverSeed: _serverSeed, nonce: _nonce };
}

export function storeTupleGameResult(source: GameResult) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.outcome);
    builder.writeNumber(source.multiplier);
    builder.writeNumber(source.payout);
    builder.writeCell(source.serverSeed);
    builder.writeNumber(source.nonce);
    return builder.build();
}

export function dictValueParserGameResult(): DictionaryValue<GameResult> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGameResult(src)).endCell());
        },
        parse: (src) => {
            return loadGameResult(src.loadRef().beginParse());
        }
    }
}

export type ProviderContract$Data = {
    $$type: 'ProviderContract$Data';
    owner: Address;
    commissionBps: bigint;
    stake: bigint;
    totalBets: bigint;
    totalPayouts: bigint;
    gameCount: bigint;
}

export function storeProviderContract$Data(src: ProviderContract$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeUint(src.commissionBps, 16);
        b_0.storeCoins(src.stake);
        b_0.storeCoins(src.totalBets);
        b_0.storeCoins(src.totalPayouts);
        b_0.storeUint(src.gameCount, 32);
    };
}

export function loadProviderContract$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _commissionBps = sc_0.loadUintBig(16);
    const _stake = sc_0.loadCoins();
    const _totalBets = sc_0.loadCoins();
    const _totalPayouts = sc_0.loadCoins();
    const _gameCount = sc_0.loadUintBig(32);
    return { $$type: 'ProviderContract$Data' as const, owner: _owner, commissionBps: _commissionBps, stake: _stake, totalBets: _totalBets, totalPayouts: _totalPayouts, gameCount: _gameCount };
}

export function loadTupleProviderContract$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _commissionBps = source.readBigNumber();
    const _stake = source.readBigNumber();
    const _totalBets = source.readBigNumber();
    const _totalPayouts = source.readBigNumber();
    const _gameCount = source.readBigNumber();
    return { $$type: 'ProviderContract$Data' as const, owner: _owner, commissionBps: _commissionBps, stake: _stake, totalBets: _totalBets, totalPayouts: _totalPayouts, gameCount: _gameCount };
}

export function loadGetterTupleProviderContract$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _commissionBps = source.readBigNumber();
    const _stake = source.readBigNumber();
    const _totalBets = source.readBigNumber();
    const _totalPayouts = source.readBigNumber();
    const _gameCount = source.readBigNumber();
    return { $$type: 'ProviderContract$Data' as const, owner: _owner, commissionBps: _commissionBps, stake: _stake, totalBets: _totalBets, totalPayouts: _totalPayouts, gameCount: _gameCount };
}

export function storeTupleProviderContract$Data(source: ProviderContract$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeNumber(source.commissionBps);
    builder.writeNumber(source.stake);
    builder.writeNumber(source.totalBets);
    builder.writeNumber(source.totalPayouts);
    builder.writeNumber(source.gameCount);
    return builder.build();
}

export function dictValueParserProviderContract$Data(): DictionaryValue<ProviderContract$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeProviderContract$Data(src)).endCell());
        },
        parse: (src) => {
            return loadProviderContract$Data(src.loadRef().beginParse());
        }
    }
}

 type ProviderContract_init_args = {
    $$type: 'ProviderContract_init_args';
    owner: Address;
    commissionBps: bigint;
}

function initProviderContract_init_args(src: ProviderContract_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeInt(src.commissionBps, 257);
    };
}

async function ProviderContract_init(owner: Address, commissionBps: bigint) {
    const __code = Cell.fromHex('b5ee9c72410216010003aa000114ff00f4a413f4bcf2c80b01020162020b01f8d001d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e10fa40d30ffa00fa00fa00d31f55506c169ffa40810101d7005902d10170547000e207925f07e005d70d1ff2e08221c0108e295bf8416f24135f0312a010354143c87f01ca0055505056ce13cb0f01fa0201fa0201fa02cb1fc9ed54e00303aa21c011e30221c0128e3b313302d30f3082008aabf84225c705f2f481515821812710bbf2f41035504403c87f01ca0055505056ce13cb0f01fa0201fa0201fa02cb1fc9ed54e021c001e30201c002e3025f07f2c08204050600f831fa003082008aabf84226c705f2f4812ec921c200f2f48152fd5331bef2f45122a152436d706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0010355512c87f01ca0055505056ce13cb0f01fa0201fa0201fa02cb1fc9ed54007a5b8200a97322c200f2f4f8416f24135f038200dd4621c200f2f4a005a41035443012c87f01ca0055505056ce13cb0f01fa0201fa0201fa02cb1fc9ed5404fed33fd43020d021d023db3c20db3c81271027a1a8812710a904f8416f24135f0321db3c5199a0f842544a56c8554080205006cb1f14cb1f12cb0f01fa02cccb3fc94170706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00103555120708090a003ec85003cf1601cf16cb3fc9d09b9320d74a91d5e868f90400da11812710a90800862081251cbe9530820186a0e020812328be95308200c350e020811f40be9430817530e020811770be9430814e20e020810fa0be9430813a98e08107d0be93812710e070000ca8812710a9040036c87f01ca0055505056ce13cb0f01fa0201fa0201fa02cb1fc9ed540201200c110201200d0f015fb9bc6ed44d0d200018e10fa40d30ffa00fa00fa00d31f55506c169ffa40810101d7005902d10170547000e2db3c6c6180e000220015fba5cded44d0d200018e10fa40d30ffa00fa00fa00d31f55506c169ffa40810101d7005902d10170547000e2db3c6c618100002240201201214015fbaff2ed44d0d200018e10fa40d30ffa00fa00fa00d31f55506c169ffa40810101d7005902d10170547000e2db3c6c618130018229170e121812710a823a904015fbb7cced44d0d200018e10fa40d30ffa00fa00fa00d31f55506c169ffa40810101d7005902d10170547000e2db3c6c61815000223c3a83cef');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initProviderContract_init_args({ $$type: 'ProviderContract_init_args', owner, commissionBps })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const ProviderContract_errors = {
    2: { message: "Stack underflow" },
    3: { message: "Stack overflow" },
    4: { message: "Integer overflow" },
    5: { message: "Integer out of expected range" },
    6: { message: "Invalid opcode" },
    7: { message: "Type check error" },
    8: { message: "Cell overflow" },
    9: { message: "Cell underflow" },
    10: { message: "Dictionary error" },
    11: { message: "'Unknown' error" },
    12: { message: "Fatal error" },
    13: { message: "Out of gas error" },
    14: { message: "Virtualization error" },
    32: { message: "Action list is invalid" },
    33: { message: "Action list is too long" },
    34: { message: "Action is invalid or not supported" },
    35: { message: "Invalid source address in outbound message" },
    36: { message: "Invalid destination address in outbound message" },
    37: { message: "Not enough Toncoin" },
    38: { message: "Not enough extra currencies" },
    39: { message: "Outbound message does not fit into a cell after rewriting" },
    40: { message: "Cannot process a message" },
    41: { message: "Library reference is null" },
    42: { message: "Library change action error" },
    43: { message: "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree" },
    50: { message: "Account state size exceeded limits" },
    128: { message: "Null reference exception" },
    129: { message: "Invalid serialization prefix" },
    130: { message: "Invalid incoming message" },
    131: { message: "Constraints error" },
    132: { message: "Access denied" },
    133: { message: "Contract stopped" },
    134: { message: "Invalid argument" },
    135: { message: "Code of a contract was not found" },
    136: { message: "Invalid standard address" },
    138: { message: "Not a basechain address" },
    11977: { message: "Amount > 0" },
    20824: { message: "Max 10000 (100%)" },
    21245: { message: "Insufficient stake" },
    35499: { message: "Only owner" },
    43379: { message: "Provider must stake" },
    56646: { message: "Bet > 0" },
} as const

export const ProviderContract_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
    "Amount > 0": 11977,
    "Max 10000 (100%)": 20824,
    "Insufficient stake": 21245,
    "Only owner": 35499,
    "Provider must stake": 43379,
    "Bet > 0": 56646,
} as const

const ProviderContract_types: ABIType[] = [
    {"name":"DataSize","header":null,"fields":[{"name":"cells","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bits","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"refs","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SignedBundle","header":null,"fields":[{"name":"signature","type":{"kind":"simple","type":"fixed-bytes","optional":false,"format":64}},{"name":"signedData","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounceable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"MessageParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"DeployParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"init","type":{"kind":"simple","type":"StateInit","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"BasechainAddress","header":null,"fields":[{"name":"hash","type":{"kind":"simple","type":"int","optional":true,"format":257}}]},
    {"name":"AddStake","header":16,"fields":[]},
    {"name":"WithdrawStake","header":17,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"SetCommission","header":18,"fields":[{"name":"commissionBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"PlaceBet","header":1,"fields":[{"name":"nonce","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"clientSeed","type":{"kind":"simple","type":"cell","optional":false}},{"name":"commitment","type":{"kind":"simple","type":"cell","optional":false}},{"name":"serverSeedHash","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"RevealSeed","header":2,"fields":[{"name":"nonce","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"serverSeed","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"ClaimWin","header":5,"fields":[{"name":"nonce","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"SlashStake","header":6,"fields":[{"name":"proofServerSeed","type":{"kind":"simple","type":"cell","optional":false}},{"name":"proofNonce","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"proofSender","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"GameResult","header":32,"fields":[{"name":"outcome","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"multiplier","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"payout","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"serverSeed","type":{"kind":"simple","type":"cell","optional":false}},{"name":"nonce","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"ProviderContract$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"commissionBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"stake","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"totalBets","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"totalPayouts","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"gameCount","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
]

const ProviderContract_opcodes = {
    "AddStake": 16,
    "WithdrawStake": 17,
    "SetCommission": 18,
    "PlaceBet": 1,
    "RevealSeed": 2,
    "ClaimWin": 5,
    "SlashStake": 6,
    "GameResult": 32,
}

const ProviderContract_getters: ABIGetter[] = [
    {"name":"getStake","methodId":128972,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getCommission","methodId":91597,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getTotalGames","methodId":72646,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getRtp","methodId":110578,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
]

export const ProviderContract_getterMapping: { [key: string]: string } = {
    'getStake': 'getGetStake',
    'getCommission': 'getGetCommission',
    'getTotalGames': 'getGetTotalGames',
    'getRtp': 'getGetRtp',
}

const ProviderContract_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"AddStake"}},
    {"receiver":"internal","message":{"kind":"typed","type":"WithdrawStake"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetCommission"}},
    {"receiver":"internal","message":{"kind":"typed","type":"PlaceBet"}},
    {"receiver":"internal","message":{"kind":"typed","type":"RevealSeed"}},
]


export class ProviderContract implements Contract {
    
    public static readonly storageReserve = 0n;
    public static readonly errors = ProviderContract_errors_backward;
    public static readonly opcodes = ProviderContract_opcodes;
    
    static async init(owner: Address, commissionBps: bigint) {
        return await ProviderContract_init(owner, commissionBps);
    }
    
    static async fromInit(owner: Address, commissionBps: bigint) {
        const __gen_init = await ProviderContract_init(owner, commissionBps);
        const address = contractAddress(0, __gen_init);
        return new ProviderContract(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new ProviderContract(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  ProviderContract_types,
        getters: ProviderContract_getters,
        receivers: ProviderContract_receivers,
        errors: ProviderContract_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: AddStake | WithdrawStake | SetCommission | PlaceBet | RevealSeed) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AddStake') {
            body = beginCell().store(storeAddStake(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'WithdrawStake') {
            body = beginCell().store(storeWithdrawStake(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetCommission') {
            body = beginCell().store(storeSetCommission(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'PlaceBet') {
            body = beginCell().store(storePlaceBet(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'RevealSeed') {
            body = beginCell().store(storeRevealSeed(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetStake(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getStake', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetCommission(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getCommission', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetTotalGames(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getTotalGames', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetRtp(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getRtp', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
}