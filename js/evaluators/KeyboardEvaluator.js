/**
 * @typedef {{
 *   duration: number;
 *   time: number;
 *   intervalId: number;
 *   correct: number;
 *   incorrect: number;
 *   backspaces: number;
 *   testNumber: number;
 * }} TestRecording
 */

/**
 * This file is a bit of a mess... sorry. The idea behind the
 * `KeyboardEvaluator` is to evaluate all keyboard inputs.
 *
 * Keyboard inputs are used to navigate AND to take tests. So, it's kinda all
 * lumped together here. Previous attempts to separate these concerns resulted
 * in messy components that end up propagating events up with a master
 * evaluator. Thus, having everything in one space is currently the best
 * solution. In the event that more than two styles of tests are created, then
 * this, and the "Content" manager will need to create some overarching
 * components to manage tests.
 */
export class KeyboardEvaluator extends EventTarget {
  // Elements
  #contentDisplayPane = Object.freeze(document.getElementById("_enter_content"));
  #contextDisplayText = document.getElementById("content-context");
  #displayValue = document.getElementById("key-context");

  // Nav Items
  /**@type {string[]}*/
  #keySeq = [];
  #fontSize = 1;
  #selectedElement = document.activeElement;

  // Test Items
  #commandPrimed = false;
  #running = false;
  #tokenIndex = 0;
  /**@type {import("../../db/suites").SuiteType|undefined} */
  #tokensType;
  /**@type {Element[]}*/
  #tokens = [];

  // Recording Items
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

      this.#contextDisplayText.innerText = "[Escape] Unfocus, [j] Scroll Down, [k] Scroll Up, [r] Reload Test";
      this.#keySeq = ["enter"];
    });

    this.#contentDisplayPane.addEventListener("focusout", () => {
      this.#contextDisplayText.innerText = "[Enter] Focus, [r] Reload Test";
    });

    this.#contextDisplayText.innerText = "[Enter] Focus, [r] Reload Test";
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
    this.#contentDisplayPane.style.fontSize = `var(--fs-${this.#fontSize})`;
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

    // Alter Font Size
    if (ev.ctrlKey) {
      if (key === "+" || key === "=") {
        ev.preventDefault();
        this.#fontSize = Math.max(-2, Math.min(this.#fontSize + 1, 5));
        this.#renderNav();
        return;
      }
      if (key === "-" || key === "_") {
        ev.preventDefault();
        this.#fontSize = Math.max(-2, Math.min(this.#fontSize - 1, 5));
        this.#renderNav();
        return;
      }
    }

    // Escape navigation context
    if (key === "Escape") {
      ev.preventDefault();
      this.#resetNav();
      return;
    }

    if (key === "r") {
      ev.preventDefault();
      this.#resetNav();
      this.dispatchEvent(new CustomEvent("reload"));
      return;
    }

    if (document.activeElement === this.#contentDisplayPane) {
      if (key === "j") {
        this.#contentDisplayPane.scrollBy({ top: 50 });
      }
      if (key === "k") {
        this.#contentDisplayPane.scrollBy({ top: -50 });
      }
      return;
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
      this.#resetNav();
      this.#selectedElement.click();
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
      this.dispatchEvent(new CustomEvent("reload"));
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

  #resetLine(ln) {
    const lineElements = this.#tokens.filter((e) => e.getAttribute("line") === ln);

    let len = lineElements.findIndex((e) => e.className === "");
    if (len < 0) len = lineElements.length;
    for (let i = 0; i < len; i++) this.#backspace();

    lineElements.forEach((e) => {
      e.className = "incorrect";
      setTimeout(() => (e.className = e.className === "incorrect" ? "" : e.className), 200);
    });
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

  /**@param {string} msg */
  #updateLineMessage(msg) {}

  /**@param {string} content */
  #copyText(content) {
    navigator.clipboard.writeText(content).catch(() => {});
  }

  /**@param {string} content */
  #pasteText(content) {}

  async #actionInterpreter(currentToken) {
    const action = currentToken.getAttribute("action");
    const content = currentToken.getAttribute("content");

    if (!action) return undefined;

    switch (action) {
      case "copy":
        return this.#copyText(content);
      case "paste":
        return this.#pasteText(content);
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

    this.#actionInterpreter(currentToken);
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
        this.#resetNav();
        this.dispatchEvent(new Event("quit"));
        return;
      }
      // TODO: Remove on publish - Cheat to finish test quickly
      if (ev.key === "~") {
        this.#tokens.slice(0, -2).forEach((e) => (e.className = "correct"));
        this.#tokenIndex = this.#tokens.length - 2;
        this.#correct += this.#tokenIndex;
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

  async record({ duration, time, intervalId }) {
    this.#testRecordings.push({
      duration,
      time,
      intervalId,
      correct: this.#correct,
      incorrect: this.#incorrect,
      backspaces: this.#backspaces,
      testNumber: this.#testNumber,
    });
  }

  /**@returns {TestRecording[]}*/
  getRecordings() {
    return JSON.parse(JSON.stringify(this.#testRecordings));
  }

  loadActionTokens() {
    const testDiv = this.#contentDisplayPane.querySelector(".test");
    if (!testDiv || !testDiv.classList.contains("action")) {
      this.#tokens = [];
      this.#tokenIndex = 0;
      return;
    }

    this.#tokensType = "Action";
    this.#tokenIndex = 0;
    this.#tokens = Array.from(testDiv.children)
      .filter((line) => !!line.getAttribute("action")) // Only interested in actionable components.
      .map((line) => Array.from(line.children))
      .flat();
    this.#highlightCurrentToken();
  }

  loadCodeTokens() {
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

    if (this.#isActiveTest()) this.#testEvaluation(ev);
    else this.#navEvaluation(ev);
  }
}
