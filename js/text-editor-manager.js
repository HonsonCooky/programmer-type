import { TimeManager } from "./time-manager.js";

export class TextEditorManager {
  fontSize = 0;
  textEditorElement = document.getElementById("text-editor");
  textEditorInstructionsElement = document.getElementById("text-editor-instructions");

  constructor() {
    window.suiteManager.addEventListener("testUpdated", this._loadTextSuite.bind(this));

    this._updateFontSize(0);
    this.textEditorElement.style.maxHeight = window.getComputedStyle(this.textEditorElement).height;
    this.textEditorElement.addEventListener(
      "click",
      function () {
        this.textEditorElement.tabIndex = -1;
        this.textEditorElement.focus();
      }.bind(this),
    );
    this.textEditorElement.addEventListener(
      "focusin",
      function () {
        window.timeManager.prime();
        this.textEditorInstructionsElement.innerText = "[:q] Quit, [Ctrl +] Increase Font, [Ctrl -] Decrease Font";
      }.bind(this),
    );
    this.textEditorElement.addEventListener(
      "focusout",
      function () {
        this.textEditorInstructionsElement.innerText = "[Enter] Start";
        if (window.suiteManager.selectedSuite.type != "code") window.timeManager.pause();
      }.bind(this),
    );
    this.textEditorInstructionsElement.innerText = "[Enter] Start";

    this._nextTest();
  }

  _updateFontSize(increment) {
    this.fontSize += increment;
    if (this.fontSize < -2) this.fontSize = -2;
    if (this.fontSize > 5) this.fontSize = 5;
    this.textEditorElement.style.fontSize = `var(--fs-${this.fontSize})`;
  }

  _loadTextSuite() {
    this.textEditorElement.innerHTML = window.suiteManager.currentTest
      .split(/\r?\n/g)
      .map((line) => {
        let indentLevel = (line.match(/^(\s+)/) || [""])[0].length;
        const chars = line
          .trim()
          .split("")
          .map((c) => `<span>${c}</span>`)
          .join("");
        return `<div class="line" style="margin-left:calc(var(--fs--2) * ${indentLevel})">${chars}</div>`;
      })
      .join("");
  }

  _nextTest() {
    // Render loading screen
    this.textEditorElement.innerText = "Loading...";
    window.suiteManager.updateRandomTest();
  }

  /** @param {KeyboardEvent} ev */
  keydown(ev) {
    ev.preventDefault();
    const key = ev.key;
    const ctrl = ev.ctrlKey;

    if (window.timeManager.primed) window.timeManager.run();

    if (ctrl && key === "+") this._updateFontSize(1);
    if (ctrl && key === "-") this._updateFontSize(-1);
  }
}
