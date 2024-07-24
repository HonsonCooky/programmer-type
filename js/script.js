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

  #getCurrentSuite() {
    const curSuiteName = this.#suite.getSuiteName();
    return this.#suites.find((s) => s.name === curSuiteName);
  }

  /** Set the timer and content back to set values */
  #reset() {
    const seconds = this.#duration.getSeconds();
    this.#timer.prime(seconds);
    const suite = this.#getCurrentSuite();
    this.#testLoader.loadRandomTest(suite);
    this.#content.reset();
  }

  constructor() {
    // Send keyboard events to the content manager
    window.addEventListener("keydown", this.#content.keydown.bind(this.#content));

    // Setup nav bar update listeners
    this.#duration.addEventListener("update", this.#reset.bind(this));
    this.#suite.addEventListener("update", this.#reset.bind(this));

    // Setup main content update listeners
    this.#infoLoader.addEventListener("update", () => this.#content.setContent(this.#infoLoader.getInfoHTML()));
    this.#resLoader.addEventListener("update", () => this.#content.setContent(this.#resLoader.getResultsHTML()));
    this.#testLoader.addEventListener("update", () => this.#content.setContent(this.#testLoader.getTestHTML()));

    this.#content.addEventListener("start", () => this.#timer.run());
    this.#content.addEventListener("quit", () => this.#timer.stop());
    this.#content.addEventListener("reload", () => {
      const suite = this.#getCurrentSuite();
      this.#testLoader.loadRandomTest(suite);
    });

    // Timer dictates significant events
    this.#timer.addEventListener("tick", (ev) => this.#content.record(ev.detail));
    this.#timer.addEventListener("stopped", () => {
      const testResults = this.#content.getTestRecords();
      this.#reset();
      this.#resLoader.loadResults(testResults);
    });

    // Init all values
    this.#reset();
  }
}

new Theme(); // Self sufficient object.
export const PTProgram = new Program();
