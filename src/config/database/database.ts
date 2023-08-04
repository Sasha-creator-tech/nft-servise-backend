import * as dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
dotenv.config();

const config: any = {
    dialect: "postgres",
    query: { raw: false },
    // TODO: add logging
};

export const database: Sequelize = new Sequelize(
    process.env.DATABASE_URL!,
    config
);
