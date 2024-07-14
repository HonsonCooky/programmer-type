export class NavigationMangager {
  keymap = {
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
    s: {
      element: document.getElementById("suite"),
      c: {
        element: document.getElementById("suite-csharp"),
        action: "click",
      },
      t: {
        element: document.getElementById("suite-typescript"),
        action: "click",
      },
    },
    t: {
      element: document.getElementById("theme"),
    },
    Enter: {
      element: document.getElementById("text-editor"),
    },
  };
  currentMap = this.keymap;
  footerElement = document.getElementById("key-context");

  constructor() {}

  _reset() {
    this.footerElement.innerText = "*base*";
    this.currentMap = this.keymap;
  }

  /** @param {KeyboardEvent} ev */
  keydown(ev) {
    let key = ev.key;

    const insert = this.currentMap[key];
    if (!insert || key === "Escape") {
      this._reset();
      return;
    }

    this.currentMap = insert;
    const { element, action } = insert;

    if (element && action) {
      element[action]();
      document.activeElement.blur();
      this._reset();
      return;
    }

    element.tabIndex = -1;
    element.focus();
    this.footerElement.innerText =
      this.footerElement.innerText === "*base*" ? key : `${this.footerElement.innerText}-${key}`;
  }
}
