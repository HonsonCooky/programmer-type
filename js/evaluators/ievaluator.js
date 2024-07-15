export class IEvaluator {
  _testIndex = 0;
  _testLastWord = [];
  _testSequence = [];

  reset() {
    throw Error("Unimplemented Method");
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

  /**@param {string} currentTest */
  load(currentTest) {
    throw Error("Unimplemented Method");
  }
}
