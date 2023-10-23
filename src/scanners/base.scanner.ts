import ScannedBlocks from "../models/scannedBlocks.model";
import { ethers } from "ethers";
import { eventFiltersType, eventResultType } from "../types/eventFilters.type";

export class BaseScanner {
    protected BLOCKS_TO_SCAN: number = 1000;

    protected async getScannedBlocks(
        chainId: number,
        address: string,
    ): Promise<ScannedBlocks> {
        return ScannedBlocks.findOne({
            attributes: ["scannedBlocks"],
            where: {
                chainId,
                address,
            },
        });
    }

    protected async setScannedBlocks(
        chainId: number,
        address: string,
        scannedBlocks: number,
    ): Promise<void> {
        await ScannedBlocks.update(
            {
                scannedBlocks,
            },
            {
                where: {
                    chainId,
                    address,
                },
            },
        );
    }

    protected defineEventFilters(
        contract: ethers.Contract,
        event: any,
    ): eventFiltersType {
        return {
            address: contract.address,
            topics: contract.filters[event]()["topics"],
            fromBlock: null,
            toBlock: null,
        };
    }

    protected parseLogs(
        logs: eventResultType[],
        abi: any,
    ): ethers.utils.LogDescription[] {
        const parsedLogs: any = [];
        const eventsInterface: ethers.utils.Interface =
            this.getEventsInterface(abi);
        for (const log of logs) {
            parsedLogs.push(eventsInterface.parseLog(log));
        }
        return parsedLogs;
    }

    private getEventsInterface(abi: any): ethers.utils.Interface {
        return new ethers.utils.Interface(abi);
    }
}
