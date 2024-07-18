import { IElementManager } from "./IElementManager.js";

/**
 * @typedef {{ seconds:number }} DurationEvent
 */

export class Duration extends IElementManager {
  // Elements
  #dropdown = document.getElementById("_d_duration");
  #options = this.#dropdown.querySelector(".dropdown-content");
  #displayValue = this.#dropdown.querySelector(".current-value");

  //HTML values
  #labelValue = this.#displayValue.innerText;
  #seconds = 60;

  constructor() {
    super();

    this.render();

    Array.from(this.#options.children).forEach((child) => {
      if (child.tagName != "BUTTON") return;
      child.addEventListener("click", () => {
        this.#labelValue = child.innerText.replace(/\[.*\]/, "").trim();
        this.#seconds = Number.parseInt(this.#labelValue);
        if (isNaN(this.#seconds)) this.#seconds = 0;
        this.render();
      });
    });
  }

  /**
   * Get the selected number of seconds for this test. Infinite time tests will
   * return 0.
   * @returns {number}
   */
  getSeconds() {
    return this.#seconds;
  }

  /**@override*/
  render() {
    // Update display value and selected item
    this.#displayValue.innerText = this.#labelValue;
    Array.from(this.#options.children).forEach((child) => {
      if (child.tagName != "BUTTON") return;
      if (child.innerText.includes(this.#labelValue)) child.classList.add("selected");
      else child.classList.remove("selected");
    });

    this.dispatchEvent("update", { seconds: this.#seconds });
  }
}
