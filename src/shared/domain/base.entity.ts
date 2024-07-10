import { Notification } from "./validators/notification";

export abstract class BaseEntity {
  notification: Notification = new Notification();

  abstract get entityId(): string;
  abstract toJSON(): any;
}
