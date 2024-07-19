import { FileLoader } from "../managers/FileLoader.js";
import { Timer } from "../managers/Timer.js";

/** @typedef {{ name: string; type: "Code"|"Action"; tests: string[]; }} SuiteItem */
/** @typedef {SuiteItem[]} SuiteList */

export class SharedState {
  // Elements
  #contentDisplayPane = document.getElementById("_enter_content");
  #contextDisplayText = document.getElementById("content-context");

  // HTML values
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

  /** Get a reference to the Content Pane. */
  getContentPane() {
    return this.#contentDisplayPane;
  }

  /**
   * Set the contents inside the main element.
   *
   * @param {string|Element} element
   * @param {string} context
   */
  setContentPane(element, context) {
    if (typeof element === "string") {
      this.#contentDisplayPane.innerHTML = element;
    } else {
      this.#contentDisplayPane.innerHTML = "";
      this.#contentDisplayPane.appendChild(element);
    }
  }

  /**
   * Determine if the content on screen is designed for a test, or is it
   * showing a loading screen, results page or info page.
   */
  #isTestReady() {
    return !!this.#contentDisplayPane.querySelector(".line");
  }
}
