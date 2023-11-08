import { Body, JsonController, Post } from "routing-controllers";
import { VerificationDto } from "../dto/verificationDto";
import { VerificationService } from "../services/verification.service";

@JsonController("/verify")
export class VerificationController {
    @Post("/ownership")
    public async verifyOwnership(
        @Body() data: VerificationDto,
    ): Promise<boolean> {
        return VerificationService.verifyOwnership(data);
    }

    @Post("/usage")
    public async verifyUsage(@Body() data: VerificationDto): Promise<number> {
        return VerificationService.verifyUsage(data);
    }
}
