import { SearchResult } from "../search-result";
import { BaseEntity } from "../../base.entity";

class MockEntity extends BaseEntity {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    super();
    this.id = id;
    this.name = name;
  }

  toJSON() {
    return { id: this.id, name: this.name };
  }
  get entityId(): string {
    return this.id.toString();
  }
}

describe("SearchResult", () => {
  it("should correctly initialize with constructor parameters", () => {
    const items = [new MockEntity(1, "Item 1"), new MockEntity(2, "Item 2")];
    const searchResult = new SearchResult<MockEntity>({
      items: items,
      total: 5,
      currentPage: 1,
      perPage: 2,
    });

    expect(searchResult.items.length).toBe(2);
    expect(searchResult.total).toBe(5);
    expect(searchResult.currentPage).toBe(1);
    expect(searchResult.perPage).toBe(2);
    expect(searchResult.lastPage).toBe(3); // Math.ceil(5 / 2)
  });

  it("should return a JSON object with default parameters", () => {
    const items = [new MockEntity(1, "Item 1"), new MockEntity(2, "Item 2")];
    const searchResult = new SearchResult<MockEntity>({
      items: items,
      total: 5,
      currentPage: 1,
      perPage: 2,
    });

    const json = searchResult.toJSON();
    expect(json.items).toEqual(items);
    expect(json.total).toBe(5);
    expect(json.currentPage).toBe(1);
    expect(json.perPage).toBe(2);
    expect(json.lastPage).toBe(3);
  });

  it("should return a JSON object with entities converted to JSON when forced", () => {
    const items = [new MockEntity(1, "Item 1"), new MockEntity(2, "Item 2")];
    const searchResult = new SearchResult<MockEntity>({
      items: items,
      total: 5,
      currentPage: 1,
      perPage: 2,
    });

    const json = searchResult.toJSON(true);
    expect(json.items).toEqual([
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
    ]);
    expect(json.total).toBe(5);
    expect(json.currentPage).toBe(1);
    expect(json.perPage).toBe(2);
    expect(json.lastPage).toBe(3);
  });
});
