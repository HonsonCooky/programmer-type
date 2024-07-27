/**
 * Evaluates key inputs and updates HTML elements to reciprocate test progress.
 */
export class KeyEvaluator extends EventTarget {
  #displayValue = document.getElementById("key-context");

  reset() {}

  /**@param {KeyboardEvent} ev */
  keydown(ev) {
    console.log(ev.key);
  }
}
