export class IEvaluator extends EventTarget {
  _testIndex = 0;
  _testLastWord = [];
  _testSequence = [];
  _textEditorElement = undefined;

  constructor() {
    super();
  }

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
    return {
      index: this._testIndex,
      seq: this._testSequence,
    };
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
