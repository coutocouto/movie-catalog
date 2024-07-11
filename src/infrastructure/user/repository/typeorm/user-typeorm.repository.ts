import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike } from "typeorm";
import { User } from "../../../../domain/user/user.entity";
import {
  IUserRepository,
  UserSearchParams,
  UserSearchResult,
} from "../../../../domain/user/user.repository";
import { UserModelMapper } from "./user-model.mapper";
import { UserModel } from "./user.model";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserModel)
    private userModelRepository: Repository<UserModel>,
  ) {}

  sortableFields: string[] = ["name", "createdAt"];

  async create(entity: User): Promise<User> {
    const model = UserModelMapper.toModel(entity);
    await this.userModelRepository.save(model);
    return UserModelMapper.toEntity(model);
  }

  async update(entity: User): Promise<User> {
    const { userId, ...rest } = UserModelMapper.toModel(entity);
    await this.userModelRepository.update(userId, rest);
    const updatedUser = await this.userModelRepository.findOne({
      where: { userId },
    });
    return UserModelMapper.toEntity(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await this.userModelRepository.delete({ userId: id });
  }

  async findById(id: string): Promise<User> {
    const model = await this.userModelRepository.findOne({
      where: { userId: id },
    });
    return model ? UserModelMapper.toEntity(model) : null;
  }

  async findAll(): Promise<User[]> {
    return await this.userModelRepository
      .find()
      .then((models) => models.map((model) => UserModelMapper.toEntity(model)));
  }

  async existsByEmail(email: string): Promise<boolean> {
    return await this.userModelRepository.existsBy({ email });
  }

  async findByEmail(email: string): Promise<User> {
    const model = await this.userModelRepository.findOne({
      where: { email },
    });
    return model ? UserModelMapper.toEntity(model) : null;
  }

  async search(props: UserSearchParams): Promise<UserSearchResult> {
    const offset = (props.page - 1) * props.perPage;
    const limit = props.perPage;
    const [users, usersCount] = await this.userModelRepository.findAndCount({
      where: [
        { name: props.filter ? ILike(`%${props.filter}%`) : undefined },
        { email: props.filter ? ILike(`%${props.filter}%`) : undefined },
      ],
      order:
        props.orderBy && this.sortableFields.includes(props.orderBy)
          ? { [props.orderBy]: props.orderDirection }
          : { createdAt: "DESC" },
      skip: offset,
      take: limit,
    });

    return new UserSearchResult({
      items: users.map((model) => UserModelMapper.toEntity(model)),
      total: usersCount,
      currentPage: props.page,
      perPage: props.page,
    });
  }

  async clear() {
    await this.userModelRepository.clear();
  }
}
