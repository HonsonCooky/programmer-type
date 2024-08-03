import "https://cdn.jsdelivr.net/npm/chart.js";

class ResultsEvaluator {
  #AVG_CHARS_PER_WORD = 4.7;

  /**
   * Using some movie magic to generate a WPM value. WPM is the standard value
   * most people know an understand as their typing speed. So whilst this is
   * an approximation, it's good to show users such that they can see
   * improvement over time.
   *
   * @param {number} totalSecs
   * @param {number[]} keysEachSec
   */
  #wordsPerMinute(totalSecs, keysEachSec) {
    const totalKeyStrokes = keysEachSec.reduce((pv, cv) => pv + cv, 0);

    const totalWords = totalKeyStrokes / this.#AVG_CHARS_PER_WORD;
    const totalMinutes = totalSecs / 60;

    return Math.round(totalWords / totalMinutes);
  }

  /**
   * Just a standard deviation calculation for variation in the chars per second.
   * @param {number[]} keysEachSec
   */
  #consistency(keysEachSec) {
    const mean = keysEachSec.reduce((sum, value) => sum + value, 0) / keysEachSec.length;
    const variance = keysEachSec.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / keysEachSec.length;
    const sd = Math.sqrt(variance);
    const range = Math.max(...keysEachSec) - Math.min(...keysEachSec);

    return Math.round(((range - sd) / range) * 100);
  }

  /** @param {import("./KeyboardEvaluator").TestRecording[]} recordings */
  #generateInfo(recordings) {
    const keysEachSec = recordings.map((rec) => rec.correct + rec.incorrect + rec.backspaces);

    // Words Per Minute
    const totalSecs = recordings[recordings.length - 1].timestamp;
    const wpm = this.#wordsPerMinute(totalSecs, keysEachSec);

    // Accuracy
    const consistency = this.#consistency(keysEachSec);

    return {
      wpm,
      consistency,
    };
  }

  #loadInfo() {}

  #loadChart() {
    //const style = getComputedStyle(document.body);
    //const textColor = style.getPropertyValue("--text");
    //
    //const labels = [...Array(recordings[0].duration).keys()];
    //const datasets = [];
    //
    //datasets.push({
    //  label: "Overall",
    //  data: recordings.map((rec) => rec.correct + rec.incorrect + rec.backspaces),
    //  backgroundColor: textColor,
    //  borderColor: textColor,
    //});
    //
    //new Chart(canvas, {
    //  type: "line",
    //  data: {
    //    labels,
    //    datasets,
    //  },
    //  options: {
    //    animation: {
    //      duration: 0,
    //    },
    //    scales: {
    //      x: {
    //        title: {
    //          display: true,
    //          text: "Seconds",
    //        },
    //      },
    //    },
    //  },
    //});
  }

  /**
   * Where there is more than one recorded event, load the results.
   * @param {import("./KeyboardEvaluator").TestRecording[]} recordings
   */
  loadResults(recordings) {
    const info = this.#generateInfo(recordings);
    console.log(info);
    this.#loadInfo();
    this.#loadChart();
  }
}

export const ResEval = new ResultsEvaluator();
