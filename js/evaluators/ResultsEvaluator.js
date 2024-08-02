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
 * charsCorrect: number;
 * incorrectTotal: number;
 * backspacesTotal: number;
 * timeDiffs: TimeDiff[];
 * }} TestResult
 */

class ResultsEvaluator {
  #AVG_CHARS_PER_WORD = 4.7;

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

    //datasets.push({
    //  label: "Overall",
    //  data: overallData,
    //  backgroundColor: textColor,
    //  borderColor: textColor,
    //});

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
