export class Theme extends EventTarget {
  #themeAttrTag = "theme";
  #isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Elements
  #themeDropdown = document.getElementById("theme");
  #themeOptions = this.#themeDropdown.querySelector(".dropdown-content");
  #themeDisplayValue = this.#themeDropdown.querySelector(".current-value");

  constructor() {
    super();

    // Set default theme
    this.#updateUI("System");
    this.#setTheme();

    // Setup theme switching buttons
    document.getElementById("system-theme").addEventListener("click", () => {
      this.#isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      this.#updateUI("System");
      this.#setTheme();
    });

    document.getElementById("light-theme").addEventListener("click", () => {
      this.#isDark = false;
      this.#updateUI("Light");
      this.#setTheme();
    });

    document.getElementById("dark-theme").addEventListener("click", () => {
      this.#isDark = true;
      this.#updateUI("Dark");
      this.#setTheme();
    });
  }

  #updateUI(theme) {
    this.#themeDisplayValue.innerText = theme;
    Array.from(this.#themeOptions.children).forEach((child) => {
      if (child.innerText.includes(theme)) child.classList.add("selected");
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
