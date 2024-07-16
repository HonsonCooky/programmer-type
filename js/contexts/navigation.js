import { IContext } from "./icontext.js";

export class Navigation extends IContext {
  keymap = {
    "ctrl+d": {
      action: () => {
        const textEditorElement = document.getElementById("text-editor");
        textEditorElement.scrollBy({ top: window.innerHeight / 10 });
      },
    },
    "ctrl+u": {
      action: () => {
        const textEditorElement = document.getElementById("text-editor");
        textEditorElement.scrollBy({ top: -(window.innerHeight / 10) });
      },
    },
    c: {
      element: document.getElementById("cache-btn"),
      action: "click",
    },
    d: {
      element: document.getElementById("duration"),
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
    i: {
      element: document.getElementById("info"),
    },
    s: {
      element: document.getElementById("suite"),
      c: {
        element: document.getElementById("suite-csharp"),
        action: "click",
      },
      f: {
        element: document.getElementById("suite-fsharp"),
        action: "click",
      },
      t: {
        element: document.getElementById("suite-typescript"),
        action: "click",
      },
      v: {
        element: document.getElementById("suite-vim"),
        action: "click",
      },
    },
    t: {
      element: document.getElementById("theme"),
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
    Enter: {
      element: document.getElementById("text-editor"),
    },
  };
  currentMap = this.keymap;
  footerElement = document.getElementById("key-context");

  _reset() {
    document.activeElement.blur();
    this.footerElement.innerText = "*base*";
    this.currentMap = this.keymap;
  }

  /** @param {KeyboardEvent} ev */
  keydown(ev) {
    let key = ev.key;
    if (ev.ctrlKey) {
      if (ev.key === "Control") return;
      key = `ctrl+${ev.key}`;
    }

    const insert = this.currentMap[key];
    const baseCase = this.keymap[key];

    if ((!insert && !baseCase?.action) || key === "Escape") {
      this._reset();
      return;
    }

    if (!insert) {
      if (baseCase.action) {
        ev.preventDefault();
        baseCase.action();
        return;
      }
    }

    this.currentMap = insert;
    const { element, action } = this.currentMap;
    if (!element) return;

    if (action) {
      ev.preventDefault();
      element[action]();
      this._reset();
      return;
    }

    if (key === "Enter") {
      console.log("here");
      ev.preventDefault();
      this._reset();
      element.tabIndex = -1;
      element.focus();
      return;
    }

    ev.preventDefault();
    element.tabIndex = -1;
    element.focus();
    this.footerElement.innerText =
      this.footerElement.innerText === "*base*" ? key : `${this.footerElement.innerText}-${key}`;
  }
}
