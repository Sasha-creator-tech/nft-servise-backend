import app from "../src/app";
import superTestPrefix from "supertest-prefix";
import { database } from "../src/config/database/database";
import NFTToken from "../src/models/nftTokens.model";
import User from "../src/models/user.model";
import NftId from "../src/models/nftIds.model";
import NftMeta from "../src/models/nftMeta.model";
import UserBalance from "../src/models/userBalance.model";
import Brand from "../src/models/brands.model";
import { user1, user2, userRole } from "./mocks";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserRole from "../src/models/userRole.model";
dotenv.config();

const supertest = require("supertest");

const request = supertest(app.app);
const prefix = superTestPrefix("/api");

async function setupDB() {
    await database.addModels([
        NFTToken,
        User,
        NftId,
        NftMeta,
        UserBalance,
        Brand,
    ]);
}

async function beforeAllTests() {
    await setupDB();
    await createCommon();
    return;
}
async function afterAllTests() {
    await destroyCommon();
    app.server.close();
    console.log("Server is closed!");
    database.close();
    return;
}

async function createCommon() {
    await UserRole.create(userRole);
}

async function destroyCommon() {
    await User.destroy({
        where: {
            user_address: user1.address.toLowerCase(),
        },
    });
    await User.destroy({
        where: {
            user_address: user2.address.toLowerCase(),
        },
    });
    await UserRole.destroy({
        where: {
            role: userRole.role,
        },
    });
}

async function destroyBrand(id: number | number[]): Promise<void> {
    await Brand.destroy({ where: { id } });
}

async function destroyNftToken(id: number | number[]): Promise<void> {
    await NFTToken.destroy({ where: { id } });
}

async function destroyMany(model, array): Promise<void> {
    await array.map(async (el) => {
        await model.destroy({
            where: {
                id: el.id,
            },
        });
    });
}

function isValidJWT(str: string): boolean {
    try {
        jwt.verify(str, process.env.JWT_SECRET_OR_KEY);
        return true;
    } catch (error) {
        return false;
    }
}

async function loginUser(user: Object): Promise<string> {
    const token = await request
        .post("/user/auth/login")
        .set("Content-Type", "application/json")
        .send(user)
        .use(prefix);

    return token?.body?.token;
}

export {
    request,
    prefix,
    afterAllTests,
    beforeAllTests,
    destroyBrand,
    destroyNftToken,
    isValidJWT,
    loginUser,
    destroyMany,
};
