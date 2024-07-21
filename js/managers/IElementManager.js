/**
 * An instance of `IElementManager` represents a class that is responsible for
 * some component on screen. It is the only one that can update the values of
 * said elements, and is responsible for their state, and the logic to update
 * their state.
 *
 * These elements also extend `EventTarget`, such that their updates can
 * broadcast to the rest of the application.
 */
export class IElementManager extends EventTarget {
  /**
   * Render the elements on screen based on the internal state of this manager.
   * No parameters, no output, all is done internally.
   */
  render() {
    throw Error("Unimplemeneted 'render' method");
  }
}
