import { BcryptService } from "../bcrypt.service";
import * as bcrypt from "bcrypt";
import { Test } from "@nestjs/testing";

jest.mock("bcrypt");

describe("BcryptService", () => {
  let bcryptService: BcryptService;
  let bcryptHashSpy: jest.SpyInstance;
  let bcryptCompareSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    bcryptService = module.get<BcryptService>(BcryptService);
    bcryptHashSpy = jest.spyOn(bcrypt, "hash");
    bcryptCompareSpy = jest.spyOn(bcrypt, "compare");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(bcryptService).toBeDefined();
  });

  describe("encodePassword", () => {
    it("should return a hashed string", async () => {
      const testPassword = "testPassword";
      const hashedPassword = "hashedPassword";
      bcryptHashSpy.mockResolvedValue(hashedPassword);

      const result = await bcryptService.encodePassword(testPassword);
      expect(result).toBe(hashedPassword);
      expect(bcryptHashSpy).toHaveBeenCalledWith(
        testPassword,
        bcryptService.rounds,
      );
    });
  });

  describe("comparePassword", () => {
    it("should return true if passwords match", async () => {
      const password = "testPassword";
      const hash = "hashedPassword";
      bcryptCompareSpy.mockResolvedValue(true);

      const result = await bcryptService.comparePassword(password, hash);
      expect(result).toBe(true);
      expect(bcryptCompareSpy).toHaveBeenCalledWith(password, hash);
    });

    it("should return false if passwords do not match", async () => {
      const password = "testPassword";
      const hash = "wrongHashedPassword";
      bcryptCompareSpy.mockResolvedValue(false);

      const result = await bcryptService.comparePassword(password, hash);
      expect(result).toBe(false);
      expect(bcryptCompareSpy).toHaveBeenCalledWith(password, hash);
    });
  });
});
