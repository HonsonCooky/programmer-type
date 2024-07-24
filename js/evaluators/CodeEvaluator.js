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
    this.#highlightNextToken();
  }

  /**
   * Ensure the expected character is indicated.
   */
  #highlightNextToken() {
    const nextCharElement = this._tokens[this._tokenIndex];
    if (!nextCharElement) return this.dispatchEvent("end");
    nextCharElement.className = "selected";
    nextCharElement.scrollIntoView();
  }

  /**
   * @override
   */
  _loadTokens() {
    this._tokens = Array.from(document.querySelector(".test").children)
      .map((line) => Array.from(line.children))
      .flat();
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
    this.#highlightNextToken();
  }
}
