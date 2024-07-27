import { IEvaluator } from "./IEvaluator.js";

export class ActionEvaluator extends IEvaluator {
  /**@override*/
  _loadTokens() {
    const testDiv = document.querySelector(".test");

    if (!testDiv) {
      this._tokens = [];
      this._tokenIndex = 0;
      return;
    }

    if (!testDiv.classList.contains("action")) {
      console.error("Wrong evaluator used for current test");
      return;
    }

    this._tokenIndex = 0;
    this._tokens = Array.from(testDiv.children)
      .map((line) => Array.from(line.children))
      .flat();

    this._tokens[0]?.scrollIntoView();
    this._tokens.forEach((t) => {
      t.classList.remove("selected");
      t.classList.remove("correct");
      t.classList.remove("incorrect");
    });
  }

  /**@override*/
  _evaluateKey() {}
}
