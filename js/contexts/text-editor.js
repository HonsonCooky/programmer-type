export class TextEditor extends EventTarget {
  fontSize = 2;
  textEditorElement = document.getElementById("text-editor");
  textEditorInstructionsElement = document.getElementById("text-editor-instructions");
  _testAnalysisLastSpace = [];

  _updateFontSize(increment) {
    this.fontSize += increment;
    if (this.fontSize < -2) this.fontSize = -2;
    if (this.fontSize > 5) this.fontSize = 5;
    this.textEditorElement.style.fontSize = `var(--fs-${this.fontSize})`;
  }

  _maxHeightCalc() {
    this.textEditorElement.style.maxHeight = window.getComputedStyle(this.textEditorElement).height;
  }

  _reset(noBlur) {
    this._quitPrimed = false;
    this._testAnalysisLastSpace = [];
    this._testAnalysisIndex = 0;
    if (!noBlur) this.textEditorElement.blur();
    this._testAnalysisSequence.forEach((sc) => {
      sc.element.innerText = sc.char;
      if (sc.char === "\\n") sc.element.className = "newline";
      else sc.element.className = "";
    });
  }

  /** @param {KeyboardEvent} ev */
  _codeEvaluationBackspace(ev) {
    let newIndex = this._testAnalysisIndex - 1;
    if (ev.ctrlKey) newIndex = this._testAnalysisLastSpace.length > 0 ? this._testAnalysisLastSpace.pop() + 1 : 0;
    if (newIndex < 0) newIndex = 0;

    this._testAnalysisSequence.slice(newIndex, this._testAnalysisIndex + 1).forEach((sc) => {
      sc.element.innerText = sc.char;
      if (sc.char === "\\n") sc.element.className = "newline";
      else sc.element.className = "";
    });
    this._testAnalysisIndex = newIndex;
  }

  /** @param {string} key */
  _codeEvaluationCharacter(key) {
    const { char, element } = this._testAnalysisSequence[this._testAnalysisIndex];

    if (!char) {
      console.error("Test failed, unable to access next character");
      return;
    }

    // New line
    if (char === " " || char === "\\n") this._testAnalysisLastSpace.push(this._testAnalysisIndex);
    if (key === char || (key === "Enter" && char === "\\n")) element.className = "correct";
    else {
      if (char === " ") element.innerText = "_";
      element.className = "invalid";
    }
    this._testAnalysisIndex++;
  }

  /** @param {KeyboardEvent} ev */
  _codeEvaluation(ev) {
    if (!this._testAnalysisSequence) return;

    const key = ev.key;
    if (key === "Backspace") this._codeEvaluationBackspace(ev);
    else this._codeEvaluationCharacter(key);

    // Next Element
    const element = this._testAnalysisSequence[this._testAnalysisIndex].element;
    if (!element) return;
    element.className = "current";
    element.scrollIntoView();
  }

  _loadCodeEvaluation() {
    this._testAnalysisSequence = Array.from(this.textEditorElement.children)
      .map((line) => Array.from(line.children).map((c) => ({ char: c.innerText, element: c })))
      .flat();
    this._testAnalysisIndex = 0;
  }

  setup() {
    this._updateFontSize(0);
    this.textEditorElement.addEventListener(
      "click",
      function () {
        this.textEditorElement.tabIndex = -1;
        this.textEditorElement.focus();
      }.bind(this),
    );
    this.textEditorInstructionsElement.innerText = "[Enter] Start";

    this._maxHeightCalc;
    window.addEventListener("resize", this._maxHeightCalc.bind(this));
  }

  focusTextEditor() {
    if (this._testAnalysisIndex >= this._testAnalysisSequence.length) {
      this._reset(true);
    }
    this.textEditorInstructionsElement.innerText = "[:q] Quit, [Ctrl +] Increase Font, [Ctrl -] Decrease Font";
    this._testAnalysisSequence[0].element.scrollIntoView();
  }

  blurTextEditor() {
    this.textEditorInstructionsElement.innerText = "[Enter] Start";
  }

  loadTestSuite(suite, currentTest) {
    this.suite = suite;
    this.textEditorElement.innerHTML = currentTest
      .split(/\r?\n/g)
      .map((line) => {
        const indentLevel = (line.match(/^(\s+)/) || [""])[0].length;
        let chars = line
          .trim()
          .split("")
          .map((c) => `<span>${c}</span>`);
        chars.push('<span class="newline">\\n</span>');
        chars = chars.join("");

        return `<div class="line" style="margin-left:calc(var(--fs--2) * ${indentLevel})">${chars}</div>`;
      })
      .join("");

    // Load analysis sequence
    if (this.suite.type === "Code") return this._loadCodeEvaluation();
  }

  loadingTest() {
    this.textEditorElement.innerText = "Loading...";
  }

  /** @param {string} key */
  isModifierKey(key) {
    switch (key) {
      case "Shift":
      case "Control":
      case "Alt":
      case "Meta":
        return true;
      default:
        return false;
    }
  }

  /** @param {KeyboardEvent} ev */
  shouldStartTest(ev) {
    const key = ev.key;
    const ctrl = ev.ctrlKey;
    return ![this.isModifierKey(key), ctrl && key === "+", ctrl && key === "-"].includes(true);
  }

  /** @param {KeyboardEvent} ev */
  keydown(ev) {
    // Shouldn't be able to get here, but just in case
    if (this._testAnalysisIndex >= this._testAnalysisSequence.length) {
      this._reset();
      this.dispatchEvent(new Event("testFinished"));
      return;
    }
    ev.preventDefault();
    const key = ev.key;
    const ctrl = ev.ctrlKey;

    // Simple Commands
    if (ctrl && key === "+") return this._updateFontSize(1);
    if (ctrl && key === "-") return this._updateFontSize(-1);

    if (this.isModifierKey(key)) return;

    if (key === ":") this._quitPrimed = true;
    if (this._quitPrimed && key === "q") {
      this._reset();
      this.dispatchEvent(new Event("testFinished"));
      return;
    }

    if (this.suite?.type === "Code") return this._codeEvaluation(ev);

    if (this._testAnalysisIndex >= this._testAnalysisSequence.length) {
      this._reset();
      this.dispatchEvent(new Event("testFinished"));
      return;
    }
  }
}
