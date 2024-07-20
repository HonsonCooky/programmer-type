import { PTShared } from "../script.js";
import { IContext } from "./IContext.js";
import { ActionEvaluator } from "./TestEvaluators/ActionEvaluator.js";
import { CodeEvaluator } from "./TestEvaluators/CodeEvaluator.js";

export class TestContext extends IContext {
  #quitPrimed = false;

  /**@type {IContext}*/
  #codeEvaluator;
  /**@type {IContext}*/
  #actionEvaluator;
  /**@type {IContext}*/
  #currentEvaluator;

  constructor() {
    super();
    this.#codeEvaluator = new CodeEvaluator();
    this.#actionEvaluator = new ActionEvaluator();

    const newTest = function () {
      this.#currentEvaluator.reset();
      PTShared.loadNextTest().then(() => this.#currentEvaluator.activate());
    }.bind(this);

    this.#codeEvaluator.addEventListener("end", newTest);
    this.#actionEvaluator.addEventListener("end", newTest);
  }

  /**
   * Determines if some keydown event is a modifier. If so, it doesn't need to
   * be evaluated.
   *
   * @param {KeyboardEvent} ev
   * @returns {boolean}
   */
  #isModifierKey(ev) {
    return ["shift", "control", "alt", "meta"].includes(ev.key.toLowerCase());
  }

  /**@override*/
  activate() {
    PTShared.setContextText("[:q] QUIT");

    const suite = PTShared.getSuite();
    if (suite.type === "Code") this.#currentEvaluator = this.#codeEvaluator;
    else this.#currentEvaluator = this.#actionEvaluator;

    this.#currentEvaluator.activate();
  }

  /**@override*/
  deactivate() {
    this.#currentEvaluator.deactivate();
  }

  /**@override*/
  reset() {
    this.#codeEvaluator.reset();
    this.#actionEvaluator.reset();
  }

  /**
   * @override
   * @param {KeyboardEvent} ev
   */
  keydown(ev) {
    if (!this.#currentEvaluator) {
      console.error("Can't evaluate test without an evaluator");
      return;
    }

    if (this.#isModifierKey(ev)) return;
    if (this.#quitPrimed && ev.key.toLowerCase() === "q") return this.dispatchEvent("finish");
    if (ev.key === ":") this.#quitPrimed = true;
    this.#currentEvaluator.keydown(ev);
  }
}
