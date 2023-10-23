import dotenv from "dotenv";
import "reflect-metadata";
import express from "express";
import { expressOptions } from "./config/api.config";
import { createExpressServer } from "routing-controllers";
import { database } from "./config/database/database";
import { initializeAuth } from "./middleware/auth.middleware";
const cors = require("cors");

dotenv.config();
const app: express.Express = express();
app.use(express.json());
app.use(initializeAuth);
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
    }),
);
const expressServer = createExpressServer(expressOptions);
app.use(expressServer);
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
