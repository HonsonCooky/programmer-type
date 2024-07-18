import { IElementManager } from "./IElementManager.js";

export class Theme extends IElementManager {
  // Elements
  #dropdown = document.getElementById("theme");
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
    document.getElementById("system-theme").addEventListener("click", () => {
      this.#isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      this.#labelValue = "System";
      this.render();
    });

    document.getElementById("light-theme").addEventListener("click", () => {
      this.#isDark = false;
      this.#labelValue = "Light";
      this.render();
    });

    document.getElementById("dark-theme").addEventListener("click", () => {
      this.#isDark = true;
      this.#labelValue = "Dark";
      this.render();
    });
  }

  render() {
    // Set the theme for CSS
    document.documentElement.setAttribute(this.#themeAttrTag, this.#getCssValue());

    // Update display value and selected item
    this.#displayValue.innerText = this.#labelValue;
    Array.from(this.#options.children).forEach((child) => {
      if (child.tagName != "BUTTON") return;
      if (child.innerText.includes(this.#labelValue)) child.classList.add("selected");
      else child.classList.remove("selected");
    });

    this.dispatchEvent("update");
  }

  #getCssValue() {
    return this.#isDark ? "dark" : "light";
  }
}
