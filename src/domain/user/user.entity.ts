import { BaseEntity } from "../../shared/domain/base.entity";
import { UserFakeBuilder } from "./user.fake";
import { UserValidatorFactory } from "./user.validator";
import { v4 as uuidv4 } from "uuid";

type UserConstructorProps = {
  userId?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
};

export class User extends BaseEntity {
  userId: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;

  constructor(props: UserConstructorProps) {
    super();
    this.userId = props.userId || uuidv4();
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.createdAt = props.createdAt || new Date();
  }

  get entityId(): string {
    return this.userId;
  }

  static create(name: string, email: string, password: string): User {
    const user = new User({ name, email, password });
    user.validate();
    return user;
  }

  static from(props: UserConstructorProps): User {
    return new User(props);
  }

  validate(fields?: string[]) {
    const validator = UserValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  static fake() {
    return UserFakeBuilder;
  }

  changeName(name: string) {
    this.name = name;
    this.validate(["name"]);
  }

  toJSON() {
    return {
      userId: this.userId,
      name: this.name,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt,
    };
  }
}
