import { User } from "../../../../domain/user/user.entity";
import { EntityValidationError } from "../../../../shared/domain/validators/validation.error";
import { UserModel } from "./user.model";

export class UserModelMapper {
  static toEntity(user: UserModel) {
    const userEntity = User.from({
      userId: user.userId,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
    });
    userEntity.validate();
    if (userEntity.notification.hasErrors()) {
      throw new EntityValidationError(userEntity.notification.toJSON());
    }
    return userEntity;
  }

  static toModel(user: User) {
    return UserModel.from(user);
  }
}
