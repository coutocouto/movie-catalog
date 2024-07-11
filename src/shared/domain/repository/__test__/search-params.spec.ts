import { SearchParams } from "../search-params";

describe("SearchParams", () => {
  let searchParams: SearchParams;

  beforeEach(() => {
    searchParams = new SearchParams();
  });

  it("should default page and perPage to 1 and 10", () => {
    expect(searchParams.page).toBe(1);
    expect(searchParams.perPage).toBe(10);
  });

  describe("page", () => {
    it("should set valid page numbers", () => {
      searchParams = new SearchParams({ page: 5 });
      expect(searchParams.page).toBe(5);
    });

    it("should default to 1 for invalid page numbers", () => {
      searchParams = new SearchParams({ page: -1 });
      expect(searchParams.page).toBe(1);
      searchParams = new SearchParams({ page: 0 });
      expect(searchParams.page).toBe(1);
      searchParams = new SearchParams({ page: NaN });
      expect(searchParams.page).toBe(1);
    });
  });

  describe("perPage", () => {
    it("should set valid perPage numbers", () => {
      searchParams = new SearchParams({ perPage: 20 });
      expect(searchParams.perPage).toBe(20);
    });

    it("should revert to default for invalid perPage numbers", () => {
      searchParams = new SearchParams({ perPage: -5 });
      expect(searchParams.perPage).toBe(10);
      searchParams = new SearchParams({ perPage: 0 });
      expect(searchParams.perPage).toBe(10);
    });
  });

  describe("orderBy", () => {
    it("should set valid orderBy", () => {
      searchParams = new SearchParams({ orderBy: "name" });
      expect(searchParams.orderBy).toBe("name");
    });

    it("should default to null for invalid orderBy", () => {
      searchParams = new SearchParams({ orderBy: "" });
      expect(searchParams.orderBy).toBeNull();
    });
  });

  describe("orderDirection", () => {
    it("should default to ASC for invalid directions", () => {
      searchParams = new SearchParams({
        orderBy: "name",
        orderDirection: "ASC",
      });
      expect(searchParams.orderDirection).toBe("ASC");
    });

    it("should nullify orderDirection when orderBy is null", () => {
      searchParams = new SearchParams({
        orderBy: null,
        orderDirection: "DESC",
      });
      expect(searchParams.orderDirection).toBeNull();
    });
  });

  describe("filter", () => {
    it("should accept and store valid filter", () => {
      searchParams = new SearchParams({ filter: "test" });
      expect(searchParams.filter).toBe("test");
    });

    it("should nullify filter for empty strings", () => {
      searchParams = new SearchParams({ filter: "" });
      expect(searchParams.filter).toBeNull();
    });
  });
});
