import {
    Get,
    JsonController,
    OnNull,
    UseInterceptor,
} from "routing-controllers";
import Brand from "../models/brands.model";
import { brandService } from "../services/brand.service";
import { BrandInterceptor } from "./interceptors/brand.interceptor";

@JsonController("/brand")
export class BrandController {
    @Get()
    @OnNull(404)
    @UseInterceptor(BrandInterceptor)
    public getAllBrands(): Promise<Brand[]> {
        return brandService.getAllBrands();
    }
}
