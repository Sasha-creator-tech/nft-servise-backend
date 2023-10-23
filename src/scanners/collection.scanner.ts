import { BaseScanner } from "./base.scanner";
import { blockchainProvider } from "../providers/blockchain.provider";
import NFTToken from "../models/nftTokens.model";
import { Op } from "sequelize";
import { eventFiltersType, EventNames } from "../types/eventFilters.type";
import collectionContractAbi from "./abi/collectionContractABI.json";
import { setTimeout } from "timers/promises";
import { ethers } from "ethers";
import { scannerService } from "../services/scanner.service";

class CollectionScanner extends BaseScanner {
    public async startScanning(chainId: number): Promise<number> {
        let lastScannedBlock: number;
        for (const collection of await this.getAllTheCollections()) {
            const startBlock: number = (
                await this.getScannedBlocks(
                    chainId,
                    collection.address.toLowerCase(),
                )
            ).scannedBlocks;
            const currentBlock: number =
                await blockchainProvider.getCurrentBlock();

            lastScannedBlock = await this.scanEvents(
                chainId,
                collection.address.toLowerCase(),
                collection.id,
                startBlock,
                currentBlock,
            );
        }
        return lastScannedBlock;
    }

    private async getAllTheCollections(): Promise<NFTToken[]> {
        return NFTToken.findAll({
            attributes: ["id", "address"],
            where: {
                address: {
                    [Op.not]: null,
                },
            },
        });
    }

    private async scanEvents(
        chainId: number,
        address: string,
        collectionId: number,
        startBlock: number,
        currentBlock: number,
    ): Promise<number> {
        try {
            let finalBlock: number;
            for (let blockNumber = startBlock; blockNumber < currentBlock; ) {
                const filters: eventFiltersType = this.defineEventFilters(
                    blockchainProvider.defineContract(
                        address,
                        collectionContractAbi,
                    ),
                    EventNames.TRANSFER_SINGLE,
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
                    this.parseLogs(eventLogs, collectionContractAbi),
                    collectionId,
                );

                finalBlock = blockNumber;
                await this.setScannedBlocks(chainId, address, blockNumber);
            }
            return finalBlock;
        } catch (err) {
            console.log(err);
        }
        return null;
    }

    async processEvents(
        parsedLogs: ethers.utils.LogDescription[],
        collectionId: number,
    ): Promise<void> {
        for (const event of parsedLogs) {
            switch (event.name) {
                case EventNames.TRANSFER_SINGLE: {
                    await scannerService.transferToken(
                        (event.args.from as string).toLowerCase(),
                        (event.args.to as string).toLowerCase(),
                        Number(event.args.id),
                        Number(event.args.value),
                        collectionId,
                    );
                    break;
                }
            }
        }
    }
}

export const collectionScanner = new CollectionScanner();
