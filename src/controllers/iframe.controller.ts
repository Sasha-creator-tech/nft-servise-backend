import { Get, JsonController, OnNull, Res } from "routing-controllers";
import e, { Response } from "express";
import { IframeService } from "../services/iframe.service";

@JsonController("/iframe")
export class IframeController {
    @Get()
    @OnNull(404)
    public async getIframeLogic(
        @Res() res: Response,
    ): Promise<e.Response<any, Record<string, any>>> {
        const code: string = await IframeService.getIframeLogic();
        res.setHeader("Content-Type", "application/javascript");
        return res.send(code);
    }
}
