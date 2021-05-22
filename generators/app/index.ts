/* eslint-disable import/no-default-export */
/* eslint-disable unicorn/prefer-module */
import path from "path";
import Generator from "yeoman-generator";

/* eslint-disable @typescript-eslint/no-var-requires  */
const fullnamePromise = require("fullname")();
const username = require("git-user-name")();
const email = require("git-user-email")();
/* eslint-enable @typescript-eslint/no-var-requires */

interface Answers {
  description?: string;
  email?: string;
  fullname?: string;
  license?: string;
  name?: string;
  releaseit?: boolean;
  username?: string;
}

export default class TypescriptGenerator extends Generator {
  private answers: Answers = {};

  async prompting(): Promise<void> {
    const fullname = await fullnamePromise;
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname,
      },
      {
        type: "input",
        name: "description",
        message: "Your project description",
      },
      {
        type: "input",
        name: "username",
        message: "Your git user name",
        default: username,
      },
      {
        type: "input",
        name: "email",
        message: "Your email",
        default: email,
      },
      {
        type: "input",
        name: "fullname",
        message: "Your full name",
        default: fullname,
      },
      {
        type: "confirm",
        name: "releaseit",
        message: "Would you like to include package release scripts via CircleCI?",
      }
    ]);

    this.answers = answers;

    this.composeWith(require.resolve("generator-license"), {
      name: answers.fullname,
      email: answers.email,
    });
  }

  writing(): void {
    this.fs.copyTpl(
      this.templatePath("_README.md"),
      this.destinationPath("README.md"),
      {
        name: this.answers.name,
      }
    );

    this.fs.copyTpl(
      this.templatePath("_package.json"),
      this.destinationPath("package.json"),
      {
        appname: this.destinationPath().split(path.sep).pop(),
        description: this.answers.description,
        fullname: this.answers.fullname,
        username: this.answers.username,
        license: this.answers.license,
      }
    );

    this.fs.copy(this.templatePath("src"), this.destinationPath("src"));

    this.fs.copy(
      this.templatePath("index.ts"),
      this.destinationPath("index.ts")
    );

    this.fs.copy(
      this.templatePath("tsconfig.json"),
      this.destinationPath("tsconfig.json")
    );

    this.fs.copy(
      this.templatePath("tsconfig.eslint.json"),
      this.destinationPath("tsconfig.eslint.json")
    );

    this.fs.copy(
      this.templatePath(".editorconfig"),
      this.destinationPath(".editorconfig")
    );

    this.fs.copy(
      this.templatePath(".eslintrc.js"),
      this.destinationPath(".eslintrc.js")
    );

    this.fs.copy(
      this.templatePath(".eslintignore"),
      this.destinationPath(".eslintignore")
    );

    this.fs.copy(
      this.templatePath("_gitignore"),
      this.destinationPath(".gitignore")
    );

    if (this.answers.releaseit) {
      this.fs.copyTpl(
        this.templatePath(".circleci/_config.yml"),
        this.destinationPath(".circleci/config.yml"),
        {
          fullname: this.answers.fullname,
          email: this.answers.email,
        }
      );

      this.fs.copy(
        this.templatePath(".release-it.json"),
        this.destinationPath(".release-it.json")
      );

      console.log("CircleCI Notes...");
      console.log("Please make sure to set an NPM_TOKEN environment variable and provide a user checkout key to enable version bumps committed to the repo");
      console.log("See Also https://docs.npmjs.com/using-private-packages-in-a-ci-cd-workflow#create-a-new-authentication-token");
      console.log("See Also https://circleci.com/docs/2.0/gh-bb-integration/#enable-your-project-to-check-out-additional-private-repositories");
    }
  }
};
