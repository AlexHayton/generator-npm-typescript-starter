/* eslint-disable jest/expect-expect */
/* eslint-disable unicorn/prefer-module */
import path from "path";
import assert from "yeoman-assert";
import helpers from "yeoman-test";

const name = "test-project";
const email = "alex@test.com";
const description = "description of test project";
const username = "alanturing";
const fullname = "Alan Turing";
const license = "MIT";

const baseFiles = [
  "LICENSE",
  "package.json",
  "README.md",
  ".gitignore",
  "index.ts",
  "tsconfig.json",
  "tsconfig.eslint.json",
  ".eslintrc.js",
  ".eslintignore",
  "src/index.ts",
  "src/index.spec.ts",
];

describe("generator-typescript-library-starter:app", () => {
  describe("Without release helpers", () => {
    beforeAll(() =>
      helpers
        .run(path.join(__dirname, "../app"))
        .withPrompts({ name, description, username, email, fullname, license })
    );

    it("creates files but not circleci ones", () => {
      assert.file(baseFiles);
    });

    it("replaces prompt values", () => {
      assert.fileContent("LICENSE", fullname);
      assert.fileContent("LICENSE", new Date().getFullYear().toString());
      assert.fileContent("package.json", fullname);
      assert.fileContent("package.json", username);
      assert.fileContent("package.json", description);
      assert.fileContent("README.md", name);
    });
  });

  describe("with release helpers", () => {
    beforeAll(() =>
      helpers.run(path.join(__dirname, "../app")).withPrompts({
        name,
        description,
        username,
        email,
        fullname,
        license,
        releaseit: true,
      })
    );

    it("creates files and include circleci ones", () => {
      assert.file([...baseFiles, ".circleci/config.yml", ".release-it.json"]);
    });

    it("replaces prompt values", () => {
      assert.fileContent("LICENSE", fullname);
      assert.fileContent("LICENSE", new Date().getFullYear().toString());
      assert.fileContent("package.json", fullname);
      assert.fileContent("package.json", username);
      assert.fileContent("package.json", description);
      assert.fileContent("README.md", name);
      assert.fileContent(".circleci/config.yml", fullname);
      assert.fileContent(".circleci/config.yml", email);
    });
  });
});
