import {
    Body,
    Get,
    JsonController,
    OnNull,
    QueryParams,
    UseInterceptor,
} from "routing-controllers";
import { UserBalanceDto, UserDto } from "../dto/user.dto";
import { userService } from "../services/user.service";
import UserBalance from "../models/userBalance.model";
import { UserInterceptor } from "./interceptors/user.interceptor";

@JsonController("/user")
export class UserController {
    //TODO: add authorisation
    @Get()
    @OnNull(404)
    @UseInterceptor(UserInterceptor)
    public async getBalance(
        @QueryParams() query: UserDto,
        @Body() data: UserBalanceDto
    ): Promise<UserBalance[]> {
        return await userService.getBalance(query, data);
    }
}
