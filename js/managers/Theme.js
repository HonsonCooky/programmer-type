import { IElementManager } from "./IElementManager.js";

export class Theme extends IElementManager {
  // Elements
  #dropdown = document.getElementById("_t_theme");
  #options = this.#dropdown.querySelector(".dropdown-content");
  #displayValue = this.#dropdown.querySelector(".current-value");

  // HTML values
  #themeAttrTag = "theme";
  #isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  #labelValue = this.#displayValue.innerText;

  constructor() {
    super();

    // Set default theme
    this.render();

    // Setup theme switching buttons (only three, no need for a loop)
    document
      .getElementById("_ts_system-theme")
      .addEventListener("click", () => {
        this.#isDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        this.#labelValue = "System";
        this.render();
      });

    document.getElementById("_tl_light-theme").addEventListener("click", () => {
      this.#isDark = false;
      this.#labelValue = "Light";
      this.render();
    });

    document.getElementById("_td_dark-theme").addEventListener("click", () => {
      this.#isDark = true;
      this.#labelValue = "Dark";
      this.render();
    });
  }

  /** Translate the boolean `this.#isDark` to a string for CSS attribute. */
  #getCssValue() {
    return this.#isDark ? "dark" : "light";
  }

  /**@override*/
  render() {
    // Set the theme for CSS
    document.documentElement.setAttribute(
      this.#themeAttrTag,
      this.#getCssValue(),
    );

    // Update display value and selected item
    this.#displayValue.innerText = this.#labelValue;
    Array.from(this.#options.children).forEach((child) => {
      if (child.tagName != "BUTTON") return;
      if (child.innerText.includes(this.#labelValue))
        child.classList.add("selected");
      else child.classList.remove("selected");
    });

    // Currently, completely unnecessary, but builtin just incase it's needed.
    this.dispatchEvent(new Event("update"));
  }
}
