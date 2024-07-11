import { BaseEntity, Column, Entity } from "typeorm";
import { User } from "../../../../domain/user/user.entity";

@Entity({ name: "users" })
export class UserModel extends BaseEntity {
  @Column({ primary: true })
  userId: string;
  @Column({ nullable: false })
  name: string;
  @Column({ unique: true })
  email: string;
  @Column({ nullable: false })
  password: string;
  @Column({ nullable: false })
  createdAt: Date;

  static from(user: User) {
    const userModel = new UserModel();
    userModel.userId = user.userId;
    userModel.name = user.name;
    userModel.email = user.email;
    userModel.password = user.password;
    userModel.createdAt = user.createdAt;
    return userModel;
  }
}
