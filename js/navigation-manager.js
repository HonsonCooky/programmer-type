import { ProblemSetManager } from "./problem-set-manager.js";

export class NavigationMangager {
  /**
   * @param {Object} param0
   * @param {ProblemSetManager} param0.problemSetManager
   */
  constructor({ problemSetManager }) {
    this.problemSetManager = problemSetManager;
  }

  keymappings = {
    d: {
      element: document.getElementById("duration-select"),
    },
    p: {
      element: document.getElementById("duration-select"),
    },
  };

  _onNewSet() {}

  _onNewExample() {}

  setup() {
    this.problemSetManager.addEventListener("setSelected", this._onNewSet);
    this.problemSetManager.addEventListener("exampleSelected", this._onNewExample);
    this.problemSetManager.setup();
  }

  /**
   * @param {KeyboardEvent} ev
   */
  keydown(ev) {}

  lostFocus() {}
}
