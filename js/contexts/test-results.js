import { IContext } from "./icontext.js";

export class TestResults extends IContext {
  /**@type {Element|null}*/
  _resultsDiv;
  _timerRunning = false;
  _delayTime = 3;

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
      this._timerRunning = false;
      return;
    }
    setTimeout(this._countDownDelay.bind(this), 1000);
  }

  _startDelayTimer() {
    this._timerRunning = true;
    this._delayTime = 3;
    this._countDownDelay();
  }

  /**
   * @param {{ timeStamp: number; index: number; correct: number; invalid: number; backspaces: number; }[]} ticks
   * */
  _sanitizeData(ticks) {
    return ticks
      .map(function(tick) {
        return {
          ...tick,
          timeStamp: Math.round(tick.timeStamp / 1000),
        };
      })
      .filter(function(tick, i, ticks) {
        if (i < 1) return true;
        const other = ticks[i - 1];
        return other.timeStamp != tick.timeStamp;
      });
  }

  /**
   * @param {{
   * suite: { name: string; type: string; tests: string[]; }
   * sanitizeData:{ timeStamp: number; index: number; correct: number; invalid: number; backspaces: number; }[]
   * }} param0
   */
  _populateTempalate({ suite, sanitizeData }) {
    if (!this._resultsDiv) return;

    this._resultsDiv.querySelector("#result-suite-name").innerText = suite.name;
    this._resultsDiv.querySelector("#result-suite-type").innerText = suite.type;
  }

  _generateGraphs(sanitizeData) {
    if (!this._resultsDiv) return;
  }

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
   * @param {{
   * suite: { name: string; type: string; tests: string[]; }
   * ticks:{ timeStamp: number; index: number; correct: number; invalid: number; backspaces: number; }[]
   * }} testValues
   * @return {HTMLElement}
   */
  generateResultSheet(testValues) {
    this._startDelayTimer();
    const { suite, ticks } = testValues;
    const sanitizeData = this._sanitizeData(ticks);

    console.log(this._resultsDiv);
    // Error Message
    if (!this._resultsDiv) return this._generateErrorDiv({ suite, sanitizeData });

    this._populateTempalate({ suite, sanitizeData });
    this._generateGraphs(sanitizeData);
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
