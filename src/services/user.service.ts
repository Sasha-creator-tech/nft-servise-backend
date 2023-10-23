import { UserBalanceDto, UserDto } from "../dto/user.dto";
import UserBalance from "../models/userBalance.model";
import User from "../models/user.model";
import NftId from "../models/nftIds.model";
import NFTToken from "../models/nftTokens.model";
import { BaseService } from "./base.service";
import Brand from "../models/brands.model";
import { Op } from "sequelize";

export class UserService extends BaseService {
    public async getBalance(
        queryData: UserDto,
        bodyData: UserBalanceDto,
    ): Promise<UserBalance[]> {
        let tokenWhere = {} as { address: string | string[] };
        if (bodyData.tokenAddress) {
            tokenWhere.address = this.formatEthAddress(bodyData.tokenAddress);
        }

        return UserBalance.findAll({
            attributes: ["balance"],
            where: {
                balance: {
                    [Op.gt]: 0,
                },
            },
            include: [
                {
                    attributes: [],
                    model: User,
                    required: true,
                    where: {
                        user_address: this.formatEthAddress(queryData.address),
                    },
                },
                {
                    attributes: ["onchain_id"],
                    model: NftId,
                    required: true,
                    include: [
                        {
                            attributes: ["address", "title"],
                            model: NFTToken,
                            required: true,
                            where: tokenWhere ? tokenWhere : {},
                            include: [
                                {
                                    attributes: ["name", "url"],
                                    model: Brand,
                                    required: true,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    }
}

export const userService = new UserService();
