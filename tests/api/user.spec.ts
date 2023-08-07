describe("TRUSTWORTHY tests - api - user", () => {
    describe("Get user balance ", () => {
        describe("Authorized user", () => {
            test("get user balance - (success)", async () => {});

            test("get user balance with different address cases - (success)", async () => {});

            test("get user balance without user_address - (failure)", async () => {});

            test("get user balance with tokenAddress - (success)", async () => {});

            test("get user balance without tokenAddress - (success)", async () => {});

            test("get full user balance content - (success)", async () => {});
        });

        describe("Unauthorized user", () => {
            test("get user balance - (failure - unauthorized error)", async () => {});
        });
    });
});
