import {
    IsEthereumAddress,
    IsNumber,
    IsPositive,
    IsString,
} from "class-validator";
import { IsValidSignature } from "./validators/verification.validator";

export class VerificationDto {
    @IsEthereumAddress()
    @IsString()
    readonly address: string;

    @IsString()
    readonly brand: string;

    @IsValidSignature(["address", "brand", "token", "timestamp", "onchainId"], {
        message: "Signature is invalid",
    })
    @IsString()
    readonly signature: string;

    @IsEthereumAddress()
    @IsString()
    readonly token: string;

    @IsNumber()
    @IsPositive()
    readonly timestamp: number;

    @IsNumber()
    @IsPositive()
    readonly onchainId: number;
}
