import Brand from "../models/brands.model";

class BrandService {
    public async getAllBrands(): Promise<Brand[]> {
        return Brand.findAll();
    }
}

export const brandService = new BrandService();
