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

  prime(seconds) {
    this.#time = seconds;
    this.#countUp = seconds === 0;
    this.render();
    this.dispatchEvent(new Event("primed"));
  }

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

  pause() {
    if (!this.#intervalId) return;

    clearInterval(this.#intervalId);
    this.#intervalId = null;

    this.render();
    this.dispatchEvent(new Event("paused"));
  }

  stop() {
    if (!this.#intervalId) return;

    clearInterval(this.#intervalId);
    this.#intervalId = null;
    this.#time = 0;
    this.#countUp = false;

    this.render();
    this.dispatchEvent(new Event("stopped"));
  }

  render() {
    this.#displayValue.innerText = this.#time;
  }
}
