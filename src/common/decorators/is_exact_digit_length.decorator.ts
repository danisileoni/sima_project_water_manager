import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsExactDigitLength(
  length: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isExactDigitLength',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [length],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'number') return false;
          const strValue = value.toString();
          return (
            strValue.length === args.constraints[0] && /^\d+$/.test(strValue)
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `
${args.property} must have exactly ${args.constraints[0]} digits`;
        },
      },
    });
  };
}
