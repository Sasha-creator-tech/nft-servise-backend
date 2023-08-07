import {
    afterAllTests,
    beforeAllTests,
    destroyBrand,
    destroyNftToken,
    prefix,
    request,
} from "../testsHelper";
import NFTToken from "../../src/models/nftTokens.model";
import Brand from "../../src/models/brands.model";
import { brand1, brand2, nftToken1, nftToken2, nftToken3 } from "../mocks";

describe("TRUSTWORTHY tests - api - nft token", () => {
    beforeAll(async () => {
        await beforeAllTests();
    });

    afterAll(async () => {
        await afterAllTests();
    });

    describe("Get all nft tokens", () => {
        const nftTokens: NFTToken[] = [];
        let brandOne: Brand;
        let brandTwo: Brand;

        beforeAll(async () => {
            brandOne = await Brand.create(brand1);
            brandTwo = await Brand.create(brand2);
            const fiveMinutesInMillis = 5 * 60 * 1000; // Five minutes in milliseconds
            const tenMinutesInMillis = 10 * 60 * 1000; // Five minutes in milliseconds
            nftTokens.push(
                await NFTToken.create({
                    ...nftToken1,
                    brand_id: brandOne.id,
                }),
                await NFTToken.create({
                    ...nftToken2,
                    brand_id: brandOne.id,
                    createdAt: new Date(
                        new Date().getTime() - fiveMinutesInMillis
                    ),
                }),
                await NFTToken.create({
                    ...nftToken3,
                    brand_id: brandTwo.id,
                    createdAt: new Date(
                        new Date().getTime() - tenMinutesInMillis
                    ),
                })
            );
        });

        afterAll(async () => {
            await destroyNftToken(nftTokens.map((nft) => nft.id));
            await destroyBrand(brandOne.id);
        });

        test("get all nft tokens - (success - unauthorized)", async () => {
            const nfts = await request
                .get("/nfttoken?timeCreation=DESC")
                .set("Content-Type", "application/json")
                .use(prefix);

            expect(nfts).toBeDefined();
            expect(nfts.body).toHaveLength(nftTokens.length);
            expect(nfts.body[0].title).toBe(nftTokens[0].title);
            expect(nfts.body[1].title).toBe(nftTokens[1].title);
            expect(nfts.body[2].title).toBe(nftTokens[2].title);
            expect(nfts.body[0].address).toBe(nftTokens[0].address);
            expect(nfts.body[1].address).toBe(nftTokens[1].address);
            expect(nfts.body[2].address).toBe(nftTokens[2].address);
            expect(nfts.body[0].brand).toEqual(brand1);
            expect(nfts.body[1].brand).toEqual(brand1);
            expect(nfts.body[2].brand).toEqual(brand2);
        });

        test("get all nft tokens filtered by brandName - (success)", async () => {
            const nfts = await request
                .get(`/nfttoken?brandName=${brand1.name}`)
                .set("Content-Type", "application/json")
                .use(prefix);

            expect(nfts).toBeDefined();
            const nftCount: number = await NFTToken.count({
                include: [
                    {
                        model: Brand,
                        required: true,
                        where: {
                            id: brandOne.id,
                        },
                    },
                ],
            });
            expect(nfts.body).toHaveLength(nftCount);
            expect(nfts.body[0].title).toBe(nftTokens[0].title);
            expect(nfts.body[1].title).toBe(nftTokens[1].title);
            expect(nfts.body[0].address).toBe(nftTokens[0].address);
            expect(nfts.body[1].address).toBe(nftTokens[1].address);
            expect(nfts.body[0].brand).toEqual(brand1);
            expect(nfts.body[1].brand).toEqual(brand1);
        });

        test("get all nft tokens for a non-existent brandOne - (success - empty array)", async () => {
            const nfts = await request
                .get("/nfttoken?brandName=NoNameBrand")
                .set("Content-Type", "application/json")
                .use(prefix);

            expect(nfts).toBeDefined();
            expect(nfts.body).toHaveLength(0);
        });

        test("get all nft tokens ordered by timeCreation - (success)", async () => {
            const nfts1 = await request
                .get(`/nfttoken?timeCreation=DESC`)
                .set("Content-Type", "application/json")
                .use(prefix);

            expect(nfts1).toBeDefined();
            expect(nfts1.body).toHaveLength(nftTokens.length);
            expect(nfts1.body[0].title).toBe(nftTokens[0].title);
            expect(nfts1.body[1].title).toBe(nftTokens[1].title);
            expect(nfts1.body[2].title).toBe(nftTokens[2].title);
            expect(nfts1.body[0].address).toBe(nftTokens[0].address);
            expect(nfts1.body[1].address).toBe(nftTokens[1].address);
            expect(nfts1.body[2].address).toBe(nftTokens[2].address);
            expect(nfts1.body[0].brand).toEqual(brand1);
            expect(nfts1.body[1].brand).toEqual(brand1);
            expect(nfts1.body[2].brand).toEqual(brand2);

            const nfts2 = await request
                .get(`/nfttoken?timeCreation=ASC`)
                .set("Content-Type", "application/json")
                .use(prefix);

            expect(nfts2).toBeDefined();
            expect(nfts2.body).toHaveLength(nftTokens.length);
            expect(nfts2.body[0].title).toBe(nftTokens[2].title);
            expect(nfts2.body[1].title).toBe(nftTokens[1].title);
            expect(nfts2.body[2].title).toBe(nftTokens[0].title);
            expect(nfts2.body[0].address).toBe(nftTokens[2].address);
            expect(nfts2.body[1].address).toBe(nftTokens[1].address);
            expect(nfts2.body[2].address).toBe(nftTokens[0].address);
            expect(nfts2.body[0].brand).toEqual(brand2);
            expect(nfts2.body[1].brand).toEqual(brand1);
            expect(nfts2.body[2].brand).toEqual(brand1);
        });
    });
});
