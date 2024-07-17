import { DurationManager } from "./managers/duration-manager.js";
import { Navigation } from "./contexts/navigation.js";
import { SuiteManager } from "./managers/suite-manager.js";
import { TextEditor } from "./contexts/text-editor.js";
import { ThemeManager } from "./managers/theme-manager.js";
import { TimeManager } from "./managers/time-manager.js";
import { InfoManager } from "./managers/info-manager.js";
import { ResultsManager } from "./managers/results-manager.js";

export class Program {
  /**
   * If the text editor is focused, keyboard inputs are indications of taking a
   * test. If the text editor is not focused, keyboard inputs are indicative of
   * navigation attempts.
   *
   * @param {Object} param0
   * @param {SuiteManager} param0.suiteManager
   * @param {TimeManager} param0.timeManager
   * @param {Navigation} param0.navigation
   * @param {TextEditor} param0.textEditor
   */
  _contextUpdate({ suiteManager, timeManager, navigation, textEditor }) {
    textEditor.textEditorElement.addEventListener("focusin", () => {
      this.curContext = textEditor;
      textEditor.textEditorInstructionsElement.innerText = "[:q] Quit, [Ctrl +] Increase Font, [Ctrl -] Decrease Font";
      textEditor.focusTextEditor();
      if (!timeManager.running) timeManager.prime();
    });

    textEditor.textEditorElement.addEventListener("focusout", () => {
      this.curContext = navigation;
      textEditor.blurTextEditor();
      if (suiteManager.selectedSuite.type === "Code") timeManager.pause();
    });
  }

  /**
   * The only `window.addEventListener("keydown")` instance in this program.
   * Context is altered based on the state of `this.curContext`.
   *
   * Links the text editor to the time manager, where a keydown event will
   * start the timer if applicable.
   *
   * @param {Object} param0
   * @param {TextEditor} param0.textEditor
   * @param {TimeManager} param0.timeManager
   */
  _keyboardInput({ textEditor, timeManager }) {
    window.addEventListener(
      "keydown",
      function (ev) {
        // Start the test if the user is typing into the text editor, and the timer hasn't started
        if (this.curContext === textEditor && timeManager.primed && textEditor.shouldStartTest(ev)) timeManager.run();

        // Send all key events to the current context
        this.curContext.keydown(ev);
      }.bind(this),
    );
  }

  /**
   * When the user updates the duration of the test, update the time manager to
   * reciprocate changes.
   *
   * @param {Object} param0
   * @param {DurationManager} param0.durationManager
   * @param {TimeManager} param0.timeManager
   */
  _durationUpdate({ durationManager, timeManager }) {
    const callback = function () {
      timeManager.setTimer(durationManager.selectedDuration);
    };

    durationManager.addEventListener("durationUpdated", callback);
  }

  /**
   * When the user selects a new test suite:
   * - the previous test is invalid, and the timer should reset.
   * - the text editor UI should update it's data to reciprocate the loading
   *   state.
   *
   * When a new test has been loaded, the text editor should update to
   * reciprocate these changes.
   *
   * @param {Object} param0
   * @param {SuiteManager} param0.suiteManager
   * @param {TimeManager} param0.timeManager
   * @param {TextEditor} param0.textEditor
   */
  _suiteUpdate({ suiteManager, timeManager, textEditor }) {
    const suiteUpdated = function () {
      timeManager.resetTimer();
      textEditor.loadingTest();
    };

    const testUpdated = function () {
      textEditor.loadTestSuite(suiteManager.selectedSuite, suiteManager.currentTest);
    };

    suiteManager.addEventListener("suiteUpdated", suiteUpdated);
    suiteManager.addEventListener("testUpdated", testUpdated);

    // Load initial test - avoid doing before linking.
    // This is a unique scenario, as we cannot easily pre-load this data.
    // suiteManager.updateRandomTest();
  }

  /**
   * @param {Object} param0
   * @param {SuiteManager} param0.suiteManager
   * @param {InfoManager} param0.infoManager
   * @param {TextEditor} param0.textEditor
   */
  _infoHover({ suiteManager, infoManager, textEditor }) {
    const reloadTest = function () {
      textEditor.loadTestSuite(suiteManager.selectedSuite, suiteManager.currentTest);
    };
    infoManager.addEventListener("reloadTest", reloadTest);
  }

  /**
   * @param {Object} param0
   * @param {SuiteManager} param0.suiteManager
   * @param {TimeManager} param0.timeManager
   * @param {TextEditor} param0.textEditor
   * @param {TestResults} param0.testResults
   */
  _testStates({ suiteManager, timeManager, textEditor, testResults }) {
    /**
     * @type {{ timeStamp: number, index: number, correct: number, invalid: number, backspaces: number }[]}
     */
    let tickEvals = [];

    const _evaluateResults = function () {
      this.curContext = testResults;
      textEditor.loadingTest();

      const resultsSheet = testResults.generateResultSheet({ suite: suiteManager.selectedSuite, ticks: tickEvals });
      textEditor.textEditorElement.innerHTML = "";
      textEditor.textEditorElement.appendChild(resultsSheet);
      textEditor.resultsShowing(testResults._delayTime);
      tickEvals = [];
    }.bind(this);

    const delayChange = function () {
      textEditor.resultsShowing(testResults._delayTime);
    };

    const _saveResults = function () {
      const timeStamp = timeManager.timeStamp();

      let lastTick = { timeStamp: 0, index: 0, invalid: 0, correct: 0, backspaces: 0 };
      if (tickEvals.length > 0) lastTick = tickEvals[tickEvals.length - 1];

      let textAnalysis = textEditor.analyseTest(lastTick.index);
      textAnalysis.timeStamp = timeStamp;
      tickEvals.push(textAnalysis);
    };

    const timerTick = function () {
      _saveResults();
    };

    const testCompleted = function () {
      _saveResults();
      suiteManager.updateRandomTest();
    };

    const testFinished = function () {
      textEditor.reset();
      timeManager.resetTimer();
      _evaluateResults();
    };

    const testForceFinished = function () {
      _saveResults();
      timeManager.finish();
    };

    timeManager.addEventListener("timerTick", timerTick);
    timeManager.addEventListener("timerFinished", testFinished);
    textEditor.addEventListener("testForceFinished", testForceFinished);
    textEditor.addEventListener("testCompleted", testCompleted);
    testResults.addEventListener("delayChange", delayChange);
  }

  setup() {
    // Managers
    new ThemeManager();
    const durationManager = new DurationManager();
    const suiteManager = new SuiteManager();
    const infoManager = new InfoManager();
    const resultsManager = new ResultsManager();
    const timeManager = new TimeManager();

    // Contexts
    const navigation = new Navigation();
    const textEditor = new TextEditor();

    // We could make these globally available, but by using them locally, we can see function dependencies.
    this.curContext = navigation;
    this._contextUpdate({ suiteManager, timeManager, navigation, textEditor });
    this._keyboardInput({ textEditor, timeManager });
    this._durationUpdate({ durationManager, timeManager });
    this._suiteUpdate({ suiteManager, timeManager, textEditor });
    this._infoHover({ suiteManager, infoManager, textEditor });
    this._testStates({ suiteManager, timeManager, textEditor, testResults });
  }
}

const context = new Program();
context.setup();
