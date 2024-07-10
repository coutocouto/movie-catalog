import { BaseEntity } from "../base.entity";
import { SearchParams } from "./search-params";
import { SearchResult } from "./search-result";

export interface IRepository<T, TId> {
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: TId): Promise<void>;
  findById(id: TId): Promise<T>;
  findAll(): Promise<T[]>;
}

export interface ISearchableRepository<
  T extends BaseEntity,
  TId,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult,
> extends IRepository<T, TId> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
}
