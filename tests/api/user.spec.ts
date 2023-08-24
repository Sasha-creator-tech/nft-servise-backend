import {
    afterAllTests,
    beforeAllTests,
    destroyMany,
    isValidJWT,
    loginUser,
    prefix,
    request,
} from "../testsHelper";
import {
    brand1,
    nftsId1,
    nftsId2,
    nftToken1,
    nftToken2,
    user1,
    user2,
} from "../mocks";
import NFTToken from "../../src/models/nftTokens.model";
import NftId from "../../src/models/nftIds.model";
import UserBalance from "../../src/models/userBalance.model";
import User from "../../src/models/user.model";
import Brand from "../../src/models/brands.model";

describe("TRUSTWORTHY tests - api - user", () => {
    beforeAll(async () => {
        await beforeAllTests();
    });

    afterAll(async () => {
        await afterAllTests();
    });

    describe("Authorize user", () => {
        test("auth user - success (valid signature)", async () => {
            const token = await request
                .post("/user/auth/login")
                .set("Content-Type", "application/json")
                .send(user1)
                .use(prefix);

            expect(token.status).toBe(200);
            expect(token.body).toBeDefined();
            expect(isValidJWT(token.body.token)).toBe(true);
        });

        test("auth user - failure (invalid signature)", async () => {
            const token = await request
                .post("/user/auth/login")
                .set("Content-Type", "application/json")
                .send({
                    ...user1,
                    //invalid signature
                    signature: user1.signature.slice(0, -1) + "d",
                })
                .use(prefix);

            expect(token.status).toBe(400);
            expect(token.body).toBeDefined();
            expect(token.body.message).toBe("Signature is invalid");
        });

        test("auth user - failure (invalid address)", async () => {
            const token = await request
                .post("/user/auth/login")
                .set("Content-Type", "application/json")
                .send({
                    ...user1,
                    //invalid address
                    address: "0xd529D524966C3B7f53e05B8F8283579af8abDAff",
                })
                .use(prefix);

            expect(token.status).toBe(400);
            expect(token.body).toBeDefined();
            expect(token.body.message).toBe("Signature is invalid");
        });
    });

    describe("Get user balance", () => {
        describe("Authorized user", () => {
            let u1: User;
            let u2: User;
            let authToken1: string;
            let authToken2: string;
            let nftTokens: NFTToken[];
            let brand: Brand;
            let nftIds: NftId[];
            let balances: UserBalance[];
            let userBalances: number = 10;

            beforeAll(async () => {
                authToken1 = await loginUser(user1);
                authToken2 = await loginUser(user2);
                u1 = await User.findOne({
                    where: {
                        user_address: user1.address.toLowerCase(),
                    },
                });
                u2 = await User.findOne({
                    where: {
                        user_address: user2.address.toLowerCase(),
                    },
                });
                brand = await Brand.create(brand1);
                nftTokens = await NFTToken.bulkCreate([
                    {
                        ...nftToken1,
                        brand_id: brand.id,
                    },
                    {
                        ...nftToken2,
                        brand_id: brand.id,
                    },
                ]);
                nftIds = await NftId.bulkCreate([
                    {
                        ...nftsId1,
                        nft_token_id: nftTokens[0].id,
                    },
                    {
                        ...nftsId2,
                        nft_token_id: nftTokens[1].id,
                    },
                ]);
                balances = await UserBalance.bulkCreate([
                    ...nftIds.map((nft) => ({
                        user_id: u1.id,
                        nft_ids_id: nft.id,
                        balance: 10,
                    })),
                    {
                        user_id: u2.id,
                        nft_ids_id: nftIds[1].id,
                        balance: 10,
                    },
                ]);
            });

            afterAll(async () => {
                await destroyMany(UserBalance, balances);
                await destroyMany(NftId, nftIds);
                await destroyMany(NFTToken, nftTokens);
                await Brand.destroy({
                    where: {
                        id: brand.id,
                    },
                });
            });

            test("get user balance - (success)", async () => {
                const balance = await request
                    .get(`/user/balance?address=${user1.address}`)
                    .set("Content-Type", "application/json")
                    .set("Authorization", `Bearer ${authToken1}`)
                    .use(prefix);

                expect(balance.status).toBe(200);
                expect(balance.body).toBeDefined();
                expect(balance.body).toHaveLength(nftTokens.length);
                expect(balance.body[0].balance).toBe(userBalances);
                expect(balance.body[1].balance).toBe(userBalances);
                expect(balance.body[0].nftId.onchain_id).toBe(
                    nftsId1.onchain_id,
                );
                expect(balance.body[1].nftId.onchain_id).toBe(
                    nftsId2.onchain_id,
                );
                expect(
                    balance.body[0].nftId.nftToken.address.toLowerCase(),
                ).toBe(nftToken1.address.toLowerCase());
                expect(balance.body[0].nftId.nftToken.title).toBe(
                    nftToken1.title,
                );
                expect(balance.body[0].nftId.nftToken.brand.name).toBe(
                    brand1.name,
                );
                expect(balance.body[1].nftId.nftToken.brand.url).toBe(
                    brand1.url,
                );
            });

            test("get user balance with different address cases - (success)", async () => {
                const balance1 = await request
                    .get(`/user/balance?address=${user1.address}`)
                    .set("Content-Type", "application/json")
                    .set("Authorization", `Bearer ${authToken1}`)
                    .use(prefix);
                const balance2 = await request
                    .get(`/user/balance?address=${user2.address}`)
                    .set("Content-Type", "application/json")
                    .set("Authorization", `Bearer ${authToken2}`)
                    .use(prefix);

                expect(balance1.status).toBe(200);
                expect(balance1.body).toBeDefined();
                expect(balance1.body).toHaveLength(nftTokens.length);
                expect(balance1.body[0].balance).toBe(userBalances);
                expect(balance1.body[1].balance).toBe(userBalances);
                expect(balance2.status).toBe(200);
                expect(balance2.body).toBeDefined();
                expect(balance2.body).toHaveLength(nftTokens.length - 1);
                expect(balance2.body[0].balance).toBe(userBalances);
            });

            test("get user balance without user_address - (failure)", async () => {
                const balance = await request
                    .get(`/user/balance`)
                    .set("Content-Type", "application/json")
                    .set("Authorization", `Bearer ${authToken1}`)
                    .use(prefix);

                expect(balance.status).toBe(400);
                expect(balance.body).toBeDefined();
                expect(balance.body.errors[0].constraints).toEqual({
                    isEthereumAddress: "address must be an Ethereum address",
                });
            });

            test("get user balance with tokenAddress - (success)", async () => {
                const balance = await request
                    .get(`/user/balance?address=${user1.address}`)
                    .send({ tokenAddress: nftToken1.address })
                    .set("Content-Type", "application/json")
                    .set("Authorization", `Bearer ${authToken1}`)
                    .use(prefix);

                expect(balance.status).toBe(200);
                expect(balance.body).toBeDefined();
                expect(balance.body).toHaveLength(1);
                expect(
                    balance.body[0].nftId.nftToken.address.toLowerCase(),
                ).toBe(nftToken1.address.toLowerCase());
            });
        });

        describe("Unauthorized user", () => {
            test("get user balance - (failure - unauthorized error)", async () => {
                const balance = await request
                    .get(`/user/balance?address=${user1.address}`)
                    .set("Content-Type", "application/json")
                    .use(prefix);

                expect(balance.status).toBe(403);
                expect(balance.body.name).toBe("AccessDeniedError");
            });
        });
    });
});
