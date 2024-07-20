import { PTShared } from "../script.js";
import { IElementManager } from "./IElementManager.js";

/** @typedef {"copy"|"paste"} ATAction */
/** @typedef {{keybind?: string; comments: string[]; action?: ATAction; content?: string[]}} ATLine */
/** @typedef {ATLine[]} ATFile */

export class FileLoader extends IElementManager {
  #testSuitePath = "../../assets/test-suites";

  // Elements
  #typeDisplayValue = document.getElementById("suite-value");

  /** @type {string|undefined} */
  #testURL;
  /** @type {string|undefined} */
  #fileContents;

  #shoudCache = () => document.getElementById("cache-btn")?.checked ?? false;

  /** Render a loading screen to indicate we are attempting to load the test. */
  #renderLoading() {
    const loadingContent = `<div class="screen">Loading Test...</div>`;
    PTShared.setContentPane(loadingContent, "");
  }

  /**
   * Given a suite is selected, get a random test from the suite and return a
   * URL to that file.
   *
   * @param {Readonly<SuiteItem|undefined>} suite
   * @returns {string}
   */
  #getRandomTestURL(suite) {
    if (!suite) {
      console.error("No suite loaded");
      return;
    }

    const prevURL = this.#testURL;
    let newURL = prevURL;

    // Try get a new random test, retry 5 times max.
    for (let i = 0; i < 5; i++) {
      const randIndex = Math.floor(Math.random() * suite.tests.length);
      const randTest = suite.tests[randIndex];
      newURL = `${this.#testSuitePath}/${suite.name}/${randTest}`;
      if (suite.tests.length < 2 || newURL != prevURL) break;
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
    const codeDiv = `<div class="test code">${lineStrs.join("")}</div>`;

    // Overwrite the existing content.
    PTShared.setContentPane(codeDiv, "[Enter] Start");
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
    const actionDiv = `<div class="test action">${stepBlocks.join("")}</div>`;

    // Overwrite the existing content.
    PTShared.setContentPane(actionDiv, "[Enter] Start");
  }

  /** Load a test from the current suite */
  async loadRandomTest() {
    const suite = PTShared.getSuite();
    this.#renderLoading();
    this.#testURL = this.#getRandomTestURL(suite);
    this.#fileContents = await this.#getFileContents();
    if (!this.#fileContents) return this.render();
    this.render();
  }

  /**@override*/
  render() {
    if (!this.#fileContents) {
      const failedContent = `<div class="screen"><span class="fail">Failed to load test</span></div>`;
      PTShared.setContentPane(failedContent, "");
      return this.dispatchEvent("failed");
    }

    const suite = PTShared.getSuite();
    this.#typeDisplayValue.innerText = suite.type;
    if (suite.type === "Code") this.#loadCodeTest();
    else this.#loadActionTest();
    this.dispatchEvent("update");
  }
}
