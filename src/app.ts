import dotenv from "dotenv";
import { Express } from "express";
import { expressOptions } from "./config/api.config";
import { createExpressServer } from "routing-controllers";

dotenv.config();
const app: Express = createExpressServer(expressOptions);
const port: number | string = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`server is up and listening on port ${port}`);
});
