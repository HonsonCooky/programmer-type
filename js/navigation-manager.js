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

  _onSetsLoaded() {
    const problemSetDropdownContent = document.getElementById("problem-set-select").querySelector(".dropdown-content");
    for (const set of this.problemSetManager.sets) {
      const btn = document.createElement("button");
      btn.innerText = set;
      btn.addEventListener("click", () => {
        this.problemSetManager.selectSet(set);
      });
      problemSetDropdownContent.appendChild(btn);
    }
  }

  _onSetSelected() {
    // Update Label
    const problemSetLabel = document.getElementById("problem-set-selected");
    problemSetLabel.innerText = this.problemSetManager.selectedSet;

    // Highlight Selected
    Array.from(document.getElementById("problem-set-select").querySelector(".dropdown-content").children).forEach(
      (child) => {
        if (child.innerText === this.problemSetManager.selectedSet) child.style.color = "var(--rose)";
        else child.style.color = "var(--text)";
      },
    );
  }

  setup() {
    this.problemSetManager.addEventListener("setsLoaded", this._onSetsLoaded.bind(this));
    this.problemSetManager.addEventListener("setSelected", this._onSetSelected.bind(this));
  }

  /**
   * @param {KeyboardEvent} ev
   */
  keydown(ev) {}

  lostFocus() {}
}
