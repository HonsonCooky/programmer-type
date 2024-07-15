import { ActionTestEvaluation } from "../evaluators/action-test-evaluation.js";
import { CodeTestEvaluation } from "../evaluators/code-test-evaluation.js";
import { IEvaluator } from "../evaluators/ievaluator.js";

export class TextEditor extends EventTarget {
  textEditorElement = document.getElementById("text-editor");
  _fontSize = 1;
  _textEditorInstructionsElement = document.getElementById("text-editor-instructions");
  _quitPrimed = false;
  /**@type {IEvaluator}*/
  _codeEvaluator = undefined;
  /**@type {IEvaluator}*/
  _actionEvaluator = undefined;
  /**@type {IEvaluator|undefined}*/
  _currentEvaluator = undefined;

  constructor() {
    super();

    this._codeEvaluator = new CodeTestEvaluation();
    this._actionEvaluator = new ActionTestEvaluation();

    this._updateFontSize(0);
    this.textEditorElement.addEventListener(
      "click",
      function() {
        this.textEditorElement.tabIndex = -1;
        this.textEditorElement.focus();
      }.bind(this),
    );
    this._textEditorInstructionsElement.innerText = "[Enter] Start";

    this._maxHeightCalc();
    window.addEventListener("resize", this._maxHeightCalc.bind(this));
  }

  /** @param {number} increment  */
  _updateFontSize(increment) {
    this._fontSize += increment;
    if (this._fontSize < -2) this._fontSize = -2;
    if (this._fontSize > 5) this._fontSize = 5;
    this.textEditorElement.style.fontSize = `var(--fs-${this._fontSize})`;
    Array.from(this.textEditorElement.querySelectorAll(".line")).forEach(
      (e) => (e.style.minHeight = `var(--fs-${this._fontSize})`),
    );
  }

  _maxHeightCalc() {
    this.textEditorElement.style.maxHeight = window.getComputedStyle(this.textEditorElement).height;
  }

  focusTextEditor() {
    this._textEditorInstructionsElement.innerText = "[:q] Quit, [Ctrl +] Increase Font, [Ctrl -] Decrease Font";
  }

  blurTextEditor() {
    this._textEditorInstructionsElement.innerText = "[Enter] Start";
  }

  resultsShowing() {
    this._textEditorInstructionsElement.innerText = "[Enter | Esc | q] Done";
  }

  resultsHide() {
    this._textEditorInstructionsElement.innerText = "[Enter] Start";
  }

  /**@param {boolean} noBlur */
  reset(noBlur) {
    this._quitPrimed = false;
    if (!noBlur) this.textEditorElement.blur();
    this.textEditorElement.innerHTML = "";
  }

  /** @returns {{
   * invalid: number,
   * correct: number,
   * backspaces: number|undefined,
   * }} */
  analyseTest() {
    // Nothing to analyze - likely because reset has been called twice
    const { seq, backspaces } = this._currentEvaluator.results();
    let invalid = 0;
    let correct = 0;
    for (const i of seq) {
      if (i.element.classList.contains("correct")) correct++;
      if (i.element.classList.contains("invalid")) invalid++;
      if (i.element.classList.length === 0) break;
    }

    return { invalid, correct, backspaces };
  }

  loadingTest() {
    this.textEditorElement.innerText = "Loading...";
  }

  loadTestSuite(suite, currentTest) {
    this.suite = suite;

    // Load analysis sequence
    if (this.suite.type === "Code") this._currentEvaluator = this._codeEvaluator;
    else this._currentEvaluator = this._actionEvaluator;

    this._currentEvaluator.load({ currentTest, textEditorElement: this.textEditorElement });
    this._updateFontSize(0);
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

    // Whilst loading another test, wait for the reset
    const key = ev.key;
    const ctrl = ev.ctrlKey;

    // Font update
    if (ctrl && key === "+") return this._updateFontSize(1);
    if (ctrl && key === "-") return this._updateFontSize(-1);

    if (this.isModifierKey(key)) return;

    // Force Quit
    if (key === ":") this._quitPrimed = true;
    else if (this._quitPrimed && key !== "q") this._quitPrimed = false;
    if (this._quitPrimed && key === "q") {
      this.dispatchEvent(new Event("testForceFinished"));
      return;
    }

    // Evaluate keypress
    if (!this._currentEvaluator) {
      console.error("Can't evaluate input, no evaluator");
      return;
    }

    const isDone = this._currentEvaluator.evaluate(ev);

    // Finished Test
    if (isDone) {
      this.dispatchEvent(new Event("testCompleted"));
      return;
    }
  }
}
