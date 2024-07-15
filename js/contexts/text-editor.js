export class TextEditor extends EventTarget {
  fontSize = 1;
  textEditorElement = document.getElementById("text-editor");
  textEditorInstructionsElement = document.getElementById("text-editor-instructions");
  _testLastSpace = [];

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
    this._analyseTest();
    this._quitPrimed = false;
    this._testLastSpace = [];
    this._testIndex = 0;
    if (!noBlur) this.textEditorElement.blur();
    this._testSequence.forEach((sc) => {
      sc.element.innerText = sc.char;
      if (sc.char === "\\n") sc.element.className = "newline";
      else sc.element.className = "";
    });
  }

  _analyseTest() {
    // Nothing to analyze - likely because reset has been called twice
    if (this._testSequence[0].element.classList.length === 0) return;

    let invalid = 0;
    let correct = 0;
    for (const i of this._testSequence) {
      if (i.element.classList.contains("correct")) correct++;
      if (i.element.classList.contains("invalid")) invalid++;
      if (i.element.classList.length === 0) break;
    }

    this._testAnalysis = { invalid, correct };
  }

  /** @param {KeyboardEvent} ev */
  _codeEvaluationBackspace(ev) {
    let newIndex = this._testIndex - 1;
    if (ev.ctrlKey) newIndex = this._testLastSpace.length > 0 ? this._testLastSpace.pop() + 1 : 0;
    if (newIndex < 0) newIndex = 0;

    this._testSequence.slice(newIndex, this._testIndex + 1).forEach((sc) => {
      sc.element.innerText = sc.char;
      if (sc.char === "\\n") sc.element.className = "newline";
      else sc.element.className = "";
    });
    this._testIndex = newIndex;
  }

  /** @param {string} key */
  _codeEvaluationCharacter(key) {
    const { char, element } = this._testSequence[this._testIndex];

    if (!char) {
      console.error("Test failed, unable to access next character");
      return;
    }

    // New line
    if (char === " " || char === "\\n") this._testLastSpace.push(this._testIndex);
    if (key === char || (key === "Enter" && char === "\\n")) element.className = "correct";
    else {
      if (char === " ") element.innerText = "_";
      element.className = "invalid";
    }
    this._testIndex++;
  }

  /** @param {KeyboardEvent} ev */
  _codeEvaluation(ev) {
    if (!this._testSequence) return;

    const key = ev.key;
    if (key === "Backspace") this._codeEvaluationBackspace(ev);
    else this._codeEvaluationCharacter(key);

    // Next Element
    const element = this._testSequence[this._testIndex].element;
    if (!element) return;
    element.className = "current";
    element.scrollIntoView();
  }

  _loadCodeEvaluation(currentTest) {
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

    this._testSequence = Array.from(this.textEditorElement.children)
      .map((line) => Array.from(line.children).map((c) => ({ char: c.innerText, element: c })))
      .flat();
    this._testIndex = 0;
  }

  _loadActionEvaluation(currentTest) {
    const objStr = currentTest.replace("module.export = ", "").replaceAll(";", "");
    const mod = eval(`(${objStr})`);
    const lines = Object.entries(mod);
    console.log(lines);
  }

  constructor() {
    super();

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
    if (this._testIndex >= this._testSequence.length) {
      this._reset(true);
    }
    this.textEditorInstructionsElement.innerText = "[:q] Quit, [Ctrl +] Increase Font, [Ctrl -] Decrease Font";
    this._testSequence[0].element.scrollIntoView();
  }

  blurTextEditor() {
    this.textEditorInstructionsElement.innerText = "[Enter] Start";
  }

  loadTestSuite(suite, currentTest) {
    this.suite = suite;

    // Load analysis sequence
    if (this.suite.type === "Code") return this._loadCodeEvaluation(currentTest);
    if (this.suite.type === "Action") return this._loadActionEvaluation(currentTest);
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
    ev.preventDefault();

    // Shouldn't be able to get here, but just in case
    if (this._testIndex >= this._testSequence.length) {
      this._reset();
      this.dispatchEvent(new Event("testFinished"));
      return;
    }

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

    if (this._testIndex >= this._testSequence.length) {
      this._reset();
      this.dispatchEvent(new Event("testFinished"));
      return;
    }
  }
}
