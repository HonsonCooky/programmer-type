import { IContext } from "../IContext.js";

export class ActionEvaluator extends IContext {
  #ready = false;
  #tokens = [];

  #loadTokens() {}

  #evaluateKey() {}

  /**@override*/
  activate() {
    this.#tokens = [];
    this.#loadTokens();
    this.#ready = true;
  }

  /**@override*/
  deactivate() {
    this.#ready = false;
    this.#tokens = [];
  }

  /**@override*/
  contentFocused() {
    console.log("Action Focused");
  }

  /**@override*/
  contentUnfocused() {
    console.log("Action Unfocused");
  }

  /**
   * @override
   * @param {KeyboardEvent} ev
   */
  keydown(ev) {
    if (!this.#ready) return;
    PTShared.runTimer();
    console.log("code", ev.key);
  }
}
