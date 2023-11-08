import {
    ValidationOptions,
    registerDecorator,
    ValidationArguments,
} from "class-validator";
import { helpers } from "../../helpers";

export function IsValidSignature(
    property: string[],
    validationOptions: ValidationOptions,
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "IsValidSignature",
            target: object.constructor,
            propertyName,
            constraints: property,
            options: validationOptions,
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    const [address, brand, token, timestamp, onchainId] =
                        args.constraints;
                    return helpers.isValidOwnershipSignature(
                        args.object[address],
                        value,
                        args.object[timestamp],
                        args.object[brand],
                        args.object[token],
                        args.object[onchainId],
                    );
                },
            },
        });
    };
}
