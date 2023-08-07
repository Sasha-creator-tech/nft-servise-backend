import dotenv from "dotenv";
import { Express } from "express";
import { expressOptions } from "./config/api.config";
import { createExpressServer } from "routing-controllers";
import { database } from "./config/database/database";

dotenv.config();
const app: Express = createExpressServer(expressOptions);
const port: number | string = process.env.PORT || 4000;
database.addModels([__dirname + "/models"]);

const server = app.listen(port, () => {
    console.log(`Server is up and listening on port ${port}`);
});

//exported for unit tests
export default {
    app,
    server,
};
