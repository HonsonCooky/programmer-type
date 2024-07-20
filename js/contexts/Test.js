import { PTShared } from "../script.js";
import { IContext } from "./IContext.js";
import { ActionEvaluator } from "./TestEvaluators/ActionEvaluator.js";
import { CodeEvaluator } from "./TestEvaluators/CodeEvaluator.js";

/** @typedef {import("../managers/FileLoader.js").SuiteItem["type"]} SuiteType*/

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

    this.#codeEvaluator.addEventListener("finish", PTShared.loadNextTest);
    this.#actionEvaluator.addEventListener("finish", PTShared.loadNextTest);
  }

  /** @returns {SuiteType|undefined} */
  #getTestType() {
    return document.getElementById("suite-value")?.innerText;
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
  contentFocused() {
    this.#currentEvaluator.contentFocused();
  }

  /**@override*/
  contentUnfocused() {
    this.#currentEvaluator.contentUnfocused();
    this.dispatchEvent("release");
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
    this.#currentEvaluator.keydown(ev);
  }
}
