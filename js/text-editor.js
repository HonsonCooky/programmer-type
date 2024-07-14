export class TextEditor {
  fontSize = 0;
  textEditorElement = document.getElementById("text-editor");
  textEditorInstructionsElement = document.getElementById("text-editor-instructions");

  _updateFontSize(increment) {
    this.fontSize += increment;
    if (this.fontSize < -2) this.fontSize = -2;
    if (this.fontSize > 5) this.fontSize = 5;
    this.textEditorElement.style.fontSize = `var(--fs-${this.fontSize})`;
  }

  setup() {
    this._updateFontSize(0);
    this.textEditorElement.style.maxHeight = window.getComputedStyle(this.textEditorElement).height;
    this.textEditorElement.addEventListener(
      "click",
      function() {
        this.textEditorElement.tabIndex = -1;
        this.textEditorElement.focus();
      }.bind(this),
    );
    this.textEditorInstructionsElement.innerText = "[Enter] Start";
  }

  focusTextEditor() {
    this.textEditorInstructionsElement.innerText = "[:q] Quit, [Ctrl +] Increase Font, [Ctrl -] Decrease Font";
  }

  blurTextEditor() {
    this.textEditorInstructionsElement.innerText = "[Enter] Start";
  }

  loadTestSuite(currentTest) {
    this.textEditorElement.innerHTML = currentTest
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

  loadingTest() {
    this.textEditorElement.innerText = "Loading...";
  }

  /** @param {KeyboardEvent} ev */
  keydown(ev) {
    ev.preventDefault();
    const key = ev.key;
    const ctrl = ev.ctrlKey;


    // Simple Commands
    if (ctrl && key === "+") this._updateFontSize(1);
    if (ctrl && key === "-") this._updateFontSize(-1);
  }
}
