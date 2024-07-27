import { SuiteDataBase } from "../../db/suites.js";

export class Content extends EventTarget {
  // Elements
  #contentDisplayPane = document.getElementById("_enter_content");
  #infoDisplayBtn = document.getElementById("_i_info");

  // Cached Templates
  #infoTemplate;
  #resultsTemplate;

  // Last known values
  /**@type {{name: string; type: string; seenTests:string[]}|null}*/
  #knownSuite;
  #lastTestTemplate = "";

  constructor() {
    super();

    // Setup Click actions
    this.#contentDisplayPane.addEventListener("click", () => {
      this.#contentDisplayPane.tabIndex = -1;
      this.#contentDisplayPane.focus();
    });

    this.#infoDisplayBtn.addEventListener("click", () => this.#displayInfoMessage());
  }

  /** Display Loading Screen */
  #loading() {
    this.#contentDisplayPane.innerHTML = `<div class="screen">Loading...</div>`;
  }

  /** Display Information Screen */
  #displayInfoMessage() {
    this.dispatchEvent(new CustomEvent("interrupt"));
    const isInfoShowing = this.#contentDisplayPane.querySelector("#info-message");
    console.log("here2");

    if (isInfoShowing) {
      this.#contentDisplayPane.innerHTML = this.#lastTestTemplate;
      return;
    }

    this.#lastTestTemplate = this.#contentDisplayPane.innerHTML;
    this.#loading();
    if (!this.#infoTemplate) {
      fetch("../../templates/info-message.html")
        .then((res) => res.text())
        .then((txt) => {
          this.#infoTemplate = txt;
          this.#contentDisplayPane.innerHTML = this.#infoTemplate;
        })
        .catch(() => {
          this.#contentDisplayPane.innerHTML = `<div class="screen">Oops! We had a technical issue getting the info template. How embarassing.</div>`;
        });
    } else {
      this.#contentDisplayPane.innerHTML = this.#infoTemplate;
    }
  }

  /** Determine if a test should be cached */
  #shoudCache() {
    return document.getElementById("cache-btn")?.checked ?? false;
  }

  /**
   * Manipulate the file contents of a Coding Test into an HTML string ready for testing.
   * @param {string} fileContents
   */
  #getCodeTestHTML(fileContents) {
    // Get the lines.
    const lines = fileContents.split(/\r?\n/g);

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
    return `<div class="test code">${lineStrs.join("")}</div>`;
  }

  /**
   * Manipulate the file contents of an Action Test into an HTML string ready for testing.
   * @param {string} fileContents
   */
  #getActionTestHTML(fileContents) {
    /**@type {ATFile}*/
    const instructions = JSON.parse(fileContents);
    const stepBlocks = instructions.map((i) => {
      const { action, comments, content, keybind } = i;

      const nlLine = `<div class="line newline"></div>`;
      const commentStrs = comments.map((c) => {
        if (c.includes("Title:")) return `<div class="line title">${c}</div>`;
        return `<div class="line comment">// ${c}</div>`;
      });

      // If the user requires come action.
      if (action && content && keybind) {
        const inputStrs = keybind.split("").map((k) => `<span>${k}</span>`);
        const inputDivAttrs = `class="line" action="${action}" content="${content.join("\\n")}"`;
        inputDiv = `<div ${inputDivAttrs}>${inputStrs.join("")}</div>`;
      }

      return `${commentStrs.join("")}${inputDiv}${nlLine}`;
    });

    // Wrap it all in a div with a class to help identify the type of test.
    return `<div class="test action">${stepBlocks.join("")}</div>`;
  }

  /**
   * Get a new test URL based on the currently loaded test suite.
   * @param {string[]} tests
   */
  #getRandomTestURL() {
    const tests = SuiteDataBase.getTests(this.#knownSuite.name);

    if (!this.#knownSuite) throw Error("No suite loaded");
    let unseenTests = tests.filter((t) => !this.#knownSuite.seenTests.includes(t));
    if (unseenTests.length === 0) {
      this.#knownSuite.seenTests = [];
      unseenTests = tests;
    }

    const randomIndex = Math.floor(Math.random() * unseenTests.length);
    const randomTest = unseenTests[randomIndex];
    this.#knownSuite.seenTests.push(randomTest);
    return `../../db/test-suites/${this.#knownSuite.name}/${randomTest}`;
  }

  async #getTestContents(testURL) {
    const local = localStorage.getItem(testURL);
    if (local) return local;

    const remote = await fetch(testURL).then((res) => res.text());
    if (!remote) return null;
    if (this.#shoudCache()) localStorage.setItem(testURL, remote);
    return remote;
  }

  /**
   * Display a test. If no suite is parsed in, then we assume the new test
   * comes from the existing suite. If a suite (name and type) are passing in,
   * then we assume a new suite has been selected.
   *
   * @param {{name: string; type: string}|undefined} suite
   */
  displayTest(suite) {
    if (suite) {
      this.#knownSuite = { name: suite.name, type: suite.type, seenTests: [] };
    }

    this.#loading();

    const testURL = this.#getRandomTestURL();
    this.#getTestContents(testURL)
      .then((fileContents) => {
        if (this.#knownSuite.type === "Action")
          this.#contentDisplayPane.innerHTML = this.#getActionTestHTML(fileContents);
        else if (this.#knownSuite.type === "Code")
          this.#contentDisplayPane.innerHTML = this.#getCodeTestHTML(fileContents);
        else {
          this.#contentDisplayPane.innerHTML = `<div class="screen">Unknown Test Type: Oops, how'd we get here?</div>`;
        }
      })
      .catch((e) => {
        this.#contentDisplayPane.innerHTML = `<div class="error screen">${e.message}</div>`;
      });
  }

  /** Display the results from the current test. */
  displayResults() {}
}
