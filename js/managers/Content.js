import { IElementManager } from "./IElementManager.js";
import { ActionEvaluator } from "../evaluators/ActionEvaluator.js";
import { CodeEvaluator } from "../evaluators/CodeEvaluator.js";
import { IEvaluator } from "../evaluators/IEvaluator.js";

export class Content extends IElementManager {
  // Elements
  #contentDisplayPane = document.getElementById("_enter_content");
  #contextDisplayText = document.getElementById("content-context");
  #displayValue = document.getElementById("key-context");
  #selectedElement = document.activeElement;

  // Long Lived Variables
  #keySeq = [];
  #fontSize = 1;
  #actionEvaluator = new ActionEvaluator();
  #codeEvaluator = new CodeEvaluator();
  /**@type {IEvaluator|undefined}*/
  #currentEvaluator;
  /**@type {{correct: number; incorrect: number; index: number; time: number;}[]} */
  #testRecords = [];

  constructor() {
    super();
    this.render();

    // Setup the content context panel information
    this.setContentContext("[Enter] Focus, [r] Reload Test");

    // Behaviours that update the context
    this.#contentDisplayPane.addEventListener("click", () => {
      this.#contentDisplayPane.tabIndex = -1;
      this.#contentDisplayPane.focus();
    });

    this.#contentDisplayPane.addEventListener("focusin", () => {
      if (this.#isContentTest()) return this.setContentContext("[:q] Quit");
      this.setContentContext("[Escape] Unfocus, [j] Scroll Down, [k] Scroll Up");
    });

    this.#contentDisplayPane.addEventListener("focusout", () => {
      this.setContentContext("[Enter] Focus, [r] Reload Test");
    });

    this.#actionEvaluator.addEventListener("run", (ev) => this.dispatchEvent(new Event(ev.type, ev)));
    this.#codeEvaluator.addEventListener("run", (ev) => this.dispatchEvent(new Event(ev.type, ev)));
    this.#actionEvaluator.addEventListener("next", (ev) => this.dispatchEvent(new Event(ev.type, ev)));
    this.#codeEvaluator.addEventListener("next", (ev) => this.dispatchEvent(new Event(ev.type, ev)));
    this.#actionEvaluator.addEventListener("quit", (ev) => this.dispatchEvent(new Event(ev.type, ev)));
    this.#codeEvaluator.addEventListener("quit", (ev) => this.dispatchEvent(new Event(ev.type, ev)));
  }

  #resetNav() {
    this.#keySeq = [];
    document.activeElement.blur();
    this.render();
  }

  #resetTest() {
    if (this.#currentEvaluator) this.#currentEvaluator._loadTokens();
    this.render();
  }

  /**@param {KeyboardEvent} ev */
  #navKeyEvaluation(ev) {
    const key = ev.key;

    if (document.activeElement === this.#contentDisplayPane) {
      if (key === "j") {
        this.#contentDisplayPane.scrollBy({ top: 50 });
      }
      if (key === "k") {
        this.#contentDisplayPane.scrollBy({ top: -50 });
      }
      if (key === "Escape") {
        this.#resetNav();
      }
      return;
    }

    // Escape navigation context
    if (key === "Escape") {
      ev.preventDefault();
      this.#resetNav();
      return;
    }

    if (key === "r") {
      ev.preventDefault();
      this.dispatchEvent(new Event("next"));
      return;
    }

    // Alter Font Size
    if (ev.ctrlKey) {
      if (key === "+") {
        ev.preventDefault();
        this.#fontSize = Math.max(-2, Math.min(this.#fontSize + 1, 5));
        this.render();
        return;
      }
      if (key === "-") {
        ev.preventDefault();
        this.#fontSize = Math.max(-2, Math.min(this.#fontSize - 1, 5));
        this.render();
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
      this.#resetNav();
      this.#selectedElement.click();
    }

    this.render();
  }

  /**
   * In the case a dropdown is being hovered, we should take this into account
   * for the keyboard input.
   */
  #activeDropdowns() {
    return Array.from(document.querySelectorAll(".dropdown-content"))
      .filter((dc) => getComputedStyle(dc).display === "flex")
      .map((dc) => dc.parentElement);
  }

  #isContentTest() {
    return document.activeElement === this.#contentDisplayPane && !!this.#contentDisplayPane.querySelector(".test");
  }

  /**@param {KeyboardEvent} ev */
  #testKeyEvaluation(ev) {
    this.#currentEvaluator.keydown(ev);
  }

  /**@param {string|Element} element */
  setContent(element) {
    if (typeof element === "string") {
      this.#contentDisplayPane.innerHTML = element;
    } else {
      this.#contentDisplayPane.innerHTML = "";
      this.#contentDisplayPane.appendChild(element);
    }

    const testElement = this.#contentDisplayPane.querySelector(".test");
    if (!!testElement) {
      const testType = Array.from(testElement.classList).filter((c) => c != "test")[0];
      if (testType === "action") this.#currentEvaluator = this.#actionEvaluator;
      if (testType === "code") this.#currentEvaluator = this.#codeEvaluator;
      this.#currentEvaluator._loadTokens();
    } else {
      this.dispatchEvent(new Event("interrupt"));
      this.#contentDisplayPane.tabIndex = -1;
      this.#contentDisplayPane.focus();
    }
  }

  /**@param {string} str */
  setContentContext(str) {
    this.#contextDisplayText.innerText = str;
  }

  /**
   * Record the current stats about the test.
   * @param {number} time
   */
  record(time) {
    const evalRecord = this.#currentEvaluator.getRecord();
    this.#testRecords.push({ ...evalRecord, time });
  }

  getTestRecords() {
    return [...this.#testRecords];
  }

  reset() {
    this.#resetNav();
    this.#resetTest();
    this.#testRecords = [];
  }

  /**@param {KeyboardEvent} ev */
  keydown(ev) {
    const key = ev.key.toLowerCase();
    if (["alt", "control", "meta", "shift"].includes(key)) return;
    if (this.#isContentTest()) return this.#testKeyEvaluation(ev);
    this.#navKeyEvaluation(ev);
  }

  /**@override*/
  render() {
    this.#displayValue.innerText = this.#keySeq.length > 0 ? this.#keySeq.join("-") : "*base*";
    this.#contentDisplayPane.style.fontSize = `var(--fs-${this.#fontSize})`;
  }
}
