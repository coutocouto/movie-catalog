import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { CustomJwtService } from "../jwt.service";

describe("CustomJwtService", () => {
  let service: CustomJwtService;
  let jwtServiceMock: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
      decode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomJwtService,
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<CustomJwtService>(CustomJwtService);
    jwtServiceMock = module.get(JwtService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("sign", () => {
    it("should return a signed token", () => {
      const testPayload = { email: "123" };
      const expectedResult = "token";
      jwtServiceMock.sign.mockReturnValue(expectedResult);

      const result = service.sign(testPayload);
      expect(result).toBe(expectedResult);
      expect(jwtServiceMock.sign).toHaveBeenCalledWith(testPayload);
    });
  });

  describe("verify", () => {
    it("should verify a token", () => {
      const testToken = "token";
      const expectedDecoded = { userId: "123" };
      jwtServiceMock.verify.mockReturnValue(expectedDecoded);

      const result = service.verify(testToken);
      expect(result).toBe(expectedDecoded);
      expect(jwtServiceMock.verify).toHaveBeenCalledWith(testToken);
    });
  });

  describe("decode", () => {
    it("should decode a token", () => {
      const testToken = "token";
      const expectedDecoded = { userId: "123" };
      jwtServiceMock.decode.mockReturnValue(expectedDecoded);

      const result = service.decode(testToken);
      expect(result).toBe(expectedDecoded);
      expect(jwtServiceMock.decode).toHaveBeenCalledWith(testToken);
    });
  });
});
