import { PTShared } from "../../script.js";
import { IContext } from "../IContext.js";

export class CodeEvaluator extends IContext {
  #ready = false;

  /**@type {number[]}*/
  #lastWhitespace = [];

  /**@type {Element[]}*/
  #tokens = [];
  #tokenIndex = 0;

  #loadTokens() {
    this.#tokens = Array.from(document.querySelector(".test").children)
      .map((line) => Array.from(line.children))
      .flat();
  }

  /** @param {KeyboardEvent} ev */
  #evaluateKey(ev) {
    if (ev.key === "Backspace") {
      if (ev.ctrlKey) return this.#controlBackspace();
      return this.#backspace();
    }

    const curCharElement = this.#tokens[this.#tokenIndex];
    const curChar = curCharElement.innerText;
    let key = ev.key;
    if (key === "Enter") key = "\\n";
    if (curChar === " " || curChar === "\\n") this.#lastWhitespace.push(this.#tokenIndex);

    if (key === curChar) curCharElement.className = "correct";
    else curCharElement.className = "incorrect";

    this.#tokenIndex++;
    const nextCharElement = this.#tokens[this.#tokenIndex];
    if (!nextCharElement) return this.dispatchEvent("finished");
    nextCharElement.className = "current";
  }

  #controlBackspace() {
    const lastWhitespace = this.#lastWhitespace.pop() ?? 0;
    const diff = Math.max(this.#tokenIndex - lastWhitespace, 1);
    for (let i = 1; i < diff; i++) this.#backspace();
  }

  #backspace() {
    const curCharElement = this.#tokens[this.#tokenIndex];
    const curChar = curCharElement.innerText;
    curCharElement.className = "";
    if (curChar === "\\n") curCharElement.className = "newline";
    if (curChar === " " || curChar === "\\n") this.#lastWhitespace.pop();

    this.#tokenIndex = Math.max(0, this.#tokenIndex - 1);
    const nextCharElement = this.#tokens[this.#tokenIndex];
    nextCharElement.className = "current";
  }

  isReady() {}

  /**@override*/
  activate() {
    this.#tokens = [];
    this.#loadTokens();
    this.#tokens[this.#tokenIndex].className = "current";
    this.#ready = true;
  }

  /**@override*/
  deactivate() {
    this.#ready = false;
  }

  /**@override*/
  contentFocused() {
    this.#ready = true;
  }

  /**@override*/
  contentUnfocused() {
    PTShared.pauseTimer();
    this.#ready = false;
  }

  /**
   * @override
   * @param {KeyboardEvent} ev
   */
  keydown(ev) {
    if (!this.#ready) return;
    PTShared.runTimer();
    ev.preventDefault();
    this.#evaluateKey(ev);
  }
}
