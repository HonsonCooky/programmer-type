import { IElementManager } from "./IManager.js";

export class Theme extends IElementManager {
  #themeAttrTag = "theme";
  #isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  #labelValue = "System";

  // Elements
  #themeDropdown = document.getElementById("theme");
  #themeOptions = this.#themeDropdown.querySelector(".dropdown-content");
  #themeDisplayValue = this.#themeDropdown.querySelector(".current-value");

  constructor() {
    super();

    // Set default theme
    this.render("System");
    this.#setTheme();

    // Setup theme switching buttons
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
    this.#setTheme();
    this.#themeDisplayValue.innerText = this.#labelValue;
    Array.from(this.#themeOptions.children).forEach((child) => {
      if (child.innerText.includes(this.#labelValue)) child.classList.add("selected");
      else child.classList.remove("selected");
    });
  }

  #getThemeValue() {
    return this.#isDark ? "dark" : "light";
  }

  #setTheme() {
    document.documentElement.setAttribute(this.#themeAttrTag, this.#getThemeValue());
    this.dispatchEvent(new Event("themeUpdated"));
  }
}
