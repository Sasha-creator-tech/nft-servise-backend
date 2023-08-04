import { NftTokenController } from "../controllers/nftToken.controller";

const expressOptions = {
    rourePrefix: "/api",
    controllers: [NftTokenController],
    middlewares: [],
};

export { expressOptions };
