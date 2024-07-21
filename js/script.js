import { Content } from "./managers/Content.js";
import { Duration } from "./managers/Duration.js";
import { InfoLoader } from "./managers/InfoLoader.js";
import { Suite } from "./managers/Suite.js";
import { Theme } from "./managers/Theme.js";

export class Program {
  // Element Managers
  #content = new Content();
  #duration = new Duration();
  #suite = new Suite();
  #infoLoader = new InfoLoader();

  /**@type {SuiteList} */
  #suites = [
    {
      name: "CSharp",
      type: "Code",
      tests: ["example1.cs", "example2.cs"],
    },
    {
      name: "FSharp",
      type: "Code",
      tests: ["example1.fs", "example2.fs"],
    },
    {
      name: "Vim",
      type: "Action",
      tests: ["example1.json"],
    },
    {
      name: "TypeScript",
      type: "Code",
      tests: ["example1.ts", "example2.ts"],
    },
  ];

  constructor() {
    window.addEventListener("keydown", this.#content.keydown.bind(this.#content));

    this.#infoLoader.addEventListener("update", () => this.#content.setContent(this.#infoLoader.getInfoHtml()));
  }
}

new Theme();
export const PTProgram = new Program();
