import { VerificationDto } from "../dto/verificationDto";
import { userService } from "./user.service";
import UserBalance from "../models/userBalance.model";
import { verificationType } from "../types/verifiaction.type";
import { BadRequestError } from "routing-controllers";
import NftId from "../models/nftIds.model";

export class VerificationService {
    static async verifyOwnership(body: VerificationDto): Promise<boolean> {
        const { address, brand, token, onchainId }: verificationType = body;
        const balance: UserBalance = await userService.checkBalance(
            address,
            onchainId,
            token,
            brand,
        );

        return !!balance;
    }

    static async verifyUsage(body: VerificationDto): Promise<number> {
        const { address, brand, token, onchainId }: verificationType = body;
        const balance: UserBalance = await userService.checkBalance(
            address,
            onchainId,
            token,
            brand,
        );
        if (!balance) {
            throw new BadRequestError("Token not found");
        }
        await NftId.update(
            {
                isUsed: true,
            },
            {
                where: {
                    id: balance.nftId.id,
                },
            },
        );

        return balance.nftId.id;
    }
}
