/**
 * Context Interface: Contexts are states of the program that can respond to
 * keyboard inputs.
 */
export class IContext extends EventTarget {
  constructor() {
    super();
  }

  /**
   * Redirect `window.addEventListener("keydown")` to this function when the
   * state of the program calls for this context to handle the keyboard input.
   *
   * @param {KeyboardEvent} ev
   */
  keydown(ev) {
    throw Error("Unimplemented keydown function");
  }
}
