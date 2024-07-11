import { ProblemSetManager } from "./problem-set-manager.js";

class NavigationKeyboardManager {
  footerLabel = document.getElementById("key-context");

  keyMappings = {
    d: {
      element: document.getElementById("duration-select"),
      0: {
        element: document.getElementById("duration-15"),
        action: "click",
      },
      1: {
        element: document.getElementById("duration-30"),
        action: "click",
      },
      2: {
        element: document.getElementById("duration-60"),
        action: "click",
      },
      3: {
        element: document.getElementById("duration-90"),
        action: "click",
      },
      4: {
        element: document.getElementById("duration-120"),
        action: "click",
      },
      5: {
        element: document.getElementById("duration-infinite"),
        action: "click",
      },
    },
    g: {
      element: document.getElementById("play"),
      action: "click",
      avoidReset: true,
    },
    h: {
      element: document.getElementById("help"),
    },
    p: {
      element: document.getElementById("duration-select"),
    },
    t: {
      element: document.getElementById("theme-select"),
      d: {
        element: document.getElementById("dark-theme"),
        action: "click",
      },
      l: {
        element: document.getElementById("light-theme"),
        action: "click",
      },
      s: {
        element: document.getElementById("system-theme"),
        action: "click",
      },
    },
  };

  currentKeyMap = this.keyMappings;

  _reset() {
    document.activeElement.blur();
    this.currentKeyMap = this.keyMappings;
    this.footerLabel.innerText = "*base*";
    return;
  }

  _evaluate() {
    const { element, action, avoidReset } = this.currentKeyMap;
    if (action && element) {
      if (typeof action === "string") {
        element[action]();
      } else {
        action(element);
      }

      if (!avoidReset) this._reset();
      return;
    }

    if (element) {
      element.tabIndex = -1;
      element.focus();
    }
  }

  /**
   * @param {KeyboardEvent} ev
   */
  keydown(ev) {
    let key = ev.key.toLowerCase();

    let newMap = this.currentKeyMap[key];

    // Invalid keypress OR purposeful escape
    if (!newMap || key === "escape") {
      this._reset();
      return;
    }

    this.currentKeyMap = newMap;
    this._evaluate();
  }
}

export class NavigationMangager {
  /**
   * @param {Object} param0
   * @param {ProblemSetManager} param0.problemSetManager
   */
  constructor({ problemSetManager }) {
    this.problemSetManager = problemSetManager;
    this.currentKeyMap = this.keyMappings;
    this.keyboardManager = new NavigationKeyboardManager();
  }

  _onSetsLoaded() {
    const problemSetDropdownContent = document.getElementById("problem-set-select").querySelector(".dropdown-content");
    for (const set of this.problemSetManager.sets) {
      const btn = document.createElement("button");
      btn.innerText = set.title;
      btn.addEventListener("click", () => {
        this.problemSetManager.selectSet(set);
      });
      problemSetDropdownContent.appendChild(btn);
    }
  }

  _onSetSelected() {
    // Update Label
    const problemSetLabel = document.getElementById("problem-set-selected");
    problemSetLabel.innerText = this.problemSetManager.selectedSet.title;

    // Highlight Selected
    Array.from(document.getElementById("problem-set-select").querySelector(".dropdown-content").children).forEach(
      (child) => {
        if (child.innerText === this.problemSetManager.selectedSet.title) child.style.color = "var(--rose)";
        else child.style.color = "var(--text)";
      },
    );
  }

  setup() {
    this.problemSetManager.addEventListener("setsLoaded", this._onSetsLoaded.bind(this));
    this.problemSetManager.addEventListener("setSelected", this._onSetSelected.bind(this));
  }

  /**
   * @param {KeyboardEvent} ev
   */
  keydown(ev) {
    this.keyboardManager.keydown(ev);
  }
}
