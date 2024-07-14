import { DurationManager } from "./duration-manager.js";

export class TimeManager extends EventTarget {
  timerElement = document.getElementById("timer-value");
  currentTime = 60;
  primed = false;
  running = false;
  timeSpent = undefined;

  constructor() {
    super();
    window.durationManager.addEventListener("durationUpdated", this._setTimer.bind(this));
  }

  _setTimer() {
    const event = new Event("timerUpdate");
    const duration = Number.parseInt(window.durationManager.selectedDuration);

    this.currentTime = isNaN(duration) ? 0 : duration;
    this.timerElement.innerText = this.currentTime;
    this.dispatchEvent(event);
  }

  prime() {
    if (this.primed || this.running) return;
    this.primed = true;
    this.timerElement.className = "primed";
    this.dispatchEvent(new Event("timerPrimed"));
  }

  run() {
    if (this.primed) {
      this.primed = false;
      this.running = true;
      this.timerElement.className = "running";
      this.dispatchEvent(new Event("timerStart"));
    }

    if (!this.running) return;

    this.currentTime += this.selectedTime > 0 ? -1 : 1;
    this.timerElement.innerText = this.currentTime;

    if (this.currentTime > 0) setTimeout(this.run.bind(this), 1000);
    else this.finish();
  }

  finish() {
    this.primed = false;
    this.running = false;
    this.timeSpent = this.selectedTime - this.currentTime;
    this.currentTime = this.selectedTime;
    this.timerElement.innerText = this.currentTime;
    this.dispatchEvent(new Event("timerFinished"));
  }
}
