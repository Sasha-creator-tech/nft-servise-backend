import { NftTokenDto } from "../dto/nftToken.dto";
import NFTToken from "../models/nftTokens.model";
import Brand from "../models/brands.model";
import NftId from "../models/nftIds.model";
import UserBalance from "../models/userBalance.model";
import User from "../models/user.model";
import dotenv from "dotenv";
dotenv.config();

export class NftTokenService {
    public async getAllNftTokens(queryData: NftTokenDto): Promise<NFTToken[]> {
        let order: [string, string][];
        let brandWhere: { name: string };
        //Filter nft tokens by its brand or brands
        if (queryData.brandName) {
            brandWhere = { name: queryData.brandName };
        }
        //Sort nft tokens by its time of creation
        if (queryData.timeCreation) {
            order = [["createdAt", queryData.timeCreation]];
        }
        return NFTToken.findAll({
            attributes: ["title", "address"],
            include: [
                {
                    attributes: ["name", "url"],
                    model: Brand,
                    required: true,
                    where: brandWhere,
                },
            ],
            order,
        });
    }

    async getNftToken(address: string): Promise<NFTToken> {
        return NFTToken.findOne({
            attributes: ["id", "title", "address"],
            include: [
                {
                    attributes: ["name", "url"],
                    model: Brand,
                    required: true,
                },
                {
                    model: NftId,
                    required: true,
                    include: [
                        {
                            attributes: [["balance", "amount"]],
                            model: UserBalance,
                            required: true,
                            include: [
                                {
                                    attributes: [],
                                    model: User,
                                    required: true,
                                    where: {
                                        user_address:
                                            process.env.MAIN_CONTRACT_ADDRESS.toLowerCase(),
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
            where: {
                address: address.toLowerCase(),
            },
        });
    }
}

export const nftTokenService = new NftTokenService();
