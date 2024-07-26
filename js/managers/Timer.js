import { IElementManager } from "./IElementManager.js";

export class Timer extends IElementManager {
  // Elements
  #displayValue = document.getElementById("timer-value");

  // In Memory Contents
  #duration = 60;
  #time = 0;
  #intervalId = null;
  #countUp = false;

  /** Prime the timer with the last know duration. */
  reset() {
    this.prime(this.#duration);
  }

  /** Get the current time value */
  getTime() {
    return this.#time;
  }

  /**
   * Ready the timer with the number of seconds for the next test. Without
   * being primed, the timer will not run. Thus, we have a system that can wait
   * for the users first input before starting.
   *
   * @param {number} seconds
   */
  prime(seconds) {
    if (this.#intervalId) this.stop();
    this.#duration = seconds;
    this.#time = seconds;
    this.#countUp = seconds === 0;
    this.render();
  }

  /** Start the timer. This requires the timer to be primed first. */
  run() {
    if (this.#intervalId) return;

    this.#intervalId = setInterval(() => {
      if (!this.#countUp && this.#time <= 0) this.stop();
      else {
        this.#countUp ? this.#time++ : this.#time--;
        this.dispatchEvent(new CustomEvent("tick", { detail: this.#time }));
        this.render();
      }
    }, 1000);
  }

  /** Detect if the timer is running */
  running() {
    return !!this.#intervalId;
  }

  /** Stop the timer without removing it's "primed" state. */
  pause() {
    if (!this.#intervalId) return;

    clearInterval(this.#intervalId);
    this.#intervalId = null;

    this.render();
  }

  /**
   * Stop the timer. Removing it's "primed" state, and resetting the timer back
   * to initial state.
   */
  stop(options) {
    if (!this.#intervalId) return;

    clearInterval(this.#intervalId);
    this.#intervalId = null;
    this.#time = this.#duration;
    this.#countUp = false;

    this.render();
    this.dispatchEvent(new CustomEvent("stopped", { detail: options }));
  }

  /**@override*/
  render() {
    this.#displayValue.innerText = this.#time;
  }
}
