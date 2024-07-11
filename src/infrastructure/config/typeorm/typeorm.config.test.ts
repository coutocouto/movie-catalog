module.exports = {
  type: "sqlite",
  database: ":memory:",
  entities: [__dirname + "/**/*.model{.ts,.js}"],
  synchronize: true,
  logging: false,
};
