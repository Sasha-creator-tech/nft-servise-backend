import { ethers } from "ethers";
import dotenv from "dotenv";
import { eventFiltersType } from "../types/eventFilters.type";
dotenv.config();

class BlockchainProvider {
    public provider: ethers.providers.JsonRpcProvider;

    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(
            process.env.NODE_URL,
        );
    }

    public defineContract(address: string, abi: any): ethers.Contract {
        if (!this.provider) {
            throw new Error("Provider is not defined");
        }
        return new ethers.Contract(address, abi, this.provider);
    }

    public getCurrentBlock() {
        return this.provider.getBlockNumber();
    }

    public getEventLogs(
        filters: eventFiltersType,
    ): Promise<ethers.providers.Log[]> {
        return this.provider.getLogs(filters);
    }
}

export const blockchainProvider = new BlockchainProvider();
