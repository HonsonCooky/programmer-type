import { IContext } from "./IContext.js";

export class TestContext extends IContext {
  constructor() {
    super();
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
