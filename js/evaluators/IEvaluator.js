export class IEvaluator extends EventTarget {
  #quitPrimed = false;
  #lastRecord = 0;

  /**@type {Element[]}*/
  _tokens = [];
  _tokenIndex = 0;

  _loadTokens() {
    throw Error("Unimplemeneted '_loadTokens' method");
  }

  _evaluateKey() {
    throw Error("Unimplemeneted '_evaluateKey' method");
  }

  /** Indicate that this IContext is now in control */
  activate() {
    if (this._tokens.length === 0) {
      this._loadTokens();
      this._tokenIndex = 0;
    }
  }

  /** Indicate that this IContext has recieved an event worthy of resetting it's state */
  reset() {
    this._tokens = [];
    this._tokenIndex = 0;
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
    if (this._tokenIndex === 0) this.dispatchEvent(new Event("start"));
    this._evaluateKey(ev);
  }
}
