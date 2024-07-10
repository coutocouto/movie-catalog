import { User } from "../user.entity";

describe("User entity unit test", () => {
  beforeEach(() => {
    User.prototype.validate = jest
      .fn()
      .mockImplementation(User.prototype.validate);
  });
  test("should create a user entity", () => {
    const user = new User({
      name: "John Doe",
      email: "teste@teste.com",
      password: "123456",
    });

    expect(user).toBeInstanceOf(User);
    expect(user.userId).toBeDefined();
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("teste@teste.com");
    expect(user.password).toBe("123456");
    expect(user.createdAt).toBeDefined();
    expect(user.notification.hasErrors()).toBe(false);
  });

  test("should create a user entity with custom userId", () => {
    const user = new User({
      userId: "123",
      name: "John Doe",
      email: "teste@teste.com",
      password: "123456",
    });

    expect(user).toBeInstanceOf(User);
    expect(user.userId).toBe("123");
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("teste@teste.com");
    expect(user.password).toBe("123456");
    expect(user.createdAt).toBeDefined();
    expect(user.notification.hasErrors()).toBe(false);
  });

  test("should create a user entity with custom createdAt", () => {
    const user = new User({
      name: "John Doe",
      email: "teste@teste.com",
      password: "123456",
      createdAt: new Date("2021-01-01"),
    });

    expect(user).toBeInstanceOf(User);
    expect(user.createdAt).toEqual(new Date("2021-01-01"));
    expect(user.userId).toBeDefined();
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("teste@teste.com");
    expect(user.password).toBe("123456");
    expect(user.createdAt).toBeDefined();
    expect(user.notification.hasErrors()).toBe(false);
  });

  test("should create a user using a command", () => {
    const user = User.create("John Doe", "teste@teste.com", "123456");

    expect(user).toBeInstanceOf(User);
    expect(user.userId).toBeDefined();
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("teste@teste.com");
    expect(user.password).toBe("123456");
    expect(user.createdAt).toBeDefined();
    expect(user.validate).toHaveBeenCalledTimes(1);
    expect(user.notification.hasErrors()).toBe(false);
  });

  test("should change user name", () => {
    const user = User.create("John Doe", "teste@teste.com", "123456");
    user.changeName("Jane Doe");
    expect(user.name).toBe("Jane Doe");
  });
});

describe("User entity validation unit test", () => {
  beforeEach(() => {
    User.prototype.validate = jest
      .fn()
      .mockImplementation(User.prototype.validate);
  });

  test("should an user entity with invalid name", () => {
    const user = User.create("x".repeat(256), "teste@teste.com", "123456");

    expect(user.notification.hasErrors()).toBe(true);
    expect(user.notification.errors.size).toBe(1);
    const nameErrors = Array.from(user.notification.errors.get("name"));
    expect(nameErrors).toEqual([
      "name must be shorter than or equal to 255 characters",
    ]);
  });

  test("should an user entity with invalid email", () => {
    const user = User.create("John Doe", "teste", "123456");

    expect(user.notification.hasErrors()).toBe(true);
    expect(user.notification.errors.size).toBe(1);
    const emailErrors = Array.from(user.notification.errors.get("email"));
    expect(emailErrors).toEqual(["email must be an email"]);
  });
});
