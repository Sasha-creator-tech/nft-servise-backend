import {
    Get,
    JsonController,
    OnNull,
    Param,
    QueryParams,
    UseInterceptor,
} from "routing-controllers";
import { nftTokenService } from "../services/nftToken.service";
import { NftTokenDto } from "../dto/nftToken.dto";
import { NftTokenInterceptor } from "./interceptors/nftToken.interceptor";
import NFTToken from "../models/nftTokens.model";

@JsonController("/nfttoken")
export class NftTokenController {
    @Get()
    @OnNull(404)
    @UseInterceptor(NftTokenInterceptor)
    public async getAllNftTokens(
        @QueryParams() query: NftTokenDto,
    ): Promise<NFTToken[]> {
        return await nftTokenService.getAllNftTokens(query);
    }

    @Get("/:address")
    @OnNull(404)
    @UseInterceptor(NftTokenInterceptor)
    public async getNftToken(
        @Param("address") address: string,
    ): Promise<NFTToken> {
        return await nftTokenService.getNftToken(address);
    }
}
