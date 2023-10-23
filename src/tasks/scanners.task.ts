import { mainScanner } from "../scanners/main.scanner";
import dotenv from "dotenv";
import { database } from "../config/database/database";
import * as path from "path";
import { collectionScanner } from "../scanners/collection.scanner";

dotenv.config();
database.addModels([path.join(__dirname, "..") + "/models"]);

const scanner = process.argv[2];

switch (scanner) {
    case "main": {
        startMainScanner();
        break;
    }

    case "collections": {
        startCollectionsScanner();
        break;
    }

    default: {
        throw new Error(`Task ${scanner} not found`);
    }
}

function startMainScanner(): Promise<void> {
    return mainScanner
        .startScanning(
            Number(process.env.CHAIN_ID),
            process.env.MAIN_CONTRACT_ADDRESS.toLowerCase(),
        )
        .then((res) => {
            console.log(
                `Scanner for the main contract successfully finished.\nLast scanned block: ${res}`,
            );
        })
        .catch((err) => {
            console.log(
                `Scanner process stopped with the error: ${err}. Main contract.`,
            );
        });
}

function startCollectionsScanner(): Promise<void> {
    return collectionScanner
        .startScanning(Number(process.env.CHAIN_ID))
        .then((res) => {
            console.log(
                `Scanner for the collections successfully finished.\nLast scanned block: ${res}`,
            );
        })
        .catch((err) => {
            console.log(
                `Scanner process stopped with the error: ${err}. Collections.`,
            );
        });
}
