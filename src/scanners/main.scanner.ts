import { BaseScanner } from "./base.scanner";
import { blockchainProvider } from "../providers/blockchain.provider";
import dotenv from "dotenv";
import { eventFiltersType, EventNames } from "../types/eventFilters.type";
import { ethers } from "ethers";
import { setTimeout } from "timers/promises";
import mainContractAbi from "../scanners/abi/mainContractABI.json";
import { scannerService } from "../services/scanner.service";
import { collectionScanner } from "./collection.scanner";
dotenv.config();

class MainScanner extends BaseScanner {
    public async startScanning(
        chainId: number,
        address: string,
    ): Promise<number> {
        const startBlock: number = (
            await this.getScannedBlocks(chainId, address)
        ).scannedBlocks;
        const currentBlock: number = await blockchainProvider.getCurrentBlock();

        return this.scanEvents(chainId, address, startBlock, currentBlock);
    }

    protected async scanEvents(
        chainId: number,
        address: string,
        startBlock: number,
        currentBlock: number,
    ): Promise<number> {
        try {
            let finalBlock: number;
            for (let blockNumber = startBlock; blockNumber < currentBlock; ) {
                const filters: eventFiltersType = this.defineEventFilters(
                    blockchainProvider.defineContract(address, mainContractAbi),
                    EventNames.COLLECTION_CREATED,
                );
                filters.fromBlock = blockNumber;
                if (blockNumber + this.BLOCKS_TO_SCAN >= currentBlock) {
                    filters.toBlock = currentBlock;
                    blockNumber = currentBlock;
                } else {
                    filters.toBlock = blockNumber + this.BLOCKS_TO_SCAN;
                    blockNumber += this.BLOCKS_TO_SCAN;
                }

                await setTimeout(300);

                const eventLogs: ethers.providers.Log[] =
                    await blockchainProvider.getEventLogs(filters);

                await this.processEvents(
                    this.parseLogs(eventLogs, mainContractAbi),
                    chainId,
                    startBlock,
                );

                finalBlock = blockNumber;
                await this.setScannedBlocks(chainId, address, blockNumber);
            }
            return finalBlock;
        } catch (err) {
            console.log(err);
        }
    }

    async processEvents(
        parsedLogs: ethers.utils.LogDescription[],
        chainId: number,
        scannedBlocks: number,
    ): Promise<void> {
        for (const event of parsedLogs) {
            switch (event.name) {
                case EventNames.COLLECTION_CREATED: {
                    await scannerService.createCollection(
                        (event.args.collection as string).toLowerCase(),
                        event.args.name,
                        Number(event.args.internalBrandId),
                        chainId,
                        scannedBlocks,
                    );
                    break;
                }
            }
        }
    }
}

export const mainScanner = new MainScanner();
