export class BaseService {
    public formatEthAddress(address: string | string[]): string | string[] {
        if (Array.isArray(address)) {
            return address.map((a) => a.toLowerCase());
        } else {
            return address.toLowerCase();
        }
    }
}

export const baseService = new BaseService();
