import { ProblemSetManager } from "./problem-set-manager.js";

export class TextEditorManager {
  input = [];

  /**
   * @param {Object} param0
   * @param {ProblemSetManager} param0.problemSetManager
   */
  constructor({ problemSetManager }) {
    this.problemSetManager = problemSetManager;
    this.textEditorElement = document.getElementById("text-editor");
  }

  async _onExampleSelected() {
    const blob = await this.problemSetManager.currentExample.text();
    this.textEditorElement.textContent = blob;
  }

  setup() {
    this.problemSetManager.addEventListener("exampleSelected", this._onExampleSelected.bind(this));

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
}
