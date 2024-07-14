import { DurationManager } from "./duration-manager.js";
import { Navigation } from "./navigation.js";
import { SuiteManager } from "./suite-manager.js";
import { TextEditor } from "./text-editor.js";
import { ThemeManager } from "./theme-manager.js";
import { TimeManager } from "./time-manager.js";

export class Program {
  currentContext = window.navigationManager;

  _keyboardInputSetup() {
    const textEditorElement = document.getElementById("text-editor");
    textEditorElement.addEventListener("focusin", () => {
      this.currentContext = window.pt.textEditor;
      window.pt.timeManager.prime();
    });
    textEditorElement.addEventListener("focusout", () => {
      this.currentContext = window.pt.navigation;
      if (window.pt.suiteManager.selectedSuite.type != "code") window.pt.timeManager.pause();
    });

    window.addEventListener(
      "keydown",
      function(ev) {
        if (this.currentContext === window.pt.textEditor && window.pt.timeManager.primed) window.pt.timeManager.run();
        if (this.currentContext) this.currentContext.keydown(ev);
      }.bind(this),
    );
  }

  /**
   * @param {Object} param0 
   * @param {ThemeManager} param0.themeManager 
   * @param {SuiteManager} param0.suiteManager 
   * @param {DurationManager} param0.durationManager 
   * @param {TimeManager} param0.timeManager 
   * @param {TextEditor} param0.textEditor 
   * @param {Navigation} param0.navigator 
   * */
  setup({
    themeManager,
    suiteManager,
    durationManager,
    timeManager,
    textEditor,
    navigator,
  }) {
    this._keyboardInputSetup();
  }
}
