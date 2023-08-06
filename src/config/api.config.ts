import { NftTokenController } from "../controllers/nftToken.controller";
import { UserController } from "../controllers/user.controller";

const expressOptions = {
    rourePrefix: "/api",
    controllers: [NftTokenController, UserController],
    middlewares: [],
};

export { expressOptions };
