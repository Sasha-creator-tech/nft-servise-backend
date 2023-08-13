import {
    Body,
    Get,
    JsonController,
    OnNull,
    QueryParams,
    UseInterceptor,
    Authorized,
    Post,
} from "routing-controllers";
import dotenv from "dotenv";
dotenv.config();
import { UserAuth, UserBalanceDto, UserDto } from "../dto/user.dto";
import { userService } from "../services/user.service";
import UserBalance from "../models/userBalance.model";
import { UserInterceptor } from "./interceptors/user.interceptor";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { BaseService } from "../services/base.service";
import { Helpers } from "../helpers";

const baseService: BaseService = new BaseService();

@JsonController("/user")
export class UserController {
    @Post("/auth/login")
    async login(@Body() body: UserAuth) {
        try {
            if (!body.signature || !body.signatureTimestamp) {
                return { error: "Signature data is not provided" };
            }
            //Check whether signature is correct
            if (
                !Helpers.isValidSignature(
                    body.address,
                    body.signature,
                    body.signatureTimestamp,
                )
            ) {
                return { error: "Signature is invalid" };
            }
            // Fetch user from the database based on the provided address
            const user: User = await User.findOne({
                where: {
                    user_address: baseService.formatEthAddress(body.address),
                },
            });

            if (user) {
                // Generate a JWT token
                const token: string = jwt.sign(
                    { sub: user.id },
                    process.env.JWT_SECRET_OR_KEY,
                    { expiresIn: "1d" },
                );

                return { token };
            } else {
                return { error: "Invalid credentials" };
            }
        } catch (error) {
            return { error: "An error occurred" };
        }
    }

    @Authorized("user")
    @Get("/balance")
    @OnNull(404)
    @UseInterceptor(UserInterceptor)
    public async getBalance(
        @QueryParams() query: UserDto,
        @Body() data: UserBalanceDto,
    ): Promise<UserBalance[]> {
        return await userService.getBalance(query, data);
    }
}
