import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class TicketKindValidator implements ValidatorConstraintInterface {
  validate(text: string) {
    return text === 'half' || text === 'full';
  }

  defaultMessage() {
    return "O ticket deve ser do tipo 'half' ou 'full' ";
  }
}

export function IsTicketKindValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: TicketKindValidator,
    });
  };
}
