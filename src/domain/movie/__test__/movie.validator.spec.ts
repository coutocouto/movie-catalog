import { Notification } from "../../../shared/domain/validators/notification";
import { UserFakeBuilder } from "../../user/user-fake.builder";
import { UserValidator, UserValidatorFactory } from "../../user/user.validator";

describe("UserValidator", () => {
  let validator: UserValidator;
  let notification: Notification;

  beforeEach(() => {
    notification = new Notification();
    validator = UserValidatorFactory.create();
  });

  describe("validate", () => {
    it("should validate user name length", () => {
      const user = UserFakeBuilder.aUser()
        .withName("a".repeat(256))
        .withEmail("user@example.com")
        .build();

      const isValid = validator.validate(notification, user, ["name"]);
      expect(isValid).toBe(false);
      expect(notification.hasErrors()).toBe(true);
      expect(notification.toJSON()).toContainEqual({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should validate user email format", () => {
      const user = UserFakeBuilder.aUser()
        .withName("John Doe")
        .withEmail("invalid-email")
        .build();

      const isValid = validator.validate(notification, user, ["email"]);
      expect(isValid).toBe(false);
      expect(notification.hasErrors()).toBe(true);
      expect(notification.toJSON()).toContainEqual({
        email: ["email must be an email"],
      });
    });

    it("should pass validation with valid name and email", () => {
      const user = UserFakeBuilder.aUser()
        .withName("John Doe")
        .withEmail("john.doe@example.com")
        .build();

      const isValid = validator.validate(notification, user, ["name", "email"]);
      expect(isValid).toBe(true);
      expect(notification.hasErrors()).toBe(false);
    });
  });
});
