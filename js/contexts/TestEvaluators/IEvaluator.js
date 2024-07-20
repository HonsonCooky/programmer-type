import { PTShared } from "../../script.js";
import { IContext } from "../IContext.js";

export class IEvaluator extends IContext {
  _ready = false;
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
    if (this._tokens.length === 0) this._loadTokens();
    this._ready = true;
  }

  /** Indicate that this IContext has recieved an event worthy of switching control */
  deactivate() {
    this._ready = false;
  }

  /** Indicate that this IContext has recieved an event worthy of resetting it's state */
  reset() {
    this._ready = false;
    this._tokens = [];
    this._tokenIndex = 0;
  }

  keydown(ev) {
    if (!this._ready) return;
    PTShared.runTimer();
    ev.preventDefault();
    this._evaluateKey(ev);
  }
}
