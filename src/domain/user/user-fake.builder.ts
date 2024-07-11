/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from "./user.entity";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";

type PropOrFactory<T> = T | ((index: number) => T);

export class UserFakeBuilder<TBuild = any> {
  private _userId: PropOrFactory<string> | undefined = undefined;
  private _name: PropOrFactory<string> = (_) => faker.person.firstName("male");
  private _email: PropOrFactory<string> = (_) => faker.internet.email();
  private _password: PropOrFactory<string> = (_) => faker.internet.password();
  private _createdAt: PropOrFactory<Date> | undefined = undefined;

  private countObjs: number;

  static aUser() {
    return new UserFakeBuilder<User>();
  }

  static theUsers(countObjs: number) {
    return new UserFakeBuilder<User[]>(countObjs);
  }

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
  }

  withUserId(valueOrFactory: PropOrFactory<string>) {
    this._userId = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withEmail(valueOrFactory: PropOrFactory<string>) {
    this._email = valueOrFactory;
    return this;
  }

  withPassword(valueOrFactory: PropOrFactory<string>) {
    this._password = valueOrFactory;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._createdAt = valueOrFactory;
    return this;
  }

  build(): TBuild {
    const users = new Array(this.countObjs).fill(undefined).map((_, index) => {
      const user = new User({
        userId: this.callFactory(this._userId, index) || uuidv4(),
        name: this.callFactory(this._name, index),
        email: this.callFactory(this._email, index),
        password: this.callFactory(this._password, index),
        createdAt: this.callFactory(this._createdAt, index) || new Date(),
      });
      user.validate();
      return user;
    });
    return this.countObjs === 1 ? (users[0] as any) : users;
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === "function"
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
