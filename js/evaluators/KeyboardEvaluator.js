/**
 * @typedef {{
 * duration: number;
 *   timestamp: number;
 *   intervalId: number;
 *   correct: number;
 *   incorrect: number;
 *   backspaces: number;
 *   test: {name: string; type: string; testNumber: number};
 * }} TestRecording
 */

/**
 * This file is a bit of a mess... sorry. The idea behind the
 * `KeyboardEvaluator` is to evaluate all keyboard inputs.
 *
 * Keyboard inputs are used to navigate AND to take tests. So, it's kinda all
 * lumped together here. Previous attempts to separate these concerns resulted
 * in messy components that end up propagating events up with a master
 * evaluator, or resulted in complicated hand-over logic for who was in charge
 * (which gets messy when the mouse is used). Thus, having everything in one
 * space is currently the best solution.
 */
export class KeyboardEvaluator extends EventTarget {
  // Elements
  #contentDisplayPane = Object.freeze(document.getElementById("_enter_content"));
  #contextDisplayText = document.getElementById("content-context");
  #displayValue = document.getElementById("key-context");

  // Nav Items
  /**@type {string[]}*/
  #keySeq = [];
  #selectedElement = document.activeElement;

  // Test Items
  #commandPrimed = false;
  #running = false;
  #locked = false;
  #tokenIndex = 0;
  /**@type {import("../../db/suites").SuiteType|undefined} */
  #tokensType;
  /**@type {Element[]}*/
  #tokens = [];

  // Recording Items
  /** @type {{name: string; type: string}} suite */
  #suite;
  #testNumber = 0;
  #correct = 0;
  #incorrect = 0;
  #backspaces = 0;
  /**@type {TestRecording[]}*/
  #testRecordings = [];

  constructor() {
    super();

    this.#contentDisplayPane.addEventListener("focusin", () => {
      if (this.#isActiveTest()) {
        this.#contextDisplayText.innerText = "[:q] Quit";
        return;
      }

      this.#contextDisplayText.innerText = "[Escape] Unfocus, [j] Scroll Down, [k] Scroll Up";
      this.#keySeq = ["enter"];
    });

    this.#contentDisplayPane.addEventListener("focusout", () => {
      this.#contextDisplayText.innerText = "[Enter] Focus, [Ctrl + d] Next Test, [Ctrl + u] Prev Results";
    });

    this.#contextDisplayText.innerText = "[Enter] Focus, [Ctrl + d] Next Test, [Ctrl + u] Prev Results";
    this.#renderNav();
  }

  //-------------------------------------------------------------------------------------------------------------------
  // UTILS
  //-------------------------------------------------------------------------------------------------------------------

  #isTestReady() {
    return this.#contentDisplayPane.querySelector(".test") && this.#tokens.length > 0;
  }

  #isActiveTest() {
    return document.activeElement === this.#contentDisplayPane && this.#isTestReady();
  }

  //-------------------------------------------------------------------------------------------------------------------
  // NAVIGATION
  //-------------------------------------------------------------------------------------------------------------------

  #renderNav() {
    this.#displayValue.innerText = this.#keySeq.length > 0 ? this.#keySeq.join("-") : "*base*";
  }

  #resetNav() {
    this.#keySeq = [];
    document.activeElement.blur();
    this.#renderNav();
  }

  #activeDropdowns() {
    return Array.from(document.querySelectorAll(".dropdown-content"))
      .filter((dc) => getComputedStyle(dc).display === "flex")
      .map((dc) => dc.parentElement);
  }

  /**@param {KeyboardEvent} ev */
  #navEvaluation(ev) {
    const key = ev.key;
    this.#running = false;

    // Escape navigation context
    if (key === "Escape") {
      ev.preventDefault();
      this.#resetNav();
      return;
    }

    if (document.activeElement === this.#contentDisplayPane) {
      if (key === "j") {
        this.#contentDisplayPane.scrollBy({ top: 50 });
        return;
      }
      if (key === "k") {
        this.#contentDisplayPane.scrollBy({ top: -50 });
        return;
      }
    }

    if (ev.ctrlKey) {
      if (key === "d") {
        ev.preventDefault();
        this.#resetNav();
        this.dispatchEvent(new CustomEvent("reloadTest"));
        return;
      }

      if (key === "u") {
        ev.preventDefault();
        this.#resetNav();
        this.dispatchEvent(new CustomEvent("reloadResult"));
        return;
      }
    }

    // Hovered Dropdowns in base case
    if (this.#keySeq.length === 0) {
      const activeDropdowns = this.#activeDropdowns();
      const activeElement = activeDropdowns[0] ?? document.activeElement ?? document.body;
      const activeKeyMatches = activeElement.id.match(/_(.*?)_/);
      this.#keySeq = activeKeyMatches ? [activeKeyMatches[1]] : [];
    }

    // Find element whos ID matches this key sequenence
    this.#keySeq.push(ev.key.toLowerCase());
    this.#selectedElement = document.querySelector(`[id^="_${this.#keySeq.join("")}_"]`);

    // Reset if invalid
    if (!this.#selectedElement) {
      this.#resetNav();
      return;
    }

    // Focus Divs, Click all other elements
    if (this.#selectedElement.tagName === "DIV") {
      this.#selectedElement.tabIndex = -1;
      this.#selectedElement.focus();
    } else {
      this.#selectedElement.click();
      this.#resetNav();
    }

    this.#renderNav();
  }

  //-------------------------------------------------------------------------------------------------------------------
  // TESTS
  //-------------------------------------------------------------------------------------------------------------------

  #resetTest() {
    this.#commandPrimed = false;
    this.#running = false;

    this.#tokenIndex = 0;
    this.#tokensType = undefined;
    this.#tokens = [];

    this.#testNumber = 0;
    this.#correct = 0;
    this.#incorrect = 0;
    this.#backspaces = 0;
    this.#testRecordings = [];
  }

  #highlightCurrentToken() {
    if (this.#tokenIndex >= this.#tokens.length && this.#tokens.length > 0) {
      this.#testNumber++;
      this.dispatchEvent(new CustomEvent("reloadTest"));
      return;
    }

    const currentToken = this.#tokens[this.#tokenIndex];
    currentToken.className = "selected";
    if (this.#isActiveTest()) currentToken.scrollIntoView();
  }

  #backspace() {
    const currentToken = this.#tokens[this.#tokenIndex];

    // Remove indicators
    currentToken.className = "";
    if (currentToken.innerText === "\\n") currentToken.className = "newline";

    this.#tokenIndex = Math.max(0, this.#tokenIndex - 1);
    this.#backspaces++;
  }

  #resetLine(ln, errMsg = "") {
    const lineElements = this.#tokens.filter((e) => e.getAttribute("line") === ln);
    const parent = lineElements[0].parentElement;

    let len = lineElements.findIndex((e) => e.className === "");
    if (len < 0) len = lineElements.length;
    len--;
    console.log(len);
    for (let i = 0; i < len; i++) this.#backspace();

    const msg = parent.querySelector(".message");
    if (msg) {
      if (errMsg.length > 0) msg.innerText = errMsg;
      else msg.innerText = "Incorrect";

      msg.classList.remove("hide");
      setTimeout(() => msg.classList.add("hide"), 500);
    }
  }

  #controlBackspace() {
    // Find last whitespace character
    let count = 0;
    while (this.#tokenIndex > 0) {
      const peekTokenIndex = Math.max(0, this.#tokenIndex - 1);
      const peekToken = this.#tokens[peekTokenIndex];
      if ((peekToken.innerText === " " || peekToken.innerText === "\\n") && count > 0) break;
      this.#backspace();
      count++;
    }
  }

  #correctActionInput() {
    const currentToken = this.#tokens[this.#tokenIndex];
    currentToken.className = "correct";
    this.#tokenIndex++;
    this.#highlightCurrentToken();
  }

  /**@param {string} content */
  #copyText(content, ln) {
    navigator.clipboard
      .writeText(content)
      .then(() => this.#correctActionInput())
      .catch(() => {
        this.#resetLine(ln, "Unable to copy to clipboard");
      })
      .finally(() => (this.#locked = false));
    return "copying";
  }

  /**@param {string} content */
  #pasteText(content, ln) {
    const sanitizedContent = content.replaceAll(/\s/g, "");

    navigator.clipboard
      .readText()
      .then((input) => {
        const sanitizedInput = input.replaceAll(/\s/g, "");
        if (sanitizedContent != sanitizedInput) {
          this.#resetLine(ln, "Incorrect Pasted Text");
          return;
        }
        this.#correctActionInput();
      })
      .catch(() => this.#resetLine(ln, "Unable to read from clipboard"))
      .finally(() => (this.#locked = false));
    return "pasting";
  }

  /**@param {Element} currentToken */
  #actionInterpreter(currentToken) {
    const action = currentToken.getAttribute("action");
    const content = currentToken.getAttribute("content");
    const ln = currentToken.getAttribute("line");

    if (!action) return undefined;

    switch (action) {
      case "copy":
        return this.#copyText(content, ln);
      case "paste":
        return this.#pasteText(content, ln);
    }
  }

  /**@param {KeyboardEvent} ev */
  #actionEvaluation(ev) {
    const currentToken = this.#tokens[this.#tokenIndex];

    // WARN: Precatch these special cases here to ensure they aren't used in "codeEvaluation" below.
    if (ev.key === "Backspace" && currentToken.innerText != "Backspace") {
      this.#resetLine(currentToken.getAttribute("line"));
      return;
    }

    // Extend upon character evaluation.
    this.#codeEvaluation(ev);

    if (currentToken.className.includes("incorrect")) {
      this.#tokenIndex--; // Revert jump to next from code evaluation
      this.#resetLine(currentToken.getAttribute("line"));
      return;
    }

    const action = this.#actionInterpreter(currentToken);
    if (action) {
      this.#locked = true;
      this.#tokenIndex--;
    }
  }

  /**@param {KeyboardEvent} ev */
  #codeEvaluation(ev) {
    if (ev.key === "Backspace") {
      if (ev.ctrlKey) return this.#controlBackspace();
      return this.#backspace();
    }

    // Character input - no meta characters
    const currentToken = this.#tokens[this.#tokenIndex];
    const char = currentToken.innerText;
    let key = ev.key;
    if (ev.key === "Enter") key = "\\n";

    if (char === key) {
      currentToken.className = "correct";
      this.#correct++;
    } else {
      currentToken.className = char === " " ? "incorrect-space" : "incorrect";
      this.#incorrect++;
    }
    this.#tokenIndex++;
  }

  /**@param {KeyboardEvent} ev */
  #testEvaluation(ev) {
    if (!this.#running) {
      this.#running = true;
      this.dispatchEvent(new CustomEvent("start"));
    }

    if (this.#tokens.length === 0) return;
    ev.preventDefault();

    // Command Mechanics
    if (this.#commandPrimed) {
      if (ev.key === "q") {
        this.dispatchEvent(new Event("quit"));
        return;
      }
      // TODO: Remove on publish - Cheat to finish test quickly
      if (ev.key === "f") {
        this.#testRecordings = [];
        const duration = 30;
        for (let i = 0; i < Math.floor(Math.random() * (duration - 10)) + 10; i++) {
          this.#testRecordings.push({
            duration: duration,
            timestamp: i,
            correct: Math.floor(Math.random() * 10),
            incorrect: Math.floor(Math.random() * 3),
            backspaces: Math.floor(Math.random() * 3),
            test: {
              ...this.#suite,
              testNumber: Math.floor(i / 10),
            },
          });
        }

        this.dispatchEvent(new Event("quit"));
        return;
      }
    }

    if (ev.key === ":") this.#commandPrimed = true;
    else this.#commandPrimed = false;

    if (this.#tokensType === "Action") this.#actionEvaluation(ev);
    if (this.#tokensType === "Code") this.#codeEvaluation(ev);
    this.#highlightCurrentToken();
  }

  //-------------------------------------------------------------------------------------------------------------------
  // API
  //-------------------------------------------------------------------------------------------------------------------

  /**@param {Object} param0
   * @param {number} param0.duration
   * @param {number} param0.time
   * @param {number} param0.intervalId
   */

  record({ duration, time }) {
    this.#testRecordings.push({
      duration,
      timestamp: duration - time,
      correct: this.#correct,
      incorrect: this.#incorrect,
      backspaces: this.#backspaces,
      test: {
        ...this.#suite,
        testNumber: this.#testNumber,
      },
    });

    this.#correct = 0;
    this.#incorrect = 0;
    this.#backspaces = 0;
  }

  /**@returns {TestRecording[]}*/
  getRecordings() {
    return JSON.parse(JSON.stringify(this.#testRecordings));
  }

  /** @param {{name: string; type: string}} suite */
  loadActionTokens(suite) {
    this.#suite = suite;

    const testDiv = this.#contentDisplayPane.querySelector(".test");
    if (!testDiv || !testDiv.classList.contains("action")) {
      this.#tokens = [];
      this.#tokenIndex = 0;
      return;
    }

    this.#tokensType = "Action";
    this.#tokenIndex = 0;
    this.#tokens = Array.from(testDiv.children)
      .filter((line) => line.classList.contains("input")) // Only interested in input components for evaluation.
      .map((line) => Array.from(line.children))
      .flat()
      .filter((char) => !char.classList.contains("message"));
    this.#highlightCurrentToken();
  }

  /** @param {{name: string; type: string}} suite */
  loadCodeTokens(suite) {
    this.#suite = suite;

    const testDiv = this.#contentDisplayPane.querySelector(".test");
    if (!testDiv || !testDiv.classList.contains("code")) {
      this.#tokens = [];
      this.#tokenIndex = 0;
      return;
    }

    this.#tokensType = "Code";
    this.#tokenIndex = 0;
    this.#tokens = Array.from(testDiv.children)
      .map((line) => Array.from(line.children))
      .flat();
    this.#highlightCurrentToken();
  }

  reset(usingMouse) {
    this.#resetNav();
    if (usingMouse) this.#displayValue.innerHTML = `<div class="error">MOUSE USED!<div>`;
    else this.#resetTest();
  }

  /**@param {KeyboardEvent} ev */
  keydown(ev) {
    // Ignore modifier only events
    if (["alt", "control", "meta", "shift"].includes(ev.key.toLowerCase())) return;

    if (this.#locked) return;

    if (this.#isActiveTest()) this.#testEvaluation(ev);
    else this.#navEvaluation(ev);
  }
}
