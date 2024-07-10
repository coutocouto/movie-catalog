import { Column, Entity } from "typeorm";
import { User } from "../../../../domain/user/user.entity";

@Entity()
export class UserModel {
  @Column({ primary: true })
  userId: string;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
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
