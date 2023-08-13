import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
import { Strategy, ExtractJwt } from "passport-jwt";
import User from "../models/user.model";
import UserRole from "../models/userRole.model";

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_OR_KEY,
};

passport.use(
    new Strategy(jwtOptions, async (payload, done) => {
        try {
            // Fetch user from the database based on the payload's user ID
            const user: User = await User.findByPk(payload.sub, {
                include: [
                    { attributes: ["role"], model: UserRole, required: false },
                ],
            });

            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    }),
);

export const initializeAuth = passport.initialize();
export const requireAuth = passport.authenticate("jwt", { session: false });
