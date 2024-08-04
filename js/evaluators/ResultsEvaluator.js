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
    const duration = recordings[0].duration;
    const suite = recordings[0].test;
    const keysEachSec = recordings.map((rec) => rec.correct + rec.incorrect + rec.backspaces);

    // Words Per Minute
    const totalSecs = recordings[recordings.length - 1].timestamp;
    const wpm = this.#wordsPerMinute(totalSecs, keysEachSec);

    // Accuracy
    const correct = recordings.map((rec) => rec.correct).reduce((pv, cv) => pv + cv, 0);
    const total = keysEachSec.reduce((pv, cv) => pv + cv, 0);
    const accuracy = Math.round((correct / total) * 100);

    // Test Data
    const test = {
      name: suite.name,
      type: suite.type,
      duration,
      tests: new Set(recordings.map((rec) => rec.test.testNumber)).size,
    };

    // Raw
    const raw = keysEachSec.reduce((pv, cv) => pv + cv, 0);

    // Characters
    const characters = {
      correct,
      incorrect: recordings.map((rec) => rec.incorrect).reduce((pv, cv) => pv + cv, 0),
      backspaces: recordings.map((rec) => rec.backspaces).reduce((pv, cv) => pv + cv, 0),
    };

    // Consistency
    const consistency = this.#consistency(keysEachSec);

    return {
      wpm,
      accuracy,
      test,
      raw,
      characters,
      consistency,
      time: totalSecs,
    };
  }

  /**
   *@param {Object} param0
   * @param {number} param0.wpm
   * @param {number} param0.accuracy
   * @param {{ name: string; type: string; duration: number; tests: number; }} param0.test
   * @param {number} param0.raw
   * @param {{ correct: number; incorrect: number; backspaces: number; }} param0.characters
   * @param {number} param0.consistency
   * @param {number} param0.time
   */
  #loadInfo({ wpm, accuracy, test, raw, characters, consistency, time }) {
    // WPM
    const wpmElement = document.getElementById("result-wpm");
    wpmElement.innerText = wpm;
    wpmElement.title = "~ Words Per Minute : 4.7 keys is a word.";

    // Accuracy
    const accuracyElement = document.getElementById("result-accuracy");
    accuracyElement.innerText = `${accuracy}%`;
    accuracyElement.title = "Percentage of first-time correct inputs.";

    // Test
    const testElement = document.getElementById("info-test");
    testElement.title = "Selected Values & Number of completed files.";
    document.getElementById("info-test-name").innerText = test.name;
    document.getElementById("info-test-type").innerText = test.type;
    document.getElementById("info-test-duration").innerText = `${test.duration}s`;
    document.getElementById("info-test-tests").innerText = test.tests;

    // Raw
    const rawElement = document.getElementById("info-raw");
    rawElement.innerText = raw;
    rawElement.title = "Total amount of keystrokes.";

    // Characters
    const characterElement = document.getElementById("info-chars");
    characterElement.innerText = `${characters.correct}/${characters.incorrect}/${characters.backspaces}`;
    characterElement.title = "Correct/Incorrect/Backspaces.";

    // Consistency
    const consistencyElement = document.getElementById("info-consistency");
    consistencyElement.innerText = `${consistency}%`;
    consistencyElement.title = "Standard deviation in characters per second.";

    // Time
    const timeElement = document.getElementById("info-time");
    timeElement.innerText = `${time}s`;
    timeElement.title = "Amount of time spent taking test.";
  }

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
    //  legend: { display: false },
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
    this.#loadInfo(info);
    this.#loadChart();
  }
}

export const ResEval = new ResultsEvaluator();
