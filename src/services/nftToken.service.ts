import { NftTokenDto } from "../dto/nftToken.dto";
import NFTToken from "../models/nftTokens.model";
import Brand from "../models/brands.model";

export class NftTokenService {
    public async getAllNftTokens(queryData: NftTokenDto): Promise<NFTToken[]> {
        let order: [string, string][];
        let brandWhere: { name: string };
        //Filter nft tokens by its brand or brands
        if (queryData.brandName) {
            brandWhere = { name: queryData.brandName };
        }
        //Sort nft tokens by its time of creation
        if (queryData.timeCreation) {
            order = [["createdAt", queryData.timeCreation]];
        }
        return NFTToken.findAll({
            attributes: ["title", "address"],
            include: [
                {
                    attributes: ["name", "url"],
                    model: Brand,
                    required: true,
                    where: brandWhere,
                },
            ],
            order,
        });
    }
}

export const nftTokenService = new NftTokenService();
