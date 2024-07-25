import { InfoLoader } from "./loaders/InfoLoader.js";
import { ResultsLoader } from "./loaders/ResultsLoader.js";
import { TestLoader } from "./loaders/TestLoader.js";
import { Content } from "./managers/Content.js";
import { Duration } from "./managers/Duration.js";
import { Suite } from "./managers/Suite.js";
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

  #loadTimer() {
    const seconds = this.#duration.getSeconds();
    this.#timer.prime(seconds);
  }

  #loadRandomTest() {
    const suiteName = this.#suite.getSuiteName();
    const suite = this.#suites.find((s) => s.name === suiteName);
    this.#testLoader.load(suite);
  }

  #setup() {
    this.#loadTimer();
    this.#loadRandomTest();
    this.#content.reset();
  }

  #reset() {
    const testResults = this.#content.getTestRecords();
    if (testResults.length > 0) this.#resLoader.load(testResults);
    this.#setup();
  }

  constructor() {
    // Navbar Update - Run setup to stop everything and load a new test.
    this.#duration.addEventListener("update", this.#setup.bind(this));
    this.#suite.addEventListener("update", this.#setup.bind(this));

    // Content Loader Updates - Set the main content on update.
    this.#infoLoader.addEventListener("update", () => {
      this.#timer.stop({ silent: true });
      this.#content.setContent(this.#infoLoader.getHTML());
    });
    this.#resLoader.addEventListener("update", () => this.#content.setContent(this.#resLoader.getHTML()));
    this.#testLoader.addEventListener("update", () => this.#content.setContent(this.#testLoader.getHTML()));

    // Content Manager Updates - Start, Stop and Pause the timer, and load another random test.
    this.#content.addEventListener("run", () => this.#timer.run());
    this.#content.addEventListener("pause", () => this.#timer.pause());
    this.#content.addEventListener("quit", () => this.#timer.stop());
    this.#content.addEventListener("reload", this.#loadRandomTest.bind(this));

    // Timer Events - Dictate major events. Timer stop indicates the end of a test (regardless of how).
    this.#timer.addEventListener("tick", (ev) => this.#content.record(ev.detail));
    this.#timer.addEventListener("stopped", (ev) => {
      if (ev.detail?.silent) this.#setup();
      else this.#reset();
    });

    // Send keyboard events to the content manager
    window.addEventListener("keydown", this.#content.keydown.bind(this.#content));

    // Init all values
    this.#setup();
  }
}

new Theme(); // Self sufficient object.
export const PTProgram = new Program();
