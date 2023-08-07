import app from "../src/app";
import superTestPrefix from "supertest-prefix";
import { database } from "../src/config/database/database";
import NFTToken from "../src/models/nftTokens.model";
import User from "../src/models/user.model";
import NftId from "../src/models/nftIds.model";
import NftMeta from "../src/models/nftMeta.model";
import UserBalance from "../src/models/userBalance.model";
import Brand from "../src/models/brands.model";

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
    return;
}
async function afterAllTests() {
    app.server.close();
    console.log("Server is closed!");
    database.close();
    return;
}

async function destroyBrand(id: number | number[]): Promise<void> {
    await Brand.destroy({ where: { id } });
}

async function destroyNftToken(id: number | number[]): Promise<void> {
    await NFTToken.destroy({ where: { id } });
}

export {
    request,
    prefix,
    afterAllTests,
    beforeAllTests,
    destroyBrand,
    destroyNftToken,
};
