import { IsIn, IsOptional, IsString } from "class-validator";

export class NftTokenDto {
    @IsOptional()
    @IsString()
    readonly brandName: string;

    @IsOptional()
    @IsString()
    @IsIn(["ASC", "DESC"])
    readonly timeCreation: string;
}
