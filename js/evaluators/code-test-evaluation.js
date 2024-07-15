import { IEvaluator } from "./ievaluator.js";

export class CodeTestEvaluation extends IEvaluator {
  _backspaceCounter = 0;

  /** @param {KeyboardEvent} ev */
  _codeEvaluationBackspace(ev) {
    let newIndex = this._testIndex - 1;
    if (ev.ctrlKey) newIndex = this._testLastWord.length > 0 ? this._testLastWord.pop() + 1 : 0;
    if (newIndex < 0) newIndex = 0;

    this._backspaceCounter += this._testIndex - newIndex;
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
    if (char === " " || char === "\\n") this._testLastWord.push(this._testIndex);

    // Char Eval
    if (key === char || (key === "Enter" && char === "\\n")) element.className = "correct";
    else {
      if (char === " ") element.innerText = "_";
      element.className = "invalid";
    }
    this._testIndex++;
  }

  reset() {
    super.reset();
    this._backspaceCounter = 0;
  }

  /**
   * @returns {{
   *   index: number,
   *   seq: {char: string, element: HTMLElement}[]
   * }}
   */
  results() {
    return {
      index: this._testIndex,
      seq: this._testSequence,
      backspaces: this._backspaceCounter,
    };
  }

  /**
   * @param {KeyboardEvent} ev
   * @returns {boolean}
   */
  evaluate(ev) {
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

  /**
   * @param {Object} param0
   * @param {string} param0.currentTest
   * @param {HTMLElement} param0.textEditorElement
   */
  load({ currentTest, textEditorElement }) {
    try {
      this._textEditorElement = textEditorElement;
      this._textEditorElement.innerHTML = currentTest
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

      this._testSequence = Array.from(this._textEditorElement.children)
        .map((line) => Array.from(line.children).map((c) => ({ char: c.innerText, element: c })))
        .flat();
      this._testIndex = 0;
    } catch (e) {
      textEditorElement.innerHTML = `<span class="error">Unable to load test</span>`;
      console.error(e);
    }
  }
}
