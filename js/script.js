import { IContext } from "./contexts/IContext.js";
import { NavContext } from "./contexts/Nav.js";
import { TestContext } from "./contexts/Test.js";
import { SharedState } from "./singletons/SharedState.js";

export const PTShared = new SharedState();

export class Program {
  /** @type {IContext} */
  #currentContext;

  constructor() {
    const navContext = new NavContext();
    const testContext = new TestContext();

    this.#currentContext = navContext;

    navContext.addEventListener("release", () => {
      this.#currentContext.deactivate();
      this.#currentContext = testContext;
      this.#currentContext.activate();
    });

    testContext.addEventListener("release", () => {
      this.#currentContext.deactivate();
      this.#currentContext = navContext;
      this.#currentContext.activate();
    });

    this.#currentContext.activate();

    window.addEventListener("keydown", (ev) => this.#currentContext.keydown(ev));
  }
}

new Program();
