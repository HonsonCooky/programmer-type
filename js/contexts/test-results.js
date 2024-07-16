import { IContext } from "./icontext.js";

export class TestResults extends IContext {
  constructor() {
    super();
  }

  closeResults() {
    this.dispatchEvent(new Event("resultsClosed"));
  }

  /**
   * @param {{
   *   invalid: number,
   *   correct: number,
   *   backspaces: number|undefined,
   *   timeStamp: number,
   *   suite: { name: string; type: string; tests: string[]; },
   * }[]} testValues */
  resultsHTML(testValues) {
    const wrapper = document.createElement("div");
    wrapper.className = "results";

    const div1 = document.createElement("div");
    const totals = testValues.reduce(
      (p, c) => {
        return {
          time: c.timeStamp,
          chars: p.chars + c.invalid + c.correct,
          correct: p.correct + c.correct,
          invalid: p.invalid + c.invalid,
        };
      },
      {
        time: 0,
        chars: 0,
        correct: 0,
        invalid: 0,
      },
    );

    totals.correctPercentage = Math.round((totals.correct / totals.chars) * 100);
    totals.invalidPercentage = Math.round((totals.invalid / totals.chars) * 100);
    totals.charsPerSecond = (totals.chars / (totals.time / 1000)).toFixed(2);

    div1.innerHTML = `
      <h3>Totals</h3>
      <div><span class="title">Time:</span> <span class="value">${totals.time}</span></div>
      <div><span class="title">Characters:</span> <span class="value">${totals.chars}</span></div>
      <div><span class="title indent">- Correct:</span> <span class="value">${totals.correct}</span></div>
      <div><span class="title indent">- Correct Percentage:</span> <span class="value">${totals.correctPercentage}%</span></div>
      <div><span class="title indent">- Invalid:</span> <span class="value">${totals.invalid}</span></div>
      <div><span class="title indent">- Invalid Percentage:</span> <span class="value">${totals.invalidPercentage}%</span></div>
      <div><span class="title indent special">- Per Second:</span> <span class="value special">${totals.charsPerSecond}</span></div>
    `;
    wrapper.appendChild(div1);

    const div2 = document.createElement("div");
    const tests = testValues.map((t, i) => {
      if (i === 0) return t;
      return {
        invalid: t.invalid,
        correct: t.correct,
        timeStamp: t.timeStamp - testValues[i - 1].timeStamp,
        suite: t.suite,
      };
    });

    div2.innerHTML = tests
      .map((t, i) => {
        const testId = `<h3>Test ${i}</h3>`;
        const correct = `<div><span>Correct Characters:</span> <span>${t.correct}</span></div>`;
        const invalid = `<div><span>Invalid Characters:</span> <span>${t.invalid}</span></div>`;
        const timeTaken = `<div><span>Time (ms):</span> <span>${t.timeStamp}</span></div>`;
        const suite = `<div><span>Type:</span> <span>${t.suite.name} - [${t.suite.type}]</span></div>`;
        return testId + correct + invalid + timeTaken + suite;
      })
      .join("");
    wrapper.appendChild(div2);

    return wrapper;
  }

  /** @param {KeyboardEvent} ev */
  keydown(ev) {
    const key = ev.key;

    if (key === "Enter") {
      ev.preventDefault();
      this.closeResults();
      return;
    }
    this.dispatchEvent(new CustomEvent("resultKeyDown", { detail: ev }));
  }
}
