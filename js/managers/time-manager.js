export class TimeManager extends EventTarget {
  timerElement = document.getElementById("timer-value");
  selectedTime = 60;
  currentTime = 60;
  primed = false;
  running = false;
  timeSpent = undefined;

  /**
   * @param {string} durationValue
   */
  setTimer(durationValue) {
    const event = new Event("timerUpdate");
    this.selectedTime = Number.parseInt(durationValue);
    this.currentTime = isNaN(this.selectedTime) ? 0 : this.selectedTime;
    this.timerElement.innerText = this.currentTime;
    this.dispatchEvent(event);
  }

  prime() {
    if (this.primed) return;
    this.primed = true;
    this.running = false;
    this.timerElement.className = "primed";
    this.dispatchEvent(new Event("timerPrimed"));
  }

  run() {
    if (this.primed) {
      this.primed = false;
      this.running = true; // This is the only place "this.running" is set to true
      this.timerElement.className = "running";
      this.dispatchEvent(new Event("timerStart"));
    }

    if (!this.running) return;

    this.currentTime += isNaN(this.selectedTime) ? 1 : -1;
    this.timerElement.innerText = this.currentTime;

    if (this.currentTime > 0) setTimeout(this.run.bind(this), 1000);
    else this.finish();
  }

  pause() {
    this.running = false;
    this.timerElement.className = "primed";
    this.dispatchEvent(new Event("timerPaused"));
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
