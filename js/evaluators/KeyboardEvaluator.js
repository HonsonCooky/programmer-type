export class KeyboardEvaluator extends EventTarget {
  // Elements
  #contentDisplayPane = Object.freeze(document.getElementById("_enter_content"));
  #contextDisplayText = document.getElementById("content-context");
  #displayValue = document.getElementById("key-context");

  // Nav Items
  /**@type {string[]}*/
  #keySeq = [];
  #fontSize = 1;
  #selectedElement = document.activeElement;

  // Test Items
  /**@type {Element[]}*/
  #running = false;
  #tokens = [];
  #tokenIndex = 0;
  #commandPrimed = false;

  constructor() {
    super();

    this.#contentDisplayPane.addEventListener("focusin", () => {
      if (this.#isContentTest()) this.#contextDisplayText.innerText = "[:q] Quit";
      else this.#contextDisplayText.innerText = "[Escape] Unfocus, [j] Scroll Down, [k] Scroll Up";
    });

    this.#contentDisplayPane.addEventListener("focusout", () => {
      this.#contextDisplayText.innerText = "[Enter] Focus, [r] Reload Test";
    });

    this.#contextDisplayText.innerText = "[Enter] Focus, [r] Reload Test";
    this.#render();
  }

  #isContentTest() {
    return document.activeElement === this.#contentDisplayPane && !!this.#contentDisplayPane.querySelector(".test");
  }

  #resetNav() {
    this.#keySeq = [];
    document.activeElement.blur();
    this.#render();
  }

  #activeDropdowns() {
    return Array.from(document.querySelectorAll(".dropdown-content"))
      .filter((dc) => getComputedStyle(dc).display === "flex")
      .map((dc) => dc.parentElement);
  }

  /**@param {KeyboardEvent} ev */
  #navEvaluation(ev) {
    const key = ev.key;
    this.#running = false;

    // Alter Font Size
    if (ev.ctrlKey) {
      if (key === "+") {
        ev.preventDefault();
        this.#fontSize = Math.max(-2, Math.min(this.#fontSize + 1, 5));
        this.#render();
        return;
      }
      if (key === "-") {
        ev.preventDefault();
        this.#fontSize = Math.max(-2, Math.min(this.#fontSize - 1, 5));
        this.#render();
        return;
      }
    }

    if (document.activeElement === this.#contentDisplayPane) {
      if (key === "j") {
        this.#contentDisplayPane.scrollBy({ top: 50 });
      }
      if (key === "k") {
        this.#contentDisplayPane.scrollBy({ top: -50 });
      }
      if (key === "Escape") {
        this.#resetNav();
      }
      return;
    }

    // Escape navigation context
    if (key === "Escape") {
      ev.preventDefault();
      this.#resetNav();
      return;
    }

    if (key === "r") {
      ev.preventDefault();
      this.dispatchEvent(new Event("reload"));
      return;
    }

    // Hovered Dropdowns in base case
    if (this.#keySeq.length === 0) {
      const activeDropdowns = this.#activeDropdowns();
      const activeElement = activeDropdowns[0] ?? document.activeElement ?? document.body;
      const activeKeyMatches = activeElement.id.match(/_(.*?)_/);
      this.#keySeq = activeKeyMatches ? [activeKeyMatches[1]] : [];
    }

    // Find element whos ID matches this key sequenence
    this.#keySeq.push(ev.key.toLowerCase());
    this.#selectedElement = document.querySelector(`[id^="_${this.#keySeq.join("")}_"]`);

    // Reset if invalid
    if (!this.#selectedElement) {
      this.#resetNav();
      return;
    }

    // Focus Divs, Click all other elements
    if (this.#selectedElement.tagName === "DIV") {
      this.#selectedElement.tabIndex = -1;
      this.#selectedElement.focus();
    } else {
      this.#resetNav();
      this.#selectedElement.click();
    }

    this.#render();
  }

  /**@param {KeyboardEvent} ev */
  #testEvaluation(ev) {
    //if (this._tokens.length === 0) return;
    ev.preventDefault();

    // Command Mechanics
    if (this.#commandPrimed) {
      if (ev.key === "q") {
        this.dispatchEvent(new Event("quit"));
        return;
      }
      // TODO: Remove on publish - Cheat to finish test quickly
      if (ev.key === "~") {
        this._tokens.slice(0, -2).forEach((e) => e.classList.add("correct"));
        this._tokenIndex = this._tokens.length - 2;
        //this.#highlightNextToken();
        return;
      }
    }

    if (ev.key === ":") this.#commandPrimed = true;
    else this.#commandPrimed = false;
  }

  #render() {
    this.#displayValue.innerText = this.#keySeq.length > 0 ? this.#keySeq.join("-") : "*base*";
    this.#contentDisplayPane.style.fontSize = `var(--fs-${this.#fontSize})`;
  }

  reset(usingMouse) {
    this.#running = false;
    this.#displayValue.innerText = "*base*";
    if (usingMouse) this.#displayValue.innerHTML = `<div class="error">MOUSE USED!<div>`;
  }

  /**@param {KeyboardEvent} ev */
  keydown(ev) {
    if (this.#isContentTest()) {
      if (!this.#running) {
        this.#running = true;
        this.dispatchEvent(new CustomEvent("start"));
      }
      this.#testEvaluation(ev);
    } else {
      this.#navEvaluation(ev);
    }
  }
}
