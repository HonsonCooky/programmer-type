/** Timer class that extends EventTarget. */
export class Timer extends EventTarget {
  #displayValue = document.getElementById("timer-value");
  #duration = 0;
  #time = 0;
  #intervalId = undefined;

  /**
   * Render the current time to the display element.
   * @private
   */
  #render() {
    this.#displayValue.innerText = this.#time;
  }

  /**
   * Dispatch a timer event with the current state.
   * @param {string} type
   * @private
   */
  #dispatchTimerEvent(type) {
    this.dispatchEvent(
      new CustomEvent(type, { detail: { duration: this.#duration, time: this.#time, intervalId: this.#intervalId } }),
    );
  }

  /**
   * Stop the timer and reset it to the initial duration.
   * @private
   */
  #stop() {
    clearInterval(this.#intervalId);
    this.#intervalId = undefined;
    this.#time = this.#duration;
    this.#render();
  }

  /**
   * Prime the timer with a specified duration.
   * @param {number} duration - The duration to set the timer to.
   */
  prime(duration) {
    if (this.#intervalId) this.interrupt();
    this.#duration = duration;
    this.#time = duration;
    this.#render();
    this.#dispatchTimerEvent("primed");
  }

  /** Start the timer. */
  run() {
    if (this.#intervalId) return;
    this.#intervalId = setInterval(() => {
      this.#time += this.#duration === 0 ? 1 : -1;

      if (this.#time <= 0 || this.#time >= Number.MAX_VALUE) {
        this.stop();
        return;
      }

      this.#render();
      this.#dispatchTimerEvent("tick");
    }, 1000);

    this.#dispatchTimerEvent("tick");
  }

  /** Stop the timer and reset it to the initial duration. */
  stop() {
    if (!this.#intervalId) return;
    this.#stop();
    this.#dispatchTimerEvent("stopped");
  }

  /** Interrupt the timer and reset it to the initial duration. */
  interrupt() {
    if (!this.#intervalId) return;
    this.#stop();
    this.#dispatchTimerEvent("interrupted");
  }
}
