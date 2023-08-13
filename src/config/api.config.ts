import { NftTokenController } from "../controllers/nftToken.controller";
import { UserController } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { Action } from "routing-controllers";
import passport, { use } from "passport";
import { userSoleService } from "../services/userRole.service";

const currentUserChecker = async function (action: Action) {
    if (action.request.user) {
        return action.request.user;
    }
    return getUserFromJWT(action);
};

const getUserFromJWT = function (action: Action) {
    return new Promise((resolve) => {
        return passport.authenticate("jwt", function (err, user) {
            if (err) {
                return resolve(null);
            }
            if (!user) {
                return resolve(null);
            }
            return resolve(user);
        })(action.request, action.response, action.next);
    });
};

const expressOptions = {
    routePrefix: "/api",
    controllers: [NftTokenController, UserController],
    currentUserChecker,
    authorizationChecker: async (action: Action, roles: []) =>
        new Promise<boolean>((resolve, reject) => {
            passport.authenticate("jwt", async (err, user) => {
                if (err) {
                    return reject(err);
                }
                action.request.user = user;
                if (roles?.length) {
                    const isHasAccess: boolean = userSoleService.isHasRole(
                        user,
                        roles,
                    );

                    if (!isHasAccess) {
                        return resolve(false);
                    }
                }
                return resolve(true);
            })(action.request, action.response, action.next);
        }),
    middlewares: [requireAuth],
};

export { expressOptions };
