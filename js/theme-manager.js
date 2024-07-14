export class ThemeManager extends EventTarget {
  themeAttrTag = "theme";
  isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  themeDropdownElement = document.getElementById("theme");
  themeDropdownContentElement = this.themeDropdownElement.querySelector(".dropdown-content");
  themeCurrentValueElement = this.themeDropdownElement.querySelector(".current-value");

  _updateUI(theme) {
    this.themeCurrentValueElement.innerText = theme;
    Array.from(this.themeDropdownContentElement.children).forEach((child) => {
      if (child.innerText.includes(theme)) child.classList.add("selected");
      else child.classList.remove("selected");
    });
  }

  setup() {
    // Set default theme
    this._updateUI("System");
    this.setTheme();

    // Setup theme switching buttons
    document.getElementById("system-theme").addEventListener("click", () => {
      this.isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      this._updateUI("System");
      this.setTheme();
    });

    document.getElementById("light-theme").addEventListener("click", () => {
      this.isDark = false;
      this._updateUI("Light");
      this.setTheme();
    });

    document.getElementById("dark-theme").addEventListener("click", () => {
      this.isDark = true;
      this._updateUI("Dark");
      this.setTheme();
    });
  }

  getThemeValue() {
    return this.isDark ? "dark" : "light";
  }

  setTheme() {
    document.documentElement.setAttribute(this.themeAttrTag, this.getThemeValue());
    this.dispatchEvent(new Event("themeUpdated"));
  }
}
