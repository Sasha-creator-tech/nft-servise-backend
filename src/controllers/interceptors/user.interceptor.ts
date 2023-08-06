import { BaseInterceptor } from "./base.interceptor";
import { InterceptorInterface } from "routing-controllers";

export class UserInterceptor
    extends BaseInterceptor
    implements InterceptorInterface
{
    public format(result) {
        return result;
    }
}
