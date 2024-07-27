import { IEvaluator } from "./IEvaluator.js";

export class CodeEvaluator extends IEvaluator {
  /**@type {number[]}*/
  #lastWhitespace = [];

  /**
   * Call backspace from here to the last registered whitespace character.
   */
  #controlBackspace() {
    const lastWhitespace = this.#lastWhitespace[this.#lastWhitespace.length - 1] ?? 0;
    const diff = Math.max(this._tokenIndex - lastWhitespace, 0);
    for (let i = 0; i < diff; i++) this.#backspace();
  }

  /**
   * Send revert changes made to currently selected character, and move the token index back one.
   */
  #backspace() {
    const curCharElement = this._tokens[this._tokenIndex];
    const curChar = curCharElement.innerText;
    curCharElement.className = "";
    if (curChar === "\\n") curCharElement.className = "newline";

    this._tokenIndex = Math.max(0, this._tokenIndex - 1);
    const nextCharElement = this._tokens[this._tokenIndex];
    const nextChar = nextCharElement.innerText;
    if (nextChar === " " || nextChar === "\\n") this.#lastWhitespace.pop();
  }

  /**@override*/
  _loadTokens() {
    const testDiv = document.querySelector(".test");

    if (!testDiv) {
      this._tokens = [];
      this._tokenIndex = 0;
      return;
    }

    if (!testDiv.classList.contains("code")) {
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

  /**
   * @override
   * @param {KeyboardEvent} ev
   */
  _evaluateKey(ev) {
    if (ev.key === "Backspace") {
      if (ev.ctrlKey) return this.#controlBackspace();
      return this.#backspace();
    }

    const curCharElement = this._tokens[this._tokenIndex];
    const curChar = curCharElement.innerText;
    let key = ev.key;
    if (key === "Enter") key = "\\n";
    if (curChar === " " || curChar === "\\n") this.#lastWhitespace.push(this._tokenIndex);

    if (key === curChar) curCharElement.className = "correct";
    else curCharElement.className = "incorrect";
    this._tokenIndex++;
  }
}
