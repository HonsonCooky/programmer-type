/**
 * An instance of `IContext` represents a state of the program. It is
 * responsible for interpreting user input and linking events relevant to this
 * context.
 *
 * These elements also extend `EventTarget`, such that their updates can
 * broadcast to the rest of the application.
 */
export class IContext extends EventTarget {
  /** Indicate that this IContext is now in control */
  activate() {
    throw Error("Unimplemeneted 'activate' method");
  }

  /** Indicate that this IContext has recieved an event worthy of switching control */
  deactivate() {
    throw Error("Unimplemeneted 'deactivate' method");
  }

  /** Indicate that the main content has been focused */
  contentFocused() {
    throw Error("Unimplemeneted 'contentFocused' method");
  }

  /** Indicate that the main content has been unfocused */
  contentUnfocused() {
    throw Error("Unimplemeneted 'contentUnfocused' method");
  }

  /** @param {KeyboardEvent} ev */
  keydown(ev) {
    throw Error("Unimplemeneted 'keydown' method");
  }

  /**
   * @param {string} str
   * @param {any} info
   */
  dispatchEvent(str, info) {
    super.dispatchEvent(new CustomEvent(str, { details: info }));
  }
}
