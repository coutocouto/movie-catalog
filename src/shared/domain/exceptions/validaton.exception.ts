import { ValidationError } from "class-validator";

export class CustomValidationError extends ValidationError {
  constructor(message: string, property: string) {
    super();
    this.constraints = { [property]: message };
    this.property = property;
  }
}
