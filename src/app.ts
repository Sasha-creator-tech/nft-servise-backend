import dotenv from "dotenv";
import { Express } from "express";
import { expressOptions } from "./config/api.config";
import { createExpressServer } from "routing-controllers";
import { database } from "./config/database/database";

dotenv.config();
const app: Express = createExpressServer(expressOptions);
const port: number | string = process.env.PORT || 4000;
database.addModels([__dirname + "/models"]);

app.listen(port, () => {
    console.log(`server is up and listening on port ${port}`);
});
