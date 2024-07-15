export class IEvaluator {
  _testIndex = 0;
  _testLastWord = [];
  _testSequence = [];
  _textEditorElement = undefined;

  reset() {
    this._testIndex = 0;
    this._testLastWord = [];
    this._testSequence = [];
  }

  /**
   * @returns {{
   *   index: number,
   *   seq: {char: string, element: HTMLElement}[]
   * }}
   */
  results() {
    throw Error("Unimplemented Method");
  }

  /**
   * @param {KeyboardEvent} ev
   * @returns {boolean}
   */
  evaluate(ev) {
    throw Error("Unimplemented Method");
  }

  /**
   * @param {Object} param0
   * @param {string} param0.currentTest
   * @param {HTMLElement} param0.textEditorElement
   */
  load({ currentTest, textEditorElement }) {
    throw Error("Unimplemented Method");
  }
}
