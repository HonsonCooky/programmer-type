import { IElementManager } from "./IElementManager.js";

/**
 * @typedef {{ suiteName:string }} SuiteEvent
 */

export class Suite extends IElementManager {
  // Elements
  #dropdown = document.getElementById("suite");
  #options = this.#dropdown.querySelector(".dropdown-content");
  #displayValue = this.#dropdown.querySelector(".current-value");

  //HTML values
  #labelValue = this.#displayValue.innerText;

  constructor() {
    super();

    this.render();

    Array.from(this.#options.children).forEach((child) => {
      if (child.tagName != "BUTTON") return;
      child.addEventListener("click", () => this.#updateSuite(child));
    });
  }

  #updateSuite(btn) {
    this.#labelValue = btn.innerText.replace(/\[.*\]/, "").trim();
    this.render();
  }

  getSuiteName() {
    return this.#labelValue;
  }

  render() {
    // Update display value and selected item
    this.#displayValue.innerText = this.#labelValue;
    Array.from(this.#options.children).forEach((child) => {
      if (child.tagName != "BUTTON") return;
      if (child.innerText.includes(this.#labelValue)) child.classList.add("selected");
      else child.classList.remove("selected");
    });

    this.dispatchEvent("update", { suiteName: this.#labelValue });
  }
}
