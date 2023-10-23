import NFTToken from "../models/nftTokens.model";
import ScannedBlocks from "../models/scannedBlocks.model";
import dotenv from "dotenv";
import NftId from "../models/nftIds.model";
import User from "../models/user.model";
import UserRole from "../models/userRole.model";
import UserBalance from "../models/userBalance.model";
import { database } from "../config/database/database";
dotenv.config();

export class ScannerService {
    public async createCollection(
        collectionAddress: string,
        collectionName: string,
        brandId: number,
        chainId: number,
        scannedBlocks: number,
    ): Promise<void> {
        await NFTToken.upsert({
            title: collectionName,
            address: collectionAddress,
            brand_id: brandId,
        });
        await ScannedBlocks.upsert({
            chainId,
            address: collectionAddress,
            scannedBlocks,
        });
    }

    public async transferBatch() {
        // TODO: to be implemented
    }

    public async transferToken(
        from: string,
        to: string,
        id: number,
        value: number,
        collectionId: number,
    ): Promise<void> {
        let transaction;
        try {
            transaction = await database.transaction();

            const token: [NftId, boolean] = await NftId.findOrCreate({
                where: {
                    nft_token_id: collectionId,
                    onchain_id: id,
                },
                defaults: {
                    amount: value,
                },
                transaction,
            });

            const role: UserRole = await UserRole.findOne({
                attributes: ["id"],
                where: {
                    role: "user",
                },
                transaction,
            });
            const [userTo, _]: [User, boolean] = await User.findOrCreate({
                where: {
                    user_address: to,
                    roleId: role.id,
                },
                transaction,
            });
            const [userToBalance, isCreatedToBal]: [UserBalance, boolean] =
                await UserBalance.findOrCreate({
                    where: {
                        user_id: userTo.id,
                        nft_ids_id: token[0].id,
                    },
                    defaults: {
                        balance: value,
                    },
                    transaction,
                });
            if (!isCreatedToBal) {
                userToBalance.balance = value;
                await userToBalance.save();
            }
            if (from !== process.env.ZERO_ADDRESS) {
                const [userFrom, _]: [User, boolean] = await User.findOrCreate({
                    where: {
                        user_address: from,
                        roleId: role.id,
                    },
                    transaction,
                });
                const currentUserFromBalance: UserBalance =
                    await UserBalance.findOne({
                        attributes: ["balance"],
                        where: {
                            user_id: userFrom.id,
                        },
                        transaction,
                    });
                const [userFromBalance, isCreatedFromBal]: [
                    UserBalance,
                    boolean,
                ] = await UserBalance.findOrCreate({
                    where: {
                        user_id: userFrom.id,
                        nft_ids_id: token[0].id,
                    },
                    defaults: {
                        balance: currentUserFromBalance.balance - value,
                    },
                    transaction,
                });
                if (!isCreatedFromBal) {
                    userFromBalance.balance =
                        currentUserFromBalance.balance - value;
                    await userFromBalance.save();
                }
            }

            await transaction.commit();
        } catch (err) {
            if (transaction) {
                await transaction.rollback();
            }
            throw err;
        }
    }
}

export const scannerService = new ScannerService();
