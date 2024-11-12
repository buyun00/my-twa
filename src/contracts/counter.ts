import { Address, beginCell, Cell, Contract, ContractABI, contractAddress, ContractProvider, Sender, SendMode, StateInit } from '@ton/core';


export default class Counter implements Contract{
    static createForDeploy(code: Cell,initialCounterValue: number): Counter{
        const data = beginCell().storeUint(initialCounterValue,64).endCell();
        const workChain = 0;
        const address = contractAddress(workChain,{code,data});
        return new Counter(address,{code,data})
    }

    constructor(readonly address:Address,readonly init?:{code:Cell,data:Cell}){}
    
    async sendDeploy(provider:ContractProvider,via: Sender){
        await provider.internal(via,{
            value:"0.01",
            bounce:false
        });
    }

    async getCounter(provider: ContractProvider){
        const {stack} = await provider.get("counter",[]);
        return stack.readBigNumber();
    }

    async sendIncrement(provider: ContractProvider,via: Sender){
        const messsageBody = beginCell()
        .storeUint(1,32)
        .storeUint(0,64)
        .endCell()

        await provider.internal(via,{
            value: "0.002",
            body: messsageBody
        })
    }
}