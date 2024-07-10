export type OrderDirection = "asc" | "desc";

export type SearchParamsConstructorProps<Filter = string> = {
  page?: number;
  perPage?: number;
  orderBy?: string | null;
  orderDirection?: OrderDirection | null;
  filter?: Filter | null;
};

export class SearchParams<Filter = string> {
  protected _page: number;
  protected _perPage: number = 10;
  protected _orderBy: string | null;
  protected _orderDirection: OrderDirection | null;
  protected _filter: Filter | null;

  constructor(props: SearchParamsConstructorProps<Filter> = {}) {
    this.page = props.page || 1;
    this.perPage = props.perPage || 10;
    this.orderBy = props.orderBy || null;
    this.orderDirection = props.orderDirection || null;
    this.filter = props.filter || null;
  }

  get page() {
    return this._page;
  }

  private set page(value: number) {
    let _page = +value;

    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1;
    }

    this._page = _page;
  }

  get perPage() {
    return this._perPage;
  }

  private set perPage(value: number) {
    let _perPage = value === (true as any) ? this._perPage : +value;

    if (
      Number.isNaN(_perPage) ||
      _perPage <= 0 ||
      parseInt(_perPage as any) !== _perPage
    ) {
      _perPage = this._perPage;
    }

    this._perPage = _perPage;
  }

  get orderBy(): string | null {
    return this._orderBy;
  }

  private set orderBy(value: string | null) {
    this._orderBy =
      value === null || value === undefined || value === "" ? null : `${value}`;
  }

  get orderDirection(): OrderDirection | null {
    return this._orderDirection;
  }

  private set orderDirection(value: OrderDirection | null) {
    if (!this.orderBy) {
      this._orderDirection = null;
      return;
    }
    const dir = `${value}`.toLowerCase();
    this._orderDirection = dir !== "asc" && dir !== "desc" ? "asc" : dir;
  }

  get filter(): Filter | null {
    return this._filter;
  }

  protected set filter(value: Filter | null) {
    this._filter =
      value === null || value === undefined || (value as unknown) === ""
        ? null
        : (`${value}` as any);
  }
}
