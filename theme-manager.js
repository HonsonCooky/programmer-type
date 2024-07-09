export class ThemeManager {
  themeAttrTag = "theme";
  isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  selectedTheme = document.getElementById("theme-selected");

  setup() {
    // Set default theme
    this.setTheme();

    // Setup theme switching buttons
    document.getElementById("system-theme").addEventListener("click", () => {
      this.isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      this.selectedTheme.innerText = "System";
      this.setTheme();
    });

    document.getElementById("light-theme").addEventListener("click", () => {
      this.isDark = false;
      this.selectedTheme.innerText = "Light";
      this.setTheme();
    });

    document.getElementById("dark-theme").addEventListener("click", () => {
      this.isDark = true;
      this.selectedTheme.innerText = "Dark";
      this.setTheme();
    });
  }

  getThemeValue() {
    return this.isDark ? "dark" : "light";
  }

  setTheme() {
    document.documentElement.setAttribute(this.themeAttrTag, this.getThemeValue());
  }
}
