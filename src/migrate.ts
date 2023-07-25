import * as dotenv from "dotenv";
dotenv.config();

const Umzug = require("umzug");

import { Sequelize } from "sequelize-typescript";

//! sign used to avoid error "'process.env.DATABASE_URL' is possibly 'undefined'"
const sequelize: Sequelize = new Sequelize(process.env.DATABASE_URL!, {
    dialect: "postgres",
    query: { raw: false },
    logging: (sql: string) => console.log(sql),
});

const umzug = new Umzug({
    storage: "sequelize",
    storageOptions: {
        sequelize: sequelize,
    },
    migrations: {
        params: [
            sequelize.getQueryInterface(),
            sequelize.constructor, //for DataTypes
        ],
        path: "./src/config/database/migrations",
        pattern: /\.ts$/,
    },
    logging: () => console.log,
});

function cmdMigrate() {
    return umzug.up();
}

function cmdReset() {
    return umzug.down({ to: 0 });
}

const cmd: string = process.argv[2].trim();
let executedCmd;

console.log(`${cmd} begin...`);

switch (cmd) {
    case "up": {
        executedCmd = cmdMigrate();
        break;
    }
    case "down": {
        executedCmd = cmdReset();
        break;
    }
}

executedCmd
    .then(() => {
        console.log(`${cmd} done.`);
    })
    .catch((err: any) => {
        console.log(`${cmd} error.`);
        console.error(err);
    });
