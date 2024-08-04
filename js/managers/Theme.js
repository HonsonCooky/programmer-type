export class Theme extends EventTarget {
  #dropdown = document.getElementById("_t_theme");
  #options = this.#dropdown.querySelector(".dropdown-content");

  // HTML values
  #themeAttrTag = "theme";
  #isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  constructor() {
    super();

    // Set default theme
    this.#selectTheme("System");

    // Setup theme switching buttons (only three, no need for a loop)
    document.getElementById("_ts_system-theme").addEventListener("click", () => {
      this.#isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      this.#selectTheme("System");
    });

    document.getElementById("_tl_light-theme").addEventListener("click", () => {
      this.#isDark = false;
      this.#selectTheme("Light");
    });

    document.getElementById("_td_dark-theme").addEventListener("click", () => {
      this.#isDark = true;
      this.#selectTheme("Dark");
    });
  }

  /** Translate the boolean `this.#isDark` to a string for CSS attribute. */
  #getCssValue() {
    return this.#isDark ? "dark" : "light";
  }

  #selectTheme(selectedTheme) {
    document.documentElement.setAttribute(this.#themeAttrTag, this.#getCssValue());
    Array.from(this.#options.children).forEach((child) => {
      if (child.tagName != "BUTTON") return;
      if (child.innerText.includes(selectedTheme)) child.className = "selected";
      else child.className = "";
    });

    // Currently, completely unnecessary, but builtin just incase it's needed.
    this.dispatchEvent(new Event("update"));
  }
}
