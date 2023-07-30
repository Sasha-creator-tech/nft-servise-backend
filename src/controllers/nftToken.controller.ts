import {
    Get,
    JsonController,
    OnNull,
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
        @QueryParams() query: NftTokenDto
    ): Promise<NFTToken[]> {
        return await nftTokenService.getAllNftTokens(query);
    }
}
