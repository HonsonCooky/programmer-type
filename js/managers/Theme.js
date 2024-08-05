export class Theme extends EventTarget {
  #dropdown = document.getElementById("_t_theme");
  #options = this.#dropdown.querySelector(".dropdown-content");

  // HTML values
  #themeAttrTag = "theme";
  #themes = {
    System: () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    Light: () => false,
    Dark: () => true,
  };

  constructor() {
    super();

    // Setup theme switching buttons (only three, no need for a loop)
    document.getElementById("_ts_system-theme").addEventListener("click", () => this.#selectTheme("System"));
    document.getElementById("_tl_light-theme").addEventListener("click", () => this.#selectTheme("Light"));
    document.getElementById("_td_dark-theme").addEventListener("click", () => this.#selectTheme("Dark"));

    const cachedTheme = localStorage.getItem("PTTheme") ?? "System";
    this.#selectTheme(cachedTheme);
  }

  #selectTheme(selectedTheme) {
    const theme = this.#themes[selectedTheme];
    const isDark = theme ? theme() : true;
    document.documentElement.setAttribute(this.#themeAttrTag, isDark ? "dark" : "light");

    Array.from(this.#options.children).forEach((child) => {
      if (child.tagName != "BUTTON") return;
      if (child.innerText.includes(selectedTheme)) child.className = "selected";
      else child.className = "";
    });

    // Save preference
    localStorage.setItem("PTTheme", selectedTheme);

    // Currently, completely unnecessary, but builtin just incase it's needed.
    this.dispatchEvent(new Event("update"));
  }
}
