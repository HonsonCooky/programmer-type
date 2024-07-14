export class TimingManager extends EventTarget {
  durationDropdownContent = document.getElementById("duration-select").querySelector(".dropdown-content");
  timingLabel = document.getElementById("duration-selected");
  timerElement = document.getElementById("timer");
  timerTitle = document.getElementById("timer-span");
  selectedTime = 60;
  currentTime = 60;
  primed = false;
  running = false;
  timeSpent = undefined;

  _updateUI() {
    let label = `${this.selectedTime}s`;
    if (this.currentTime === 0) label = "Infinite";

    this.timingLabel.innerText = label;
    this.timerElement.innerText = this.currentTime;
    Array.from(this.durationDropdownContent.children).forEach((child) => {
      if (child.innerText.includes(label)) child.classList.add("selected");
      else child.classList.remove("selected");
    });
  }

  _setTimer(duration) {
    const event = new Event("timerUpdate");
    if (isNaN(duration)) {
      return function () {
        this.selectedTime = 0;
        this.currentTime = 0;
        this._updateUI();
        this.dispatchEvent(event);
      }.bind(this);
    }

    return function () {
      this.selectedTime = duration;
      this.currentTime = duration;
      this._updateUI();
      this.dispatchEvent(event);
    }.bind(this);
  }

  setup() {
    document.getElementById("duration-15").addEventListener("click", this._setTimer(15));
    document.getElementById("duration-30").addEventListener("click", this._setTimer(30));
    document.getElementById("duration-60").addEventListener("click", this._setTimer(60));
    document.getElementById("duration-90").addEventListener("click", this._setTimer(90));
    document.getElementById("duration-120").addEventListener("click", this._setTimer(120));
    document.getElementById("duration-infinite").addEventListener("click", this._setTimer("Infinite"));
    this._updateUI();
  }

  prime() {
    if (this.primed || this.running) return;
    this.primed = true;
    this.timerTitle.className = "primed";
    this.dispatchEvent(new Event("timerPrimed"));
  }

  run() {
    if (this.primed) {
      this.primed = false;
      this.running = true;
      this.timerTitle.className = "running";
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
    this.timerTitle.className = "";
    this._updateUI();
    this.dispatchEvent(new Event("timerFinished"));
  }
}
