class ThemeManager {
  themeAttrTag = "theme";
  isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  selectedTheme = document.getElementById("theme-selected");

  constructor() {
    this.setTheme();
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

const themeManager = new ThemeManager();

class NavigationMangager {
  keymaps = {
    d: {
      element: document.getElementById("duration-select"),
    },
    l: {
      element: document.getElementById("language-select"),
    },
    t: {
      element: document.getElementById("theme-select"),
      s: {
        element: document.getElementById("system-theme"),
        action: "click",
      },
      l: {
        element: document.getElementById("light-theme"),
        action: "click",
      },
      d: {
        element: document.getElementById("dark-theme"),
        action: "click",
      },
    },
  };
  currentKeyPath = this.keymaps;

  constructor() {
    window.addEventListener("keydown", (event) => this.keyPress(event.key.toLowerCase()));
  }

  keyPress(key) {
    if (key === "escape") {
      this.escape();
      return;
    }

    let keyPath = this.currentKeyPath[key];

    if (!keyPath) {
      this.reset();
      return;
    }

    this.newKeyPath(keyPath, key);
  }

  escape() {
    this.reset();
  }

  reset() {
    document.getElementById("key-context").innerText = "*base*";
    document.activeElement.blur();
    this.currentKeyPath = this.keymaps;
  }

  newKeyPath(keyPath, key) {
    const keyPathIndicator = document.getElementById("key-context");
    if (keyPathIndicator.innerText === "*base*") keyPathIndicator.innerText = key;
    else keyPathIndicator.innerText += `-${key}`;

    this.currentKeyPath = keyPath;

    if (this.currentKeyPath.action) {
      if (this.currentKeyPath.element) this.currentKeyPath.element[this.currentKeyPath.action]();
      else this.currentKeyPath.action();
      this.reset();
      return;
    }

    if (this.currentKeyPath.element) {
      this.currentKeyPath.element.tabIndex = -1;
      this.currentKeyPath.element.focus();
    }
  }
}

const navigationManager = new NavigationMangager();
