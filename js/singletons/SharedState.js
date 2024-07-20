import { FileLoader } from "../managers/FileLoader.js";
import { Timer } from "../managers/Timer.js";

/** @typedef {{ name: string; type: "Code"|"Action"; tests: string[]; }} SuiteItem */
/** @typedef {SuiteItem[]} SuiteList */

export class SharedState {
  // Elements
  #contentDisplayPane = document.getElementById("_enter_content");
  #contextDisplayText = document.getElementById("content-context");
  #fontSize = 1;

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

  constructor() {
    this.#contentDisplayPane.addEventListener("click", () => {
      this.#contentDisplayPane.tabIndex = -1;
      this.#contentDisplayPane.focus();
    });
    this.contentFontIncrease();

    this.#timer.addEventListener("stopped", () => {});
  }

  /**
   * Set the duration of the next test.
   * @param {number} duration
   */
  setDuration(duration) {
    this.#timer.prime(duration);
  }

  /** Attempt to run the timer. */
  runTimer() {
    if (!this.#timer.running()) this.#timer.run();
  }

  /** Attempt to pause the timer. */
  pauseTimer() {
    if (this.#timer.running()) this.#timer.pause();
  }

  /** Attempt to stop the timer. */
  stopTimer() {
    if (this.#timer.running()) this.#timer.stop();
  }

  /** Get the currently selected suite. */
  getSuite() {
    return Object.freeze(this.#currentSuite);
  }

  /**
   * Set the suite based on it's name.
   * @param {string} suiteName
   */
  setSuite(suiteName) {
    this.#currentSuite = this.#suites.find((s) => s.name === suiteName);
    this.#timer.reset();
    this.loadNextTest();
  }

  /**
   * Ready the content for a random test from the currently selected suite.
   * Random tests attempt to not be the currently selected test.
   */
  loadNextTest() {
    if (!this.#currentSuite) {
      console.error("No suite loaded");
      return;
    }

    return this.#fileLoader.loadRandomTest();
  }

  /** Get a reference to the shared content pane. */
  getContentPane() {
    return Object.freeze(this.#contentDisplayPane);
  }

  /**
   * Set the contents inside the main element.
   * Optionally, parse in the context to run `setContextText`
   *
   * @param {string|Element} element
   * @param {string|undefined} context
   */
  setContentPane(element, context) {
    if (!element) return;

    if (typeof element === "string") {
      this.#contentDisplayPane.innerHTML = element;
    } else {
      this.#contentDisplayPane.innerHTML = "";
      this.#contentDisplayPane.appendChild(element);
    }

    if (context) {
      this.setContextText(context);
    }
  }

  /**
   * Determine if the main content is loaded with a test.
   *
   * @returns {boolean}
   */
  isContentTestReady() {
    return !!this.#contentDisplayPane.querySelector(".test");
  }

  /** Increase the contnet fontsize by one */
  contentFontIncrease() {
    this.#fontSize = Math.max(-2, Math.min(this.#fontSize + 1, 5));
    this.#contentDisplayPane.style.fontSize = `var(--fs-${this.#fontSize})`;
  }

  /** Increase the contnet fontsize by one */
  contentFontDecrease() {
    this.#fontSize = Math.max(-2, Math.min(this.#fontSize - 1, 5));
    this.#contentDisplayPane.style.fontSize = `var(--fs-${this.#fontSize})`;
  }

  /**
   * Set the helper text below the main element.
   *
   * @param {string} context
   */
  setContextText(context) {
    this.#contextDisplayText.innerText = context;
  }
}
