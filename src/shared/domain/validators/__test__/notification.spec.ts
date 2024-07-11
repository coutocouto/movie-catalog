import { Notification } from "../notification";

describe("Notification", () => {
  let notification: Notification;

  beforeEach(() => {
    notification = new Notification();
  });

  it("should initialize without errors", () => {
    expect(notification.hasErrors()).toBe(false);
  });

  describe("addError", () => {
    it("should add an error without field", () => {
      notification.addError("Error message");
      expect(notification.hasErrors()).toBe(true);
      expect(notification.toJSON()).toContain("Error message");
    });

    it("should add an error with field", () => {
      notification.addError("Error message", "field");
      expect(notification.hasErrors()).toBe(true);
      expect(notification.toJSON()).toContainEqual({
        field: ["Error message"],
      });
    });

    it("should not add duplicate errors for the same field", () => {
      notification.addError("Error message", "field");
      notification.addError("Error message", "field");
      expect(notification.toJSON()).toContainEqual({
        field: ["Error message"],
      });
    });
  });

  describe("setError", () => {
    it("should set a single error for a field", () => {
      notification.setError("New error", "field");
      expect(notification.toJSON()).toContainEqual({ field: ["New error"] });
    });

    it("should overwrite previous errors for a field", () => {
      notification.addError("Old error", "field");
      notification.setError("New error", "field");
      expect(notification.toJSON()).toContainEqual({ field: ["New error"] });
    });

    it("should set multiple errors when an array is provided", () => {
      notification.setError(["Error 1", "Error 2"], "field");
      expect(notification.toJSON()).toContainEqual({
        field: ["Error 1", "Error 2"],
      });
    });
  });

  describe("hasErrors", () => {
    it("should return true if errors are present", () => {
      notification.addError("Error");
      expect(notification.hasErrors()).toBe(true);
    });

    it("should return false if no errors are present", () => {
      expect(notification.hasErrors()).toBe(false);
    });
  });

  describe("copyErrors", () => {
    it("should copy errors from another notification", () => {
      const other = new Notification();
      other.addError("Error from other", "otherField");
      notification.copyErrors(other);
      expect(notification.toJSON()).toContainEqual({
        otherField: ["Error from other"],
      });
    });
  });

  describe("toJSON", () => {
    it("should return a correct JSON representation", () => {
      notification.addError("Error message", "field");
      expect(notification.toJSON()).toContainEqual({
        field: ["Error message"],
      });
    });
  });
});
