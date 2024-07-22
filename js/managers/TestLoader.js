import { IElementManager } from "./IElementManager.js";

/** @typedef {"copy"|"paste"} ATAction */
/** @typedef {{keybind?: string; comments: string[]; action?: ATAction; content?: string[]}} ATLine */
/** @typedef {ATLine[]} ATFile */

export class TestLoader extends IElementManager {
  #testSuitePath = "../../assets/test-suites";

  // Elements
  #displayValue = document.getElementById("suite-value");

  /**@type {import("../script.js").SuiteItem|undefined}*/
  #currentSuite;
  /** @type {string|undefined} */
  #testURL;
  /** @type {string|undefined} */
  #fileContents;
  /**@type {string|undefined}*/
  #testHTML;

  #shoudCache = () => document.getElementById("cache-btn")?.checked ?? false;

  /** Render a loading screen to indicate we are attempting to load the test. */
  #renderLoading() {
    this.#testHTML = `<div class="screen">Loading Test...</div>`;
    this.dispatchEvent("update");
  }

  /**
   * Given a suite is selected, get a random test from the suite and return a
   * URL to that file.
   *
   * @returns {string}
   */
  #getRandomTestURL() {
    if (!this.#currentSuite) {
      console.error("No suite loaded");
      return;
    }

    const prevURL = this.#testURL;
    let newURL = prevURL;

    // Try get a new random test, retry 5 times max.
    for (let i = 0; i < 5; i++) {
      const randIndex = Math.floor(Math.random() * this.#currentSuite.tests.length);
      const randTest = this.#currentSuite.tests[randIndex];
      newURL = `${this.#testSuitePath}/${this.#currentSuite.name}/${randTest}`;
      if (this.#currentSuite.tests.length < 2 || newURL != prevURL) break;
    }

    return newURL;
  }

  /**
   * Given a test URL is selected, attempt to get the contents of that file.
   * First, by local storage, and then by remote fetch. If allowed to cache,
   * then the remote content is stored under it's URL.
   *
   * @returns {Promise<string|null>}
   */
  async #getFileContents() {
    const local = localStorage.getItem(this.#testURL);
    if (local) return local;

    const remote = await fetch(this.#testURL).then((res) => res.text());
    if (!remote) return null;
    if (this.#shoudCache()) localStorage.setItem(this.#testURL, remote);
    return remote;
  }

  /**
   * Assuming the text file is for a coding test, then load each character into
   * lines, where each character is assumed to be an input.
   */
  #loadCodeTest() {
    // Get the lines.
    const lines = this.#fileContents.split(/\r?\n/g);

    // Get characters and indentation level.
    const linesMapped = lines.map((line) => {
      const indent = (line.match(/^(\s+)/) || [""])[0].length;
      const chars = line.trim().split("");
      return { indent, chars };
    });

    // Map each line to a DIV of SPANs, each span being a character.
    const lineStrs = linesMapped.map(({ indent, chars }) => {
      const cStrs = chars.map((c) => `<span>${c}</span>`);
      const nlStr = `<span class="newline">\\n</span>`;
      const divAttr = `class="line" style="margin-left:calc(var(--fs--2) * ${indent})"`;

      // Little complicated, but we are just creating the DIV of SPANs with
      // some styling for indentation. We also append a newline character.
      return `<div ${divAttr}>${cStrs.join("")}${nlStr}</div>`;
    });

    // Wrap it all in a div with a class to help identify the type of test.
    this.#testHTML = `<div class="test code">${lineStrs.join("")}</div>`;
  }

  /**
   * Assuming the text file is for an action test, then we are provided with
   * JSON instructions for the test. Interpret these instructions and generate
   * inputs for these.
   */
  #loadActionTest() {
    /**@type {ATFile}*/
    const instructions = JSON.parse(this.#fileContents);
    const stepBlocks = instructions.map((i) => {
      const { action, comments, content, keybind } = i;

      const nlLine = `<div class="line newline"></div>`;
      const commentStrs = comments.map((c) => {
        if (c.includes("Title:")) return `<div class="line title">${c}</div>`;
        return `<div class="line comment">// ${c}</div>`;
      });
      let inputDiv = "";

      // If the user requires come action.
      if (action && content && keybind) {
        const inputStrs = keybind.split("").map((k) => `<span>${k}</span>`);
        const inputDivAttrs = `class="line" action="${action}" content="${content.join("\\n")}"`;
        inputDiv = `<div ${inputDivAttrs}>${inputStrs.join("")}</div>`;
      }

      return `${commentStrs.join("")}${inputDiv}${nlLine}`;
    });

    // Wrap it all in a div with a class to help identify the type of test.
    this.#testHTML = `<div class="test action">${stepBlocks.join("")}</div>`;
  }

  /**
   * Load a test from the given suite.
   * @param {import("../script.js").SuiteItem} suite
   */
  async loadRandomTest(suite) {
    this.#renderLoading();
    this.#currentSuite = suite;
    this.#testURL = this.#getRandomTestURL();
    this.#fileContents = await this.#getFileContents();
    if (!this.#fileContents) return this.render();
    this.render();
  }

  getTestHTML() {
    return this.#testHTML;
  }

  /**@override*/
  render() {
    if (!this.#fileContents) {
      this.#testHTML = `<div class="screen"><span class="fail">Failed to load test</span></div>`;
      return this.dispatchEvent("failed");
    }

    this.#displayValue.innerText = this.#currentSuite.type;
    if (this.#currentSuite.type === "Code") this.#loadCodeTest();
    else this.#loadActionTest();
    this.dispatchEvent(new Event("update"));
  }
}
