export class TimingManager extends EventTarget {
  isCountDown = true;
  seconds = 60;
  timerElement = document.getElementById("timer");
  timingLabel = document.getElementById("duration-selected");
  durationDropdownContent = document.getElementById("duration-select").querySelector(".dropdown-content");
  runningInstance = undefined;

  _updateUI() {
    let label = `${this.seconds}s`;
    this.isCountDown = true;

    if (this.seconds === 0) {
      label = "Infinite";
      this.isCountDown = false;
    }

    this.timingLabel.innerText = label;
    this.timerElement.innerText = this.seconds;
    Array.from(this.durationDropdownContent.children).forEach((child) => {
      if (child.innerText.includes(label)) child.style.color = "var(--rose)";
      else child.style.color = "var(--text)";
    });
  }

  _updateTiming(duration) {
    const event = new Event("timerUpdate");
    if (isNaN(duration)) {
      return function() {
        this.seconds = 0;
        this._updateUI();
        this.dispatchEvent(event);
      }.bind(this);
    }

    return function() {
      this.seconds = duration;
      this._updateUI();
      this.dispatchEvent(event);
    }.bind(this);
  }

  setup() {
    document.getElementById("duration-15").addEventListener("click", this._updateTiming(15));
    document.getElementById("duration-30").addEventListener("click", this._updateTiming(30));
    document.getElementById("duration-60").addEventListener("click", this._updateTiming(60));
    document.getElementById("duration-90").addEventListener("click", this._updateTiming(90));
    document.getElementById("duration-120").addEventListener("click", this._updateTiming(120));
    document.getElementById("duration-infinite").addEventListener("click", this._updateTiming("Infinite"));
    this._updateUI();
  }

  start() {
    if (this.runningInstance) return;
    this.runningInstance = TimingManager.generateUUID();
    this._run();
  }

  _run() {
    if (!this.runningInstance) return;

    if (this.isCountDown && this.seconds < 1) {
      this.finish();
      return;
    }

    this.seconds += this.isCountDown ? -1 : 1;
    this.timerElement.innerText = this.seconds;
    setTimeout(this._run.bind(this), 1000);
  }

  finish() {
    this.runningInstance = undefined;
    this.dispatchEvent(new Event("timerFinished"));
  }

  static generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
