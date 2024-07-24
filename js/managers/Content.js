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

  constructor() {
    super();
    this.render();

    // Setup the content context panel information
    this.setContentContext("[Enter] Focus, [r] Reload Test");

    this.#contentDisplayPane.addEventListener("focusin", () => {
      // Is a test.
      if (this.#isTestKeyInput()) {
        this.setContentContext("[:q] Quit");
        return;
      }

      // Is not a test, therefore, informative page.
      this.setContentContext(
        "[Escape] Unfocus, [j] Scroll Down, [k] Scroll Up",
      );
    });

    this.#contentDisplayPane.addEventListener("focusout", () => {
      this.setContentContext("[Enter] Focus, [r] Reload Test");
    });
  }

  #resetNav() {
    this.#keySeq = [];
    document.activeElement.blur();
    this.render();
  }

  #resetTest() {
    if (this.#currentEvaluator) this.#currentEvaluator.reset();
  }

  /**@param {KeyboardEvent} ev */
  #navKeyEvaluation(ev) {
    const key = ev.key;

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
      const activeElement =
        activeDropdowns[0] ?? document.activeElement ?? document.body;
      const activeKeyMatches = activeElement.id.match(/_(.*?)_/);
      this.#keySeq = activeKeyMatches ? [activeKeyMatches[1]] : [];
    }

    // Find element whos ID matches this key sequenence
    this.#keySeq.push(ev.key.toLowerCase());
    this.#selectedElement = document.querySelector(
      `[id^="_${this.#keySeq.join("")}_"]`,
    );

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

    this.render();
  }

  /**
   * In the case a dropdown is being hovered, we should take this into account
   * for the keyboard input.
   * */
  #activeDropdowns() {
    return Array.from(document.querySelectorAll(".dropdown-content"))
      .filter((dc) => getComputedStyle(dc).display === "flex")
      .map((dc) => dc.parentElement);
  }

  #isTestKeyInput() {
    return (
      document.activeElement === this.#contentDisplayPane &&
      !!document.querySelector("test")
    );
  }

  /**@param {KeyboardEvent} ev */
  #testKeyEvaluation(ev) {}

  /**@param {string|Element} element */
  setContent(element) {
    if (typeof element === "string") {
      this.#contentDisplayPane.innerHTML = element;
    } else {
      this.#contentDisplayPane.innerHTML = "";
      this.#contentDisplayPane.appendChild(element);
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
  async record(time) {}

  /** Reset the nav and evaluators */
  reset() {
    this.#resetNav();
    this.#resetTest();
  }

  /**@param {KeyboardEvent} ev */
  keydown(ev) {
    const key = ev.key.toLowerCase();
    if (["alt", "control", "meta", "shift"].includes(key)) return;
    if (this.#isTestKeyInput()) return this.#testKeyEvaluation(ev);
    this.#navKeyEvaluation(ev);
  }

  /**@override*/
  render() {
    this.#displayValue.innerText =
      this.#keySeq.length > 0 ? this.#keySeq.join("-") : "*base*";
    this.#contentDisplayPane.style.fontSize = `var(--fs-${this.#fontSize})`;
  }
}
