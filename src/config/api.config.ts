import { NftTokenController } from "../controllers/nftToken.controller";
import { UserController } from "../controllers/user.controller";

const expressOptions = {
    routePrefix: "/api",
    controllers: [NftTokenController, UserController],
    middlewares: [],
};

export { expressOptions };
