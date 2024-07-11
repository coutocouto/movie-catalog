import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModel } from "../user.model";
import { UserTypeOrmRepository } from "../user-typeorm.repository";
import { UserFakeBuilder } from "../../../../../domain/user/user-fake.builder";
import { SearchParams } from "../../../../../shared/domain/repository/search-params";

describe("user typeorm repository int test", () => {
  let userRepository: UserTypeOrmRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...require("../../../../config/typeorm/typeorm.config.test"),
          entities: [UserModel],
        }),
        TypeOrmModule.forFeature([UserModel]),
      ],
      providers: [UserTypeOrmRepository],
    }).compile();

    userRepository = module.get<UserTypeOrmRepository>(UserTypeOrmRepository);
  });

  afterEach(async () => {
    await userRepository.clear();
  });

  afterAll(async () => {
    await module.close();
  });

  it("should be defined", () => {
    expect(userRepository).toBeDefined();
  });

  describe("CRUD operations", () => {
    it("should create and retrieve a user", async () => {
      const user = UserFakeBuilder.aUser().withName("John Doe").build();
      const createdUser = await userRepository.create(user);
      expect(createdUser).toBeDefined();
      expect(createdUser.name).toEqual("John Doe");

      const foundUser = await userRepository.findById(createdUser.userId);
      expect(foundUser).toBeDefined();
      expect(foundUser.name).toEqual("John Doe");
    });

    it("should update a user", async () => {
      const user = UserFakeBuilder.aUser().withName("John Doe").build();
      const createdUser = await userRepository.create(user);
      expect(createdUser).toBeDefined();
      expect(createdUser.name).toEqual("John Doe");

      createdUser.changeName("Jane Doe");
      const updatedUser = await userRepository.update(createdUser);
      expect(updatedUser).toBeDefined();
      expect(updatedUser.name).toEqual("Jane Doe");

      const foundUser = await userRepository.findById(createdUser.userId);
      expect(foundUser).toBeDefined();
      expect(foundUser.name).toEqual("Jane Doe");
    });

    it("should delete a user", async () => {
      const user = UserFakeBuilder.aUser().withName("John Doe").build();
      const createdUser = await userRepository.create(user);
      await userRepository.delete(createdUser.userId);
      const foundUser = await userRepository.findById(createdUser.userId);
      expect(foundUser).toBeNull();
    });

    it("should find a user by id", async () => {
      const user = UserFakeBuilder.aUser().build();
      await userRepository.create(user);
      const foundUser = await userRepository.findById(user.userId);
      expect(foundUser).toBeDefined();
      expect(foundUser.userId).toEqual(user.userId);
    });

    it("should find all users", async () => {
      const user1 = UserFakeBuilder.aUser().build();
      const user2 = UserFakeBuilder.aUser().build();
      await userRepository.create(user1);
      await userRepository.create(user2);
      const users = await userRepository.findAll();
      expect(users.length).toBe(2);
    });
  });

  describe("Search operations", () => {
    it("should search a user whit no filter", async () => {
      const user1 = UserFakeBuilder.aUser().withName("John Doe").build();
      const user2 = UserFakeBuilder.aUser().withName("Jane Doe").build();
      await userRepository.create(user1);
      await userRepository.create(user2);

      const searchParam = new SearchParams({
        page: 1,
        perPage: 10,
      });
      const searchResult = await userRepository.search(searchParam);
      expect(searchResult.total).toBe(2);
    });

    it("should search a user by name", async () => {
      const user1 = UserFakeBuilder.aUser().withName("John Doe").build();
      const user2 = UserFakeBuilder.aUser().withName("Jane Doe").build();
      await userRepository.create(user1);
      await userRepository.create(user2);

      const searchParam = new SearchParams({
        filter: "John",
        page: 1,
        perPage: 10,
      });
      const searchResult = await userRepository.search(searchParam);
      expect(searchResult.total).toBe(1);
      expect(searchResult.items[0].name).toEqual("John Doe");
    });

    it("should search a user by email", async () => {
      const user1 = UserFakeBuilder.aUser().withEmail("john@doe.com").build();
      const user2 = UserFakeBuilder.aUser().withEmail("jane@doe.com").build();
      await userRepository.create(user1);
      await userRepository.create(user2);

      const searchParam = new SearchParams({
        filter: "john",
        page: 1,
        perPage: 10,
      });

      const searchResult = await userRepository.search(searchParam);
      expect(searchResult.total).toBe(1);
      expect(searchResult.items[0].email).toEqual("john@doe.com");
    });

    it("should search a ordered user by name", async () => {
      const user1 = UserFakeBuilder.aUser().withName("John Doe").build();
      const user2 = UserFakeBuilder.aUser().withName("Jane Doe").build();
      await userRepository.create(user1);
      await userRepository.create(user2);

      const searchParam = new SearchParams({
        orderBy: "name",
        orderDirection: "ASC",
        page: 1,
        perPage: 10,
      });

      const searchResult = await userRepository.search(searchParam);
      expect(searchResult.total).toBe(2);
      expect(searchResult.items[0].name).toEqual("Jane Doe");
      expect(searchResult.items[1].name).toEqual("John Doe");
    });

    it("should search a users whit pagination", async () => {
      const user1 = UserFakeBuilder.aUser().build();
      const user2 = UserFakeBuilder.aUser().build();
      const user3 = UserFakeBuilder.aUser().build();
      await userRepository.create(user1);
      await userRepository.create(user2);
      await userRepository.create(user3);

      const searchParam = new SearchParams({
        page: 1,
        perPage: 2,
      });

      const searchResult = await userRepository.search(searchParam);
      expect(searchResult.total).toBe(3);
      expect(searchResult.items.length).toBe(2);
      expect(searchResult.currentPage).toBe(1);
    });
  });
});
