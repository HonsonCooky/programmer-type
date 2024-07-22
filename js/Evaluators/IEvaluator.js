export class IEvaluator extends EventTarget {
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

  keydown(ev) {
    if (this._tokens.length === 0) return;
    ev.preventDefault();
    this._evaluateKey(ev);
  }
}
