import {
    IsEthereumAddress,
    IsInt,
    IsOptional,
    IsString,
} from "class-validator";

export class UserDto {
    @IsEthereumAddress()
    readonly address: string;
}

export class UserAuth extends UserDto {
    @IsString()
    readonly signature: string;

    @IsInt()
    readonly signatureTimestamp: number;
}

export class UserBalanceDto {
    @IsOptional()
    @IsEthereumAddress()
    readonly tokenAddress?: string;
}
