import { MaxLength } from "class-validator";
import { Movie } from "./movie.entity";
import { ClassValidatorFields } from "../../shared/domain/validators/class-validator-fields";
import { Notification } from "../../shared/domain/validators/notification";

export class MovieRules {
  @MaxLength(255, { groups: ["title"] })
  title: string;

  constructor(entity: Movie) {
    Object.assign(this, entity);
  }
}

export class MovieValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const newFields = fields?.length ? fields : ["title"];
    return super.validate(notification, new MovieRules(data), newFields);
  }
}

export class MovieValidatorFactory {
  static create() {
    return new MovieValidator();
  }
}
