export class TimeManager extends EventTarget {
  timerElement = document.getElementById("timer-value");
  selectedTime = 60;
  currentTime = 60;
  primed = false;
  running = false;
  /**@type {{start: number, end: number}[]}*/
  timeIntervals = [];

  resetTimer() {
    this.primed = false;
    this.running = false;
    this.timeIntervals = [];
    this.currentTime = isNaN(this.selectedTime) ? 0 : this.selectedTime;
    this.timerElement.innerText = this.currentTime;
    this.dispatchEvent(new Event("timerReset"));
  }

  /**
   * @param {string} durationValue
   */
  setTimer(durationValue) {
    this.selectedTime = Number.parseInt(durationValue);
    this.currentTime = isNaN(this.selectedTime) ? 0 : this.selectedTime;
    this.timeIntervals = [];
    this.timerElement.innerText = this.currentTime;
    this.dispatchEvent(new Event("timerUpdate"));
  }

  timeSpent() {
    return this.timeIntervals.reduce((p, c) => p + ((c.end ?? Date.now()) - c.start), 0);
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
      this.running = true; // This is the only place "this.running" is set to timer-value
      this.timeIntervals.push({
        start: Date.now(),
      });
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
    if (this.timeIntervals[this.timeIntervals.length - 1])
      this.timeIntervals[this.timeIntervals.length - 1].end = Date.now();
    this.timerElement.className = "primed";
    this.dispatchEvent(new Event("timerPaused"));
  }

  finish(quite = false) {
    this.primed = false;
    this.running = false;
    this.currentTime = this.selectedTime;
    this.timeIntervals[this.timeIntervals.length - 1].end = Date.now();
    this.timerElement.innerText = this.currentTime;
    if (!quite) this.dispatchEvent(new Event("timerFinished"));
  }
}
