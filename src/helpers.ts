import { ethers } from "ethers";
import dotenv from "dotenv";
import { baseService } from "./services/base.service";
dotenv.config();

class Helpers {
    public isValidAuthSignature(
        userAddress: string,
        signature: string,
        timestamp: number,
    ): boolean {
        return this.isValid(
            this.buildMessage([
                process.env.SIGNATURE_KEY,
                timestamp.toString(),
            ]),
            signature,
            userAddress,
        );
    }

    public isValidOwnershipSignature(
        userAddress: string,
        signature: string,
        timestamp: number,
        brand: string,
        token: string,
        onchainId: number,
    ): boolean {
        return this.isValid(
            this.buildMessage([
                brand,
                token,
                timestamp.toString(),
                onchainId.toString(),
            ]),
            signature,
            userAddress,
        );
    }

    private isValid(
        message: string,
        signature: string,
        userAddress: string,
    ): boolean {
        const recoveredAddress: string = ethers.utils.verifyMessage(
            message,
            signature,
        );
        return (
            baseService.formatEthAddress(userAddress) ===
            baseService.formatEthAddress(recoveredAddress)
        );
    }

    private buildMessage(params: string[]): string {
        return params.join("_");
    }
}

export const helpers = new Helpers();
