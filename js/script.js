import { DurationManager } from "./managers/duration-manager.js";
import { Navigation } from "./contexts/navigation.js";
import { SuiteManager } from "./managers/suite-manager.js";
import { TextEditor } from "./contexts/text-editor.js";
import { ThemeManager } from "./managers/theme-manager.js";
import { TimeManager } from "./managers/time-manager.js";
import { InfoManager } from "./managers/info-manager.js";
import { TestResults } from "./contexts/test-results.js";

export class Program {
  /**
   * In this web app, users are either navigating the page, or typing a test.
   * Context is switched based on the focus of the text editor.
   *
   * @param {Object} param0
   * @param {SuiteManager} param0.suiteManager
   * @param {TimeManager} param0.timeManager
   * @param {Navigation} param0.navigation
   * @param {TextEditor} param0.textEditor
   * @param {TestResults} param0.testResults
   */
  _contextUpdate({ suiteManager, timeManager, navigation, textEditor, testResults }) {
    textEditor.textEditorElement.addEventListener("focusin", () => {
      if (this.curContext === testResults) {
        suiteManager.updateRandomTest();
        return;
      }
      this.curContext = textEditor;
      textEditor.focusTextEditor();
      timeManager.prime();
    });
    textEditor.textEditorElement.addEventListener("focusout", () => {
      this.curContext = navigation;
      textEditor.blurTextEditor();
      if (suiteManager.selectedSuite.type === "Code") timeManager.pause();
    });
    testResults.addEventListener(
      "resultsClosed",
      function() {
        textEditor.resultsHide();
        suiteManager.updateRandomTest();
        this.curContext = navigation;
      }.bind(this),
    );
  }

  /**
   * In this web app, users are either navigating the page, or typing a test.
   * Keyboard events are sent to the relevant context based on the state of the application.
   *
   * @param {Object} param0
   * @param {TextEditor} param0.textEditor
   * @param {TimeManager} param0.timeManager
   */
  _keyboardInput({ textEditor, timeManager }) {
    window.addEventListener(
      "keydown",
      function(ev) {
        // Start the test if the user is typing into the text editor, and the timer hasn't started
        if (this.curContext === textEditor) {
          const timerReady = timeManager.primed && !timeManager.running;
          const shouldStartTest = textEditor.shouldStartTest(ev);
          if (timerReady && shouldStartTest) timeManager.run();
        }

        // Send all key events to the current context
        this.curContext.keydown(ev);
      }.bind(this),
    );
  }

  /**
   * When the user updates the duration of the test, update the time manager to reciprocate changes.
   *
   * @param {Object} param0
   * @param {DurationManager} param0.durationManager
   * @param {TimeManager} param0.timeManager
   */
  _durationUpdate({ durationManager, timeManager }) {
    const callback = function() {
      timeManager.setTimer(durationManager.selectedDuration);
    };

    durationManager.addEventListener("durationUpdated", callback);
  }

  /**
   * When the user selects a new suite, the text editor UI should update based on the status of these events.
   *
   * @param {Object} param0
   * @param {SuiteManager} param0.suiteManager
   * @param {TextEditor} param0.textEditor
   */
  _suiteUpdate({ suiteManager, textEditor }) {
    const updatingTest = function() {
      textEditor.loadingTest();
    };

    const testUpdated = function() {
      textEditor.loadTestSuite(suiteManager.selectedSuite, suiteManager.currentTest);
    };

    suiteManager.addEventListener("updatingTest", updatingTest);
    suiteManager.addEventListener("testUpdated", testUpdated);

    // Load initial test - avoid doing before linking.
    // This is a unique scenario, as we cannot easily pre-load this data.
    suiteManager.updateRandomTest();
  }

  /**
   * @param {Object} param0
   * @param {SuiteManager} param0.suiteManager
   * @param {InfoManager} param0.infoManager
   * @param {TextEditor} param0.textEditor
   */
  _infoHover({ suiteManager, infoManager, textEditor }) {
    const reloadTest = function() {
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
  _testFinished({ suiteManager, timeManager, textEditor, testResults }) {
    let testEvaluations = [];

    const _evaluateResults = function() {
      this.curContext = testResults;
      textEditor.textEditorElement.innerHTML = "";
      textEditor.textEditorElement.appendChild(testResults.resultsHTML([...testEvaluations]));
      textEditor.resultsShowing();
      testEvaluations = [];
    }.bind(this);

    const _saveResults = function(forceQuit) {
      let { invalid, correct } = textEditor.analyseTest();
      if (forceQuit) invalid--;
      const timeStamp = timeManager.timeSpent();
      const suite = suiteManager.selectedSuite;
      testEvaluations.push({ invalid, correct, timeStamp, suite });
    };

    const testCompleted = function() {
      _saveResults();
      suiteManager.updateRandomTest();
    };

    const testFinished = function() {
      _saveResults();
      textEditor.reset();
      timeManager.resetTimer();
      _evaluateResults();
    };

    const testForceFinished = function() {
      timeManager.finish(true);
      _saveResults(true);
      textEditor.reset();
      timeManager.resetTimer();
      _evaluateResults();
    };

    timeManager.addEventListener("timerFinished", testFinished);
    textEditor.addEventListener("testForceFinished", testForceFinished);
    textEditor.addEventListener("testCompleted", testCompleted);
  }

  setup() {
    // Managers
    const themeManager = new ThemeManager();
    const durationManager = new DurationManager();
    const suiteManager = new SuiteManager();
    const infoManager = new InfoManager();
    const timeManager = new TimeManager();

    // Contexts
    const navigation = new Navigation();
    const textEditor = new TextEditor();
    const testResults = new TestResults();

    // We could make these globally available, but by using them locally, we can see function dependencies.
    this.curContext = navigation;
    this._contextUpdate({ suiteManager, timeManager, navigation, textEditor, testResults });
    this._keyboardInput({ textEditor, timeManager });
    this._durationUpdate({ durationManager, timeManager });
    this._suiteUpdate({ suiteManager, textEditor });
    this._infoHover({ suiteManager, infoManager, textEditor });
    this._testFinished({ suiteManager, timeManager, textEditor, testResults });
  }
}

const context = new Program();
context.setup();
