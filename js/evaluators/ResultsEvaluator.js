import "https://cdn.jsdelivr.net/npm/chart.js";

/**
 * @typedef {
 * time: number;
 * correct: number;
 * incorrect: number;
 * backspaces: number;
 * } TimeDiff
 */

/**
 * @typedef {{
 * correctTotal: number;
 * incorrectTotal: number;
 * backspacesTotal: number;
 * timeDiffs: TimeDiff[];
 * }} TestResult
 */

class ResultsEvaluator {
  /**
   * Test Recordings are cummulative and consecutive. So this function will
   * split the data into tests, and then into stats over time.
   * @param {import("./KeyboardEvaluator").TestRecording[]} recordings
   */
  #sanitizeData(recordings) {
    /**@type {Object<string, TestResult>}*/
    const testResults = {};
    for (const rec of recordings) {
      const { duration, time, intervalId, correct, incorrect, backspaces, testNumber } = rec;

      // Create a new test result instance
      if (!testResults[testNumber]) {
        testResults[testNumber] = {
          correctTotal: 0,
          incorrectTotal: 0,
          backspacesTotal: 0,
          timeDiffs: [],
        };
      }

      const testResult = testResults[testNumber];

      testResult.timeDiffs.push({
        correct: correct - testResult.correctTotal,
        incorrect: incorrect - testResult.incorrectTotal,
        backspaces: backspaces - testResult.backspacesTotal,
      });

      testResult.correctTotal = correct;
      testResult.incorrectTotal = incorrect;
      testResult.backspacesTotal = backspaces;
    }

    return testResults;
  }

  /**
   * @param {HTMLDivElement} parent
   * @param {import("./KeyboardEvaluator").TestRecording[]} recordings
   * @returns {HTMLCanvasElement}
   */
  generateGraph(parent, recordings) {
    const canvas = document.createElement("canvas");
    parent.appendChild(canvas);

    const style = getComputedStyle(document.body);
    const baseColor = style.getPropertyValue("--base");
    const textColor = style.getPropertyValue("--text");
    const greenColor = style.getPropertyValue("--green");
    const redColor = style.getPropertyValue("--red");
    const peachColor = style.getPropertyValue("--peach");

    const labels = [...Array(recordings[0].duration).keys()];
    const datasets = [];

    const sanitizedData = this.#sanitizeData(recordings);

    // Overall performance
    const overallData = Object.values(sanitizedData)
      .map((tr) => tr.timeDiffs)
      .flat()
      .map((td) => td.correct - (td.incorrect - td.backspaces));

    datasets.push({
      label: "Overall",
      data: overallData,
      backgroundColor: textColor,
      borderColor: textColor,
    });

    new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets,
      },
    });

    return canvas;
  }
}

export const ResEval = new ResultsEvaluator();
