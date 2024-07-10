import { ClassValidatorFields } from "../../shared/domain/validators/class-validator-fields";
import { Notification } from "../../shared/domain/validators/notification";
import { User } from "./user.entity";
import { IsEmail, MaxLength } from "class-validator";

export class UserRules {
  @MaxLength(255, { groups: ["name"] })
  name: string;

  @IsEmail({}, { groups: ["email"] })
  email: string;

  constructor(entity: User) {
    Object.assign(this, entity);
  }
}

export class UserValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const newFields = fields?.length ? fields : ["name", "email"];
    return super.validate(notification, new UserRules(data), newFields);
  }
}

export class UserValidatorFactory {
  static create() {
    return new UserValidator();
  }
}
