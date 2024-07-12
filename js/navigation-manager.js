import { ProblemSetManager } from "./problem-set-manager.js";

export class NavigationMangager {
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
      element: document.getElementById("problem-set-select"),
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

  /**
   * @param {Object} param0
   * @param {ProblemSetManager} param0.problemSetManager
   * @param {TimingManager} param0.timingManger
   */
  constructor({ problemSetManager, timingManger }) {
    this.problemSetManager = problemSetManager;
    this.timingManger = timingManger;
    this.currentKeyMap = this.keyMappings;
  }

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

    this.footerLabel.innerText = this.footerLabel.innerText === "*base*" ? key : `${this.footerLabel.innerText}-${key}`;
    this.currentKeyMap = newMap;
    this._evaluate();
  }
}
