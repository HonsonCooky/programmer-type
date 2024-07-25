/**
 * `IEvaluator` interfaces are used to evaluate inputs for tests. Different
 * test types have different actions upon user input. Some simply ensure that
 * characters match up, some will inflict some action upon certain character
 * entries. The Evaluator will determine what to do with the input, and also
 * load the HTML contents to be evaluated for the test. Furthermore, they will
 * update the UI to indicate these changes.
 */
export class IEvaluator extends EventTarget {
  #quitPrimed = false;
  #lastRecord = 0;

  /**@type {Element[]}*/
  _tokens = [];
  _tokenIndex = 0;

  /** This is the only thing unique to each Evaluator */
  _evaluateKey() {
    throw Error("Unimplemeneted '_evaluateKey' method");
  }

  /** Ensure the expected input is indicated. */
  #highlightNextToken() {
    const nextCharElement = this._tokens[this._tokenIndex];
    if (!nextCharElement) return this.dispatchEvent(new Event("reload"));
    nextCharElement.className = "selected";
    nextCharElement.scrollIntoView();
  }

  /**Load HTML elements into the _tokens array, such that they can be evaluated later.*/
  loadTokens() {
    this._tokenIndex = 0;
    this._tokens = Array.from(document.querySelector(".test").children)
      .map((line) => Array.from(line.children))
      .flat();

    this._tokens.forEach((t) => {
      t.classList.remove("selected");
      t.classList.remove("correct");
      t.classList.remove("incorrect");
    });
  }

  /** @returns {{correct: number, incorrect: number, index: number}}*/
  getRecord() {
    if (this._tokens.length === 0) return undefined;

    const correctCount = this._tokens
      .slice(this.#lastRecord, this._tokenIndex)
      .map((e) => e.classList.contains("correct"))
      .reduce(
        (p, b) => {
          if (b) p.correct += 1;
          else p.incorrect += 1;
          return p;
        },
        { correct: 0, incorrect: 0 },
      );
    correctCount.index = this._tokenIndex;

    this.#lastRecord = this._tokenIndex;
    return correctCount;
  }

  /** @param {KeyboardEvent} ev */
  keydown(ev) {
    if (this._tokens.length === 0) return;
    ev.preventDefault();

    // Quit mechanics
    if (this.#quitPrimed && ev.key === "q") {
      this.dispatchEvent(new Event("quit"));
      return;
    }
    if (ev.key === ":") this.#quitPrimed = true;
    else this.#quitPrimed = false;

    // Evaluate key input
    this.dispatchEvent(new Event("run"));
    this._evaluateKey(ev); // Implementation specific
    this.#highlightNextToken();
  }
}
