import { Test, TestingModule } from "@nestjs/testing";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { CustomCacheService } from "../cache.service";

describe("CustomCacheService", () => {
  let service: CustomCacheService;
  let cacheManagerMock: {
    get: jest.Mock;
    set: jest.Mock;
    del: jest.Mock;
    reset: jest.Mock;
  };

  beforeEach(async () => {
    cacheManagerMock = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      reset: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomCacheService,
        { provide: CACHE_MANAGER, useValue: cacheManagerMock },
      ],
    }).compile();

    service = module.get<CustomCacheService>(CustomCacheService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("get", () => {
    it("should retrieve a value by key", async () => {
      const testKey = "testKey";
      const returnValue = "testValue";
      cacheManagerMock.get.mockResolvedValue(returnValue);

      expect(await service.get(testKey)).toBe(returnValue);
      expect(cacheManagerMock.get).toHaveBeenCalledWith(testKey);
    });
  });

  describe("set", () => {
    it("should set a value with a key and ttl", async () => {
      const testKey = "testKey";
      const testValue = "testValue";
      const ttl = 300;

      await service.set(testKey, testValue, ttl);

      expect(cacheManagerMock.set).toHaveBeenCalledWith(
        testKey,
        testValue,
        ttl,
      );
    });
  });

  describe("del", () => {
    it("should delete a value by key", async () => {
      const testKey = "testKey";

      await service.del(testKey);

      expect(cacheManagerMock.del).toHaveBeenCalledWith(testKey);
    });
  });

  describe("reset", () => {
    it("should reset the cache", async () => {
      await service.reset();

      expect(cacheManagerMock.reset).toHaveBeenCalled();
    });
  });
});
