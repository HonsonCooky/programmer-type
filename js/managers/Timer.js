import { IElementManager } from "./IElementManager.js";

export class Timer extends IElementManager {
  // Elements
  #displayValue = document.getElementById("timer-value");

  // In Memory Contents
  #time;
  #intervalId;
  #countUp;

  constructor() {
    super();
    this.#time = 0;
    this.#intervalId = null;
    this.#countUp = false;
  }

  /**
   * Ready the timer with the number of seconds for the next test. Without
   * being primed, the timer will not run. Thus, we have a system that can wait
   * for the users first input before starting.
   *
   * @param {number} seconds
   */
  prime(seconds) {
    this.#time = seconds;
    this.#countUp = seconds === 0;
    this.render();
    this.dispatchEvent(new Event("primed"));
  }

  /** Start the timer. This requires the timer to be primed first. */
  run() {
    if (this.#intervalId) return;

    this.#intervalId = setInterval(() => {
      if (!this.#countUp && this.#time <= 0) this.stop();
      else {
        this.#countUp ? this.#time++ : this.#time--;
        this.render();
        setTimeout(() => this.dispatchEvent(new Event("tick")), 0);
      }
    }, 1000);

    this.dispatchEvent(new Event("started"));
  }

  /** Stop the timer without removing it's "primed" state. */
  pause() {
    if (!this.#intervalId) return;

    clearInterval(this.#intervalId);
    this.#intervalId = null;

    this.render();
    this.dispatchEvent(new Event("paused"));
  }

  /**
   * Stop the timer. Removing it's "primed" state, and resetting the timer back
   * to initial state.
   */
  stop() {
    if (!this.#intervalId) return;

    clearInterval(this.#intervalId);
    this.#intervalId = null;
    this.#time = 0;
    this.#countUp = false;

    this.render();
    this.dispatchEvent(new Event("stopped"));
  }

  /**@override*/
  render() {
    this.#displayValue.innerText = this.#time;
  }
}
