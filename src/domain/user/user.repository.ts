import { ISearchableRepository } from "../../shared/domain/repository/repository.interface";
import { SearchParams } from "../../shared/domain/repository/search-params";
import { SearchResult } from "../../shared/domain/repository/search-result";
import { User } from "./user.entity";

export type UserFilter = string;

export type UserId = string;

export class UserSearchParams extends SearchParams<UserFilter> {}

export class UserSearchResult extends SearchResult<User> {}

export interface IUserRepository
  extends ISearchableRepository<
    User,
    UserId,
    UserFilter,
    UserSearchParams,
    UserSearchResult
  > {}
