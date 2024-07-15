import { DurationManager } from "./managers/duration-manager.js";
import { Navigation } from "./contexts/navigation.js";
import { SuiteManager } from "./managers/suite-manager.js";
import { TextEditor } from "./contexts/text-editor.js";
import { ThemeManager } from "./managers/theme-manager.js";
import { TimeManager } from "./managers/time-manager.js";

export class Program {
  /**
   * In this web app, users are either navigating the page, or typing a test.
   * Context is switched based on the focus of the text editor.
   *
   * @param {Object} param0
   * @param {SuiteManager} param0.suiteManager
   * @param {TimeManager} param0.timeManager
   * @param {TextEditor} param0.textEditor
   * @param {Navigation} param0.navigation
   */
  _contextUpdate({ suiteManager, timeManager, textEditor, navigation }) {
    textEditor.textEditorElement.addEventListener("focusin", () => {
      this.curContext = textEditor;
      textEditor.focusTextEditor();
      timeManager.prime();
    });
    textEditor.textEditorElement.addEventListener("focusout", () => {
      this.curContext = navigation;
      textEditor.blurTextEditor();
      if (suiteManager.selectedSuite.type === "Code") timeManager.pause();
    });
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
      function (ev) {
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
    const callback = function () {
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
    const updatingTest = function () {
      textEditor.loadingTest();
    };

    const testUpdated = function () {
      textEditor.loadTestSuite(suiteManager.currentTest);
    };

    suiteManager.addEventListener("updatingTest", updatingTest);
    suiteManager.addEventListener("testUpdated", testUpdated);

    // Load initial test - avoid doing before linking.
    // This is a unique scenario, as we cannot easily pre-load this data.
    suiteManager.updateRandomTest();
  }

  setup() {
    // Managers
    const themeManager = new ThemeManager();
    themeManager.setup();
    const durationManager = new DurationManager();
    durationManager.setup();
    const suiteManager = new SuiteManager();
    suiteManager.setup();
    const timeManager = new TimeManager();

    // Contexts
    const textEditor = new TextEditor();
    textEditor.setup();
    const navigation = new Navigation();

    // We could make these globally available, but by using them locally, we can see function dependencies.

    this.curContext = navigation;
    this._contextUpdate({ suiteManager, timeManager, textEditor, navigation });
    this._keyboardInput({ textEditor, timeManager });
    this._durationUpdate({ durationManager, timeManager });
    this._suiteUpdate({ suiteManager, textEditor });
  }
}

const context = new Program();
context.setup();
