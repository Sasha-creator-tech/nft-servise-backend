import { IsEthereumAddress, IsOptional } from "class-validator";

export class UserDto {
    @IsEthereumAddress()
    readonly address: string;
}

export class UserBalanceDto {
    @IsOptional()
    @IsEthereumAddress()
    readonly tokenAddress?: string;
}
