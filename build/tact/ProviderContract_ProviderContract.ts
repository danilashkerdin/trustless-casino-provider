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

export type WithdrawCommission = {
    $$type: 'WithdrawCommission';
    amount: bigint;
}

export function storeWithdrawCommission(src: WithdrawCommission) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(19, 32);
        b_0.storeCoins(src.amount);
    };
}

export function loadWithdrawCommission(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 19) { throw Error('Invalid prefix'); }
    const _amount = sc_0.loadCoins();
    return { $$type: 'WithdrawCommission' as const, amount: _amount };
}

export function loadTupleWithdrawCommission(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'WithdrawCommission' as const, amount: _amount };
}

export function loadGetterTupleWithdrawCommission(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'WithdrawCommission' as const, amount: _amount };
}

export function storeTupleWithdrawCommission(source: WithdrawCommission) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserWithdrawCommission(): DictionaryValue<WithdrawCommission> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeWithdrawCommission(src)).endCell());
        },
        parse: (src) => {
            return loadWithdrawCommission(src.loadRef().beginParse());
        }
    }
}

export type PlaceBet = {
    $$type: 'PlaceBet';
    nonce: bigint;
    guess: bigint;
    clientSeed: Cell;
    serverSeedHash: bigint;
}

export function storePlaceBet(src: PlaceBet) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1, 32);
        b_0.storeUint(src.nonce, 64);
        b_0.storeUint(src.guess, 8);
        b_0.storeRef(src.clientSeed);
        b_0.storeUint(src.serverSeedHash, 256);
    };
}

export function loadPlaceBet(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1) { throw Error('Invalid prefix'); }
    const _nonce = sc_0.loadUintBig(64);
    const _guess = sc_0.loadUintBig(8);
    const _clientSeed = sc_0.loadRef();
    const _serverSeedHash = sc_0.loadUintBig(256);
    return { $$type: 'PlaceBet' as const, nonce: _nonce, guess: _guess, clientSeed: _clientSeed, serverSeedHash: _serverSeedHash };
}

export function loadTuplePlaceBet(source: TupleReader) {
    const _nonce = source.readBigNumber();
    const _guess = source.readBigNumber();
    const _clientSeed = source.readCell();
    const _serverSeedHash = source.readBigNumber();
    return { $$type: 'PlaceBet' as const, nonce: _nonce, guess: _guess, clientSeed: _clientSeed, serverSeedHash: _serverSeedHash };
}

export function loadGetterTuplePlaceBet(source: TupleReader) {
    const _nonce = source.readBigNumber();
    const _guess = source.readBigNumber();
    const _clientSeed = source.readCell();
    const _serverSeedHash = source.readBigNumber();
    return { $$type: 'PlaceBet' as const, nonce: _nonce, guess: _guess, clientSeed: _clientSeed, serverSeedHash: _serverSeedHash };
}

export function storeTuplePlaceBet(source: PlaceBet) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.nonce);
    builder.writeNumber(source.guess);
    builder.writeCell(source.clientSeed);
    builder.writeNumber(source.serverSeedHash);
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
    serverSeed: Slice;
    serverSeedHash: bigint;
    guess: bigint;
    clientSeed: Cell;
}

export function storeRevealSeed(src: RevealSeed) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2, 32);
        b_0.storeUint(src.nonce, 64);
        b_0.storeRef(src.serverSeed.asCell());
        b_0.storeUint(src.serverSeedHash, 256);
        b_0.storeUint(src.guess, 8);
        b_0.storeRef(src.clientSeed);
    };
}

export function loadRevealSeed(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2) { throw Error('Invalid prefix'); }
    const _nonce = sc_0.loadUintBig(64);
    const _serverSeed = sc_0.loadRef().asSlice();
    const _serverSeedHash = sc_0.loadUintBig(256);
    const _guess = sc_0.loadUintBig(8);
    const _clientSeed = sc_0.loadRef();
    return { $$type: 'RevealSeed' as const, nonce: _nonce, serverSeed: _serverSeed, serverSeedHash: _serverSeedHash, guess: _guess, clientSeed: _clientSeed };
}

export function loadTupleRevealSeed(source: TupleReader) {
    const _nonce = source.readBigNumber();
    const _serverSeed = source.readCell().asSlice();
    const _serverSeedHash = source.readBigNumber();
    const _guess = source.readBigNumber();
    const _clientSeed = source.readCell();
    return { $$type: 'RevealSeed' as const, nonce: _nonce, serverSeed: _serverSeed, serverSeedHash: _serverSeedHash, guess: _guess, clientSeed: _clientSeed };
}

export function loadGetterTupleRevealSeed(source: TupleReader) {
    const _nonce = source.readBigNumber();
    const _serverSeed = source.readCell().asSlice();
    const _serverSeedHash = source.readBigNumber();
    const _guess = source.readBigNumber();
    const _clientSeed = source.readCell();
    return { $$type: 'RevealSeed' as const, nonce: _nonce, serverSeed: _serverSeed, serverSeedHash: _serverSeedHash, guess: _guess, clientSeed: _clientSeed };
}

export function storeTupleRevealSeed(source: RevealSeed) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.nonce);
    builder.writeSlice(source.serverSeed.asCell());
    builder.writeNumber(source.serverSeedHash);
    builder.writeNumber(source.guess);
    builder.writeCell(source.clientSeed);
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

export type GameResult = {
    $$type: 'GameResult';
    outcome: bigint;
    win: boolean;
    multiplierBps: bigint;
    grossPayout: bigint;
    commissionTaken: bigint;
    netPayout: bigint;
    serverSeed: Cell;
    nonce: bigint;
}

export function storeGameResult(src: GameResult) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(32, 32);
        b_0.storeUint(src.outcome, 32);
        b_0.storeBit(src.win);
        b_0.storeUint(src.multiplierBps, 16);
        b_0.storeCoins(src.grossPayout);
        b_0.storeCoins(src.commissionTaken);
        b_0.storeCoins(src.netPayout);
        b_0.storeRef(src.serverSeed);
        b_0.storeUint(src.nonce, 64);
    };
}

export function loadGameResult(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 32) { throw Error('Invalid prefix'); }
    const _outcome = sc_0.loadUintBig(32);
    const _win = sc_0.loadBit();
    const _multiplierBps = sc_0.loadUintBig(16);
    const _grossPayout = sc_0.loadCoins();
    const _commissionTaken = sc_0.loadCoins();
    const _netPayout = sc_0.loadCoins();
    const _serverSeed = sc_0.loadRef();
    const _nonce = sc_0.loadUintBig(64);
    return { $$type: 'GameResult' as const, outcome: _outcome, win: _win, multiplierBps: _multiplierBps, grossPayout: _grossPayout, commissionTaken: _commissionTaken, netPayout: _netPayout, serverSeed: _serverSeed, nonce: _nonce };
}

export function loadTupleGameResult(source: TupleReader) {
    const _outcome = source.readBigNumber();
    const _win = source.readBoolean();
    const _multiplierBps = source.readBigNumber();
    const _grossPayout = source.readBigNumber();
    const _commissionTaken = source.readBigNumber();
    const _netPayout = source.readBigNumber();
    const _serverSeed = source.readCell();
    const _nonce = source.readBigNumber();
    return { $$type: 'GameResult' as const, outcome: _outcome, win: _win, multiplierBps: _multiplierBps, grossPayout: _grossPayout, commissionTaken: _commissionTaken, netPayout: _netPayout, serverSeed: _serverSeed, nonce: _nonce };
}

export function loadGetterTupleGameResult(source: TupleReader) {
    const _outcome = source.readBigNumber();
    const _win = source.readBoolean();
    const _multiplierBps = source.readBigNumber();
    const _grossPayout = source.readBigNumber();
    const _commissionTaken = source.readBigNumber();
    const _netPayout = source.readBigNumber();
    const _serverSeed = source.readCell();
    const _nonce = source.readBigNumber();
    return { $$type: 'GameResult' as const, outcome: _outcome, win: _win, multiplierBps: _multiplierBps, grossPayout: _grossPayout, commissionTaken: _commissionTaken, netPayout: _netPayout, serverSeed: _serverSeed, nonce: _nonce };
}

export function storeTupleGameResult(source: GameResult) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.outcome);
    builder.writeBoolean(source.win);
    builder.writeNumber(source.multiplierBps);
    builder.writeNumber(source.grossPayout);
    builder.writeNumber(source.commissionTaken);
    builder.writeNumber(source.netPayout);
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

export type SlashStake = {
    $$type: 'SlashStake';
    nonce: bigint;
    expectedHash: bigint;
    actualServerSeed: Slice;
    clientSeed: Cell;
    betAmount: bigint;
    guess: bigint;
}

export function storeSlashStake(src: SlashStake) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(48, 32);
        b_0.storeUint(src.nonce, 64);
        b_0.storeUint(src.expectedHash, 256);
        b_0.storeRef(src.actualServerSeed.asCell());
        b_0.storeRef(src.clientSeed);
        b_0.storeCoins(src.betAmount);
        b_0.storeUint(src.guess, 8);
    };
}

export function loadSlashStake(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 48) { throw Error('Invalid prefix'); }
    const _nonce = sc_0.loadUintBig(64);
    const _expectedHash = sc_0.loadUintBig(256);
    const _actualServerSeed = sc_0.loadRef().asSlice();
    const _clientSeed = sc_0.loadRef();
    const _betAmount = sc_0.loadCoins();
    const _guess = sc_0.loadUintBig(8);
    return { $$type: 'SlashStake' as const, nonce: _nonce, expectedHash: _expectedHash, actualServerSeed: _actualServerSeed, clientSeed: _clientSeed, betAmount: _betAmount, guess: _guess };
}

export function loadTupleSlashStake(source: TupleReader) {
    const _nonce = source.readBigNumber();
    const _expectedHash = source.readBigNumber();
    const _actualServerSeed = source.readCell().asSlice();
    const _clientSeed = source.readCell();
    const _betAmount = source.readBigNumber();
    const _guess = source.readBigNumber();
    return { $$type: 'SlashStake' as const, nonce: _nonce, expectedHash: _expectedHash, actualServerSeed: _actualServerSeed, clientSeed: _clientSeed, betAmount: _betAmount, guess: _guess };
}

export function loadGetterTupleSlashStake(source: TupleReader) {
    const _nonce = source.readBigNumber();
    const _expectedHash = source.readBigNumber();
    const _actualServerSeed = source.readCell().asSlice();
    const _clientSeed = source.readCell();
    const _betAmount = source.readBigNumber();
    const _guess = source.readBigNumber();
    return { $$type: 'SlashStake' as const, nonce: _nonce, expectedHash: _expectedHash, actualServerSeed: _actualServerSeed, clientSeed: _clientSeed, betAmount: _betAmount, guess: _guess };
}

export function storeTupleSlashStake(source: SlashStake) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.nonce);
    builder.writeNumber(source.expectedHash);
    builder.writeSlice(source.actualServerSeed.asCell());
    builder.writeCell(source.clientSeed);
    builder.writeNumber(source.betAmount);
    builder.writeNumber(source.guess);
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

export type ProviderContract$Data = {
    $$type: 'ProviderContract$Data';
    owner: Address;
    commissionBps: bigint;
    stake: bigint;
    totalBets: bigint;
    totalPayouts: bigint;
    totalCommission: bigint;
    gameCount: bigint;
    pendingSender: Address;
    pendingBetAmount: bigint;
    pendingGuess: bigint;
    pendingSeedHash: bigint;
}

export function storeProviderContract$Data(src: ProviderContract$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeUint(src.commissionBps, 16);
        b_0.storeCoins(src.stake);
        b_0.storeCoins(src.totalBets);
        b_0.storeCoins(src.totalPayouts);
        b_0.storeCoins(src.totalCommission);
        b_0.storeUint(src.gameCount, 32);
        const b_1 = new Builder();
        b_1.storeAddress(src.pendingSender);
        b_1.storeCoins(src.pendingBetAmount);
        b_1.storeUint(src.pendingGuess, 8);
        b_1.storeUint(src.pendingSeedHash, 256);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadProviderContract$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _commissionBps = sc_0.loadUintBig(16);
    const _stake = sc_0.loadCoins();
    const _totalBets = sc_0.loadCoins();
    const _totalPayouts = sc_0.loadCoins();
    const _totalCommission = sc_0.loadCoins();
    const _gameCount = sc_0.loadUintBig(32);
    const sc_1 = sc_0.loadRef().beginParse();
    const _pendingSender = sc_1.loadAddress();
    const _pendingBetAmount = sc_1.loadCoins();
    const _pendingGuess = sc_1.loadUintBig(8);
    const _pendingSeedHash = sc_1.loadUintBig(256);
    return { $$type: 'ProviderContract$Data' as const, owner: _owner, commissionBps: _commissionBps, stake: _stake, totalBets: _totalBets, totalPayouts: _totalPayouts, totalCommission: _totalCommission, gameCount: _gameCount, pendingSender: _pendingSender, pendingBetAmount: _pendingBetAmount, pendingGuess: _pendingGuess, pendingSeedHash: _pendingSeedHash };
}

export function loadTupleProviderContract$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _commissionBps = source.readBigNumber();
    const _stake = source.readBigNumber();
    const _totalBets = source.readBigNumber();
    const _totalPayouts = source.readBigNumber();
    const _totalCommission = source.readBigNumber();
    const _gameCount = source.readBigNumber();
    const _pendingSender = source.readAddress();
    const _pendingBetAmount = source.readBigNumber();
    const _pendingGuess = source.readBigNumber();
    const _pendingSeedHash = source.readBigNumber();
    return { $$type: 'ProviderContract$Data' as const, owner: _owner, commissionBps: _commissionBps, stake: _stake, totalBets: _totalBets, totalPayouts: _totalPayouts, totalCommission: _totalCommission, gameCount: _gameCount, pendingSender: _pendingSender, pendingBetAmount: _pendingBetAmount, pendingGuess: _pendingGuess, pendingSeedHash: _pendingSeedHash };
}

export function loadGetterTupleProviderContract$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _commissionBps = source.readBigNumber();
    const _stake = source.readBigNumber();
    const _totalBets = source.readBigNumber();
    const _totalPayouts = source.readBigNumber();
    const _totalCommission = source.readBigNumber();
    const _gameCount = source.readBigNumber();
    const _pendingSender = source.readAddress();
    const _pendingBetAmount = source.readBigNumber();
    const _pendingGuess = source.readBigNumber();
    const _pendingSeedHash = source.readBigNumber();
    return { $$type: 'ProviderContract$Data' as const, owner: _owner, commissionBps: _commissionBps, stake: _stake, totalBets: _totalBets, totalPayouts: _totalPayouts, totalCommission: _totalCommission, gameCount: _gameCount, pendingSender: _pendingSender, pendingBetAmount: _pendingBetAmount, pendingGuess: _pendingGuess, pendingSeedHash: _pendingSeedHash };
}

export function storeTupleProviderContract$Data(source: ProviderContract$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeNumber(source.commissionBps);
    builder.writeNumber(source.stake);
    builder.writeNumber(source.totalBets);
    builder.writeNumber(source.totalPayouts);
    builder.writeNumber(source.totalCommission);
    builder.writeNumber(source.gameCount);
    builder.writeAddress(source.pendingSender);
    builder.writeNumber(source.pendingBetAmount);
    builder.writeNumber(source.pendingGuess);
    builder.writeNumber(source.pendingSeedHash);
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
    const __code = Cell.fromHex('b5ee9c7241021c0100060a000114ff00f4a413f4bcf2c80b01020162020e03f8d001d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e2afa40d30ffa00fa00fa00fa00d31fd401d0fa40fa00d307d3ff30104b104a104910481047104610456c1b8e16fa40810101d7005902d1017054700054700053085520e20c925f0ce00ad70d1ff2e08221c010e30221c011e30221c01203040500885bf8416f24135f0317a0108a1079081057104610354430c87f01ca0055a050abce18cb0f5006fa025004fa0258fa0201fa02cb1f01c8ce58fa0212cb0712cbffcdc9ed5401c231fa003082008aabf8422bc705f2f4812ec921c200f2f48152fd5381bef2f45177a152986d706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00108a55170c04d68e56313807d30f3082008aabf8422ac705f2f481515821812710bbf2f4108a091068105710461035440302c87f01ca0055a050abce18cb0f5006fa025004fa0258fa0201fa02cb1f01c8ce58fa0212cb0712cbffcdc9ed54e021c013e30221c001e30221c002e30201c0300607080b01c231fa003082008aabf8422bc705f2f4812ec921c200f2f4816bc05351bef2f45144a152956d706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00108a55170c01aa3132393908d33f31d307d431d3ff30812bb726c200f2f48200f51c22c2009322c1079170e2f2f4f8416f24135f038200dd4621c200f2f4811f6d0ac0001af2f4f8425159a00aa4108a1079106810671046103544440c02fc31d33fd401d001d3ff31d30731d430816dd32ac200f2f4816ca724c200f2f4219b9320d74a91d5e868f90400da11813c0b0fba1ef2f40cd0546c21db3c520cba705470018e2d5f0302a7065309a8812710a9045301bc923020de5ca18152fd53b1bef2f451aaa1518aa05171a0108a070844449135e2705300c801111101090a003cc85003cf1601cf16cb3fc9d09b9320d74a91d5e868f90400da1176a908a401dccb1f5250ca0005948200ea609120e25005cb0f5003fa0201fa0224fa02500ecf1612cb3fc9544333706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00108a1079106810571046103544030c02fc8ef9d33f31d3ffd401d001d431fa0030019b9320d74a91d5e868f90400da11810bbe03bd12f2f4a7065307bc923026de5177a15157a0f84250086d706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00108a10795e345513e05f0c0c0d005ac87f01ca0055a050abce18cb0f5006fa025004fa0258fa0201fa02cb1f01c8ce58fa0212cb0712cbffcdc9ed540006f2c0820201200f170201201015020166111301a3ae4576a268690000c7157d206987fd007d007d007d00698fea00e87d207d006983e9ff980825882508248824082388230822b60dc70b7d20408080eb802c816880b82a38002a380029842a90716d9e3658c01200022501a3ade376a268690000c7157d206987fd007d007d007d00698fea00e87d207d006983e9ff980825882508248824082388230822b60dc70b7d20408080eb802c816880b82a38002a380029842a90716d9e3658c01400022401a3ba5cded44d0d200018e2afa40d30ffa00fa00fa00fa00d31fd401d0fa40fa00d307d3ff30104b104a104910481047104610456c1b8e16fa40810101d7005902d1017054700054700053085520e2db3c6cb1816000229020120181a01a3baff2ed44d0d200018e2afa40d30ffa00fa00fa00fa00d31fd401d0fa40fa00d307d3ff30104b104a104910481047104610456c1b8e16fa40810101d7005902d1017054700054700053085520e2db3c6cb18190018279170e126812710a828a90401a3bb7cced44d0d200018e2afa40d30ffa00fa00fa00fa00d31fd401d0fa40fa00d307d3ff30104b104a104910481047104610456c1b8e16fa40810101d7005902d1017054700054700053085520e2db3c6cb181b0002280d057ef7');
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
    3006: { message: "Seed matches — no slash" },
    8045: { message: "Resolve previous bet first" },
    11191: { message: "Provider stake required" },
    11977: { message: "Amount > 0" },
    15371: { message: "Seed mismatch — slash!" },
    20824: { message: "Max 10000 (100%)" },
    21245: { message: "Insufficient stake" },
    27584: { message: "Insufficient commission" },
    27815: { message: "No pending bet" },
    28115: { message: "No stake" },
    35499: { message: "Only owner" },
    56646: { message: "Bet > 0" },
    62748: { message: "Guess 1-6" },
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
    "Seed matches — no slash": 3006,
    "Resolve previous bet first": 8045,
    "Provider stake required": 11191,
    "Amount > 0": 11977,
    "Seed mismatch — slash!": 15371,
    "Max 10000 (100%)": 20824,
    "Insufficient stake": 21245,
    "Insufficient commission": 27584,
    "No pending bet": 27815,
    "No stake": 28115,
    "Only owner": 35499,
    "Bet > 0": 56646,
    "Guess 1-6": 62748,
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
    {"name":"WithdrawCommission","header":19,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"PlaceBet","header":1,"fields":[{"name":"nonce","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"guess","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"clientSeed","type":{"kind":"simple","type":"cell","optional":false}},{"name":"serverSeedHash","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"RevealSeed","header":2,"fields":[{"name":"nonce","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"serverSeed","type":{"kind":"simple","type":"slice","optional":false}},{"name":"serverSeedHash","type":{"kind":"simple","type":"uint","optional":false,"format":256}},{"name":"guess","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"clientSeed","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"GameResult","header":32,"fields":[{"name":"outcome","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"win","type":{"kind":"simple","type":"bool","optional":false}},{"name":"multiplierBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"grossPayout","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"commissionTaken","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"netPayout","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"serverSeed","type":{"kind":"simple","type":"cell","optional":false}},{"name":"nonce","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"SlashStake","header":48,"fields":[{"name":"nonce","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"expectedHash","type":{"kind":"simple","type":"uint","optional":false,"format":256}},{"name":"actualServerSeed","type":{"kind":"simple","type":"slice","optional":false}},{"name":"clientSeed","type":{"kind":"simple","type":"cell","optional":false}},{"name":"betAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"guess","type":{"kind":"simple","type":"uint","optional":false,"format":8}}]},
    {"name":"ProviderContract$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"commissionBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"stake","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"totalBets","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"totalPayouts","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"totalCommission","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"gameCount","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"pendingSender","type":{"kind":"simple","type":"address","optional":false}},{"name":"pendingBetAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"pendingGuess","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"pendingSeedHash","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
]

const ProviderContract_opcodes = {
    "AddStake": 16,
    "WithdrawStake": 17,
    "SetCommission": 18,
    "WithdrawCommission": 19,
    "PlaceBet": 1,
    "RevealSeed": 2,
    "GameResult": 32,
    "SlashStake": 48,
}

const ProviderContract_getters: ABIGetter[] = [
    {"name":"getStake","methodId":128972,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getCommission","methodId":91597,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getTotalCommission","methodId":70794,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getTotalGames","methodId":72646,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getRtp","methodId":110578,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
]

export const ProviderContract_getterMapping: { [key: string]: string } = {
    'getStake': 'getGetStake',
    'getCommission': 'getGetCommission',
    'getTotalCommission': 'getGetTotalCommission',
    'getTotalGames': 'getGetTotalGames',
    'getRtp': 'getGetRtp',
}

const ProviderContract_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"AddStake"}},
    {"receiver":"internal","message":{"kind":"typed","type":"WithdrawStake"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetCommission"}},
    {"receiver":"internal","message":{"kind":"typed","type":"WithdrawCommission"}},
    {"receiver":"internal","message":{"kind":"typed","type":"PlaceBet"}},
    {"receiver":"internal","message":{"kind":"typed","type":"RevealSeed"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SlashStake"}},
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
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: AddStake | WithdrawStake | SetCommission | WithdrawCommission | PlaceBet | RevealSeed | SlashStake) {
        
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
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'WithdrawCommission') {
            body = beginCell().store(storeWithdrawCommission(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'PlaceBet') {
            body = beginCell().store(storePlaceBet(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'RevealSeed') {
            body = beginCell().store(storeRevealSeed(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SlashStake') {
            body = beginCell().store(storeSlashStake(message)).endCell();
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
    
    async getGetTotalCommission(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getTotalCommission', builder.build())).stack;
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