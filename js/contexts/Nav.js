import { Duration } from "../managers/Duration.js";
import { Suite } from "../managers/Suite.js";
import { Theme } from "../managers/Theme.js";
import { PTShared } from "../script.js";
import { IContext } from "./IContext.js";

/**
 * Navigation Context: Used to interpret user actions before starting a test.
 * Activated on actions that "stop" a test.
 */
export class NavContext extends IContext {
  /** The keyboard input context at the bottom right  */
  #displayValue = document.getElementById("key-context");

  /**@type {Duration}*/
  #duration;
  /**@type {Suite}*/
  #suite;

  // Selected Element
  #keySeq = "";
  /** @type {HTMLElement|null} */
  #selectedElement;

  constructor() {
    super();

    // Theme reference is not needed. Self sufficient, but technically a Navigation component.
    new Theme();

    this.#duration = new Duration();
    this.#suite = new Suite();

    this.#duration.addEventListener(
      "update",
      /** @param {CustomEvent<import("../managers/Duration.js").DurationEvent>} ev */
      (ev) => PTShared.setDuration(ev.detail.seconds),
    );

    this.#suite.addEventListener(
      "update",
      /** @param {CustomEvent<import("../managers/Suite.js").SuiteEvent>} ev */
      (ev) => PTShared.setSuite(ev.detail.suiteName),
    );

    window.addEventListener("mousedown", this.#resetKeyContext.bind(this));
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

  /** Reset all elements back to their initial state. */
  #resetKeyContext() {
    this.#displayValue.innerText = "*base*";
    this.#keySeq = "";
    this.#selectedElement = "";
  }

  activate() {
    // Re-set the duration and suite
    PTShared.setDuration(this.#duration.getSeconds());
    PTShared.setSuite(this.#suite.getSuiteName());
    this.#resetKeyContext();
  }

  deactivate() {
    this.#resetKeyContext();
  }

  /** @param {KeyboardEvent} ev */
  keydown(ev) {
    if (ev.key === "Escape") {
      this.#resetKeyContext();
      document.activeElement.blur();
      return;
    }

    if (this.#keySeq === "") {
      const activeDropdowns = this.#activeDropdowns();
      const activeElement = activeDropdowns[0] ?? document.activeElement ?? document.body;
      const activeKeyMatches = activeElement.id.match(/_(.*?)_/);
      const activeKey = activeKeyMatches ? activeKeyMatches[1] : "";
      this.#keySeq = activeKey;
    }

    this.#keySeq += ev.key;
    this.#selectedElement = document.querySelector(`[id^="_${this.#keySeq}_"]`);

    if (!this.#selectedElement) {
      this.#resetKeyContext();
      document.activeElement.blur();
      return;
    }

    this.#displayValue.innerText = this.#keySeq.split("").join("-");

    if (this.#selectedElement.tagName === "DIV") {
      this.#selectedElement.tabIndex = -1;
      this.#selectedElement.focus();
      return;
    }

    this.#selectedElement.click();
    this.#resetKeyContext();
    document.activeElement.blur();
  }
}
