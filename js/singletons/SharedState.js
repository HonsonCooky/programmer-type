import { FileLoader } from "../managers/FileLoader.js";
import { Timer } from "../managers/Timer.js";

/** @typedef {{ name: string; type: "Code"|"Action"; tests: string[]; }} SuiteItem */
/** @typedef {SuiteItem[]} SuiteList */

export class SharedState {
  #fileLoader = new FileLoader();
  #timer = new Timer();

  /** @type {SuiteItem|undefined} */
  #currentSuite;
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

  /**
   * Set the duration of the next test.
   * @param {number} duration
   */
  setDuration(duration) {
    this.#timer.prime(duration);
  }

  /**
   * Get the currently selected suite.
   * @returns {SuiteItem|undefined}
   */
  getSuite() {
    return this.#currentSuite;
  }

  /**
   * Set the suite based on it's name.
   * @param {string} suiteName
   */
  setSuite(suiteName) {
    this.#currentSuite = this.#suites.find((s) => s.name === suiteName);
    this.loadNextTest();
  }

  /**
   * Ready the program for a random test from the currently selected suite.
   * Random tests attempt to not be the currently selected test.
   */
  loadNextTest() {
    if (!this.#currentSuite) {
      console.error("No suite loaded");
      return;
    }

    this.#fileLoader.loadRandomTest(this.#currentSuite);
  }

  /**
   * Determine if the content on screen is designed for a test, or is it
   * showing a loading screen, results page or info page.
   *
   * @returns {boolean}
   */
  isTestReady() {
    return !!document.getElementById("content")?.querySelector(".line");
  }
}
