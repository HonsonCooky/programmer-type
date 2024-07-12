import { ProblemSetManager } from "./problem-set-manager.js";
import { TimingManager } from "./timing-manager.js";

export class TextEditorManager {
  input = [];
  primed = false;

  /**
   * @param {Object} param0
   * @param {ProblemSetManager} param0.problemSetManager
   * @param {TimingManager} param0.timingManger
   */
  constructor({ problemSetManager, timingManger }) {
    this.problemSetManager = problemSetManager;
    this.timingManger = timingManger;
    this.textEditorElement = document.getElementById("text-editor");
  }

  async _onExampleSelected() {
    const blob = await this.problemSetManager.currentExample.text();
    this.textEditorElement.innerHTML = blob
      .split(/\r?\n/g)
      .map((line) => {
        let indentLevel = (line.match(/^(\s+)/) || [""])[0].length;
        const chars = line
          .trim()
          .split("")
          .map((c) => `<span>${c}</span>`)
          .join("");
        return `<div class="line" style="margin-left:calc(var(--fs--2) * ${indentLevel})">${chars}</div>`;
      })
      .join("");
  }

  _calculateScore() { }
  _timerFinished() {
    this.textEditorElement.blur();
  }

  setup() {
    this.problemSetManager.addEventListener("exampleSelected", this._onExampleSelected.bind(this));
    this.timingManger.addEventListener("timerFinished", this._timerFinished.bind(this));

    const playBtn = document.getElementById("play");
    this.textEditorElement.addEventListener("focusin", () => {
      this.primed = true;
      playBtn.innerText = "[:q] Stop";
    });
    this.textEditorElement.addEventListener("focusout", () => {
      this.primed = false;
      playBtn.innerText = "[G] Go!";
    });

    playBtn.addEventListener("click", () => {
      document.getElementById("text-editor").tabIndex = -1;
      document.getElementById("text-editor").focus();
    });
  }

  /**
   * @param {KeyboardEvent} ev
   */
  keydown(ev) {
    let key = ev.key;
    if (this.primed) {
      this.primed = false;
      this.timingManger.start();
    }
  }
}
