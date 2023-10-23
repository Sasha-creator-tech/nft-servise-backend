import { InterceptorInterface } from "routing-controllers";
import { BaseInterceptor } from "./base.interceptor";

export class NftTokenInterceptor
    extends BaseInterceptor
    implements InterceptorInterface
{
    public format(result) {
        return result;
    }
}
