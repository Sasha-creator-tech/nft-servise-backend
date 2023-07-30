import { InterceptorInterface, Action } from "routing-controllers";
import { Model } from "sequelize-typescript";

export abstract class BaseInterceptor implements InterceptorInterface {
    intercept(action: Action, result: any): any {
        if (result === null || result === undefined) return result;
        else if (Array.isArray(result)) {
            let content: Array<any> = [];
            for (let data of result) {
                content.push(this.format(this.jsonify(data)));
            }
            return content;
        } else return this.format(this.jsonify(result));
    }

    public abstract format(result);

    protected jsonify(data) {
        if (data instanceof Model) return data.toJSON();
        else return data;
    }
}
