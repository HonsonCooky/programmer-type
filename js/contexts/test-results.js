export class TestResults extends EventTarget {
  constructor() {
    super();
  }

  _closeResults() {
    this.dispatchEvent(new Event("resultsClosed"));
  }

  /**
   * @param {{
   *   invalid: number,
   *   correct: number,
   *   time: number,
   *   suite: { name: string; type: string; tests: string[]; }
   * }} testValues */
  displayResults(testValues) {}

  /** @param {KeyboardEvent} ev */
  keydown(ev) {
    ev.preventDefault();
    const key = ev.key;

    if (key === "Escape" || key === "q") this._closeResults();
  }
}
