class ThemeManager {
  themeAttrTag = "theme";
  isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  constructor() {
    this.setTheme();
  }

  getThemeValue() {
    return this.isDark ? "dark" : "light";
  }

  setTheme() {
    document.documentElement.setAttribute(this.themeAttrTag, this.getThemeValue());
  }

  toggleTheme() {
    this.isDark != this.isDark;
    this.setTheme();
  }
}

class NavigationPanel {}

const themeManager = new ThemeManager();
