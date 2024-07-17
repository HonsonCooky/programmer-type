/** @typedef {import("../managers/suite-manager.js").Suite} Suite
/** @typedef {{ timeStamp: number; index: number; correct: number; invalid: number; backspaces: number; }} Tick */
/** @typedef {Tick & { wpm: number; }} SanitizedTick */

/**
 * A dedicated context for the results page.
 */
export class ResultsManager {
  AVG_CHAR_PER_WORD = 4.79;

  /**@type {Element|null}*/
  _resultsDiv;
  _delayTime = 3;
  _delayTimerRunning = false;

  constructor() {
    super();
    fetch("../../assets/templates/results-sheet.html")
      .then((res) => res.text())
      .then((htmlStr) => new DOMParser().parseFromString(htmlStr, "text/html").querySelector("#results"))
      .then((resDiv) => (this._resultsDiv = resDiv));
  }

  closeResults() {
    this.dispatchEvent(new Event("resultsClosed"));
  }

  _countDownDelay() {
    this._delayTime--;
    this.dispatchEvent(new Event("delayChange"));

    if (this._delayTime <= 0) {
      this._delayTimerRunning = false;
      return;
    }
    setTimeout(this._countDownDelay.bind(this), 1000);
  }

  _startDelayTimer() {
    this._delayTimerRunning = true;
    this._delayTime = 3;
    this._countDownDelay();
  }

  /**
   * @param { Tick[] } ticks
   * @returns { SanitizedTick[] }
   * */
  _sanitizeTicks(ticks) {
    return ticks
      .map(function (tick) {
        return {
          ...tick,
          timeStamp: Math.round(tick.timeStamp / 1000),
        };
      })
      .filter(function (tick, i, ticks) {
        if (i < 1) return true;
        const other = ticks[i - 1];
        return other.timeStamp != tick.timeStamp;
      })
      .map(function (tick) {
        const words = (tick.correct + tick.invalid) / this.AVG_CHAR_PER_WORD;
        tick.wpm = (words / (1 / 60)).toFixed(2);
        return tick;
      });
  }

  /** @param {{ suite: Suite; sanitizeTicks: SanitizedTick[] }} param0 */
  _populateTempalate({ suite, sanitizeTicks }) {
    if (!this._resultsDiv) return;

    this._resultsDiv.querySelector("#result-suite-name").innerText = suite.name;
    this._resultsDiv.querySelector("#result-suite-type").innerText = suite.type;
  }

  /** @param {SanitizedTick[]} sanitizeTicks */
  _generateGraphs(sanitizeTicks) {
    if (!this._resultsDiv) return;
  }

  /**
   * @param { Object } testValues
   * @param { Suite } testValues.suite
   * @param { SanitizedTick[] } testValues.sanitizeTicks
   */
  _generateErrorDiv(testValues) {
    const errorDiv = document.createElement("div");
    const errorMsg = document.createElement("div");
    errorMsg.innerText = "I'm so sorry! I couldn't load a visual for your data.";
    errorDiv.appendChild(errorMsg);

    const errorData = document.createElement("div");
    errorData.innerHTML = JSON.stringify(testValues, null, 2);
    errorDiv.appendChild(errorData);

    return errorDiv;
  }

  /**
   * @param { Object } testValues
   * @param { Suite } testValues.suite
   * @param { Tick[] } testValues.ticks
   * @return {HTMLElement}
   */
  generateResultSheet(testValues) {
    this._startDelayTimer();
    const { suite, ticks } = testValues;
    const sanitizeTicks = this._sanitizeTicks(ticks);

    // Error Message
    if (!this._resultsDiv) return this._generateErrorDiv({ suite, sanitizeTicks });

    this._populateTempalate({ suite, sanitizeTicks });
    this._generateGraphs(sanitizeTicks);
    return this._resultsDiv;
  }

  /** @param {KeyboardEvent} ev */
  keydown(ev) {
    const key = ev.key;

    if (key === "Enter" && this._delayTime === 0) {
      ev.preventDefault();
      this.closeResults();
      return;
    }
  }
}
