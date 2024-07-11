import { ProblemSetManager } from "./problem-set-manager.js";

export class TextEditorManager {
  /**
   * @param {Object} param0
   * @param {ProblemSetManager} param0.problemSetManager
   */
  constructor({ problemSetManager }) {
    this.problemSetManager = problemSetManager;
  }

  _onExampleSelected() {}

  setup() {
    this.problemSetManager.addEventListener("exampleSelected", this._onExampleSelected);

    document.getElementById("play").addEventListener("click", () => {
      document.getElementById("text-editor").tabIndex = -1;
      document.getElementById("text-editor").focus();
    });
  }

  /**
   * @param {KeyboardEvent} ev
   */
  keydown(ev) {
    let key = ev.key;
  }

  lostFocus() {}
}
