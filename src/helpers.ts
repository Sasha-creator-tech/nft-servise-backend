import { ethers } from "ethers";
import dotenv from "dotenv";
import { baseService } from "./services/base.service";
dotenv.config();

export class Helpers {
    public static isValidSignature(
        userAddress: string,
        signature: string,
        timestamp: number,
    ): boolean {
        const recoveredAddress: string = ethers.utils.verifyMessage(
            `${process.env.SIGNATURE_KEY}_${timestamp}`,
            signature,
        );

        return (
            baseService.formatEthAddress(userAddress) ===
            baseService.formatEthAddress(recoveredAddress)
        );
    }
}
