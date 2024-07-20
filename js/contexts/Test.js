import { IContext } from "./IContext.js";
import { ActionEvaluator } from "./TestEvaluators/ActionEvaluator.js";
import { CodeEvaluator } from "./TestEvaluators/CodeEvaluator.js";

/** @typedef {import("../managers/FileLoader.js").SuiteItem["type"]} SuiteType*/

export class TestContext extends IContext {
  /**@type {IContext}*/
  #codeEvaluator;
  /**@type {IContext}*/
  #actionEvaluator;

  constructor() {
    super();
    this.#codeEvaluator = new CodeEvaluator();
    this.#actionEvaluator = new ActionEvaluator();
  }

  /** @returns {SuiteType|undefined} */
  #getTestType() {
    return document.getElementById("suite-value")?.innerText;
  }

  /** Indicate that this IContext is now in control */
  activate() {
    throw Error("Unimplemeneted 'activate' method");
  }

  /** Indicate that this IContext has recieved an event worthy of switching control */
  deactivate() {
    throw Error("Unimplemeneted 'deactivate' method");
  }

  /** @param {KeyboardEvent} ev */
  keydown(ev) {
    throw Error("Unimplemeneted 'keydown' method");
  }
}
