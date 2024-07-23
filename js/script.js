import { Content } from "./managers/Content.js";
import { Duration } from "./managers/Duration.js";
import { InfoLoader } from "./managers/InfoLoader.js";
import { ResultsLoader } from "./managers/ResultsLoader.js";
import { Suite } from "./managers/Suite.js";
import { TestLoader } from "./managers/TestLoader.js";
import { Theme } from "./managers/Theme.js";
import { Timer } from "./managers/Timer.js";

/** @typedef {{name: string; type:"Code"|"Action"; tests: string[]}} SuiteItem */

export class Program {
  // Element Managers
  #content = new Content();
  #duration = new Duration();
  #suite = new Suite();
  #timer = new Timer();
  #infoLoader = new InfoLoader();
  #resLoader = new ResultsLoader();
  #testLoader = new TestLoader();

  /**@type {SuiteItem[]} */
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
    // Timer updates dictate moments of the test.
    this.#timer.addEventListener("tick", () => {
      // A second has passed
      this.#content.record(this.#timer.getTime());
    });
    this.#timer.addEventListener("stopped", () => {
      // A test has ended
      this.#timer.reset();
      this.#content.reset();
    });

    // On duration update, set timer to replicate
    this.#duration.addEventListener("update", () => this.#timer.prime(this.#duration.getSeconds()));
    // On suite update, set test to replicate
    this.#suite.addEventListener("update", () => {
      this.#timer.prime(this.#duration.getSeconds());
      const suiteName = this.#suite.getSuiteName();
      const suite = this.#suites.filter((suite) => suite.name === suiteName);
      this.#testLoader.loadRandomTest(suite[0]);
    });

    // On update loader update, render it's update to the main content pane on the screen
    this.#infoLoader.addEventListener("update", () => this.#content.setContent(this.#infoLoader.getInfoHTML()));
    this.#resLoader.addEventListener("update", () => this.#content.setContent(this.#resLoader.getResultsHTML()));
    this.#testLoader.addEventListener("update", () => this.#content.setContent(this.#testLoader.getTestHTML()));

    // Send keyboard events to the content manager
    window.addEventListener("keydown", this.#content.keydown.bind(this.#content));

    // Start
  }
}

new Theme(); // Self sufficient object.
export const PTProgram = new Program();
