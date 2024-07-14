import { ProblemSetManager } from "./problem-set-manager.js";
import { TimingManager } from "./timing-manager.js";

export class TextEditorManager {
  input = [];

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

  async _onTestSelected() {
    const blob = this.problemSetManager.currentTest;
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

  _calculateScore() {}

  _timerStart() {}

  _timerFinished() {
    document.getElementById("play").innerText = "[G] Go!";
    this.textEditorElement.blur();
  }

  setup() {
    this.problemSetManager.addEventListener("testSelected", this._onTestSelected.bind(this));
    this.timingManger.addEventListener("timerStart", this._timerStart.bind(this));
    this.timingManger.addEventListener("timerFinished", this._timerFinished.bind(this));

    const playBtn = document.getElementById("play");

    this.textEditorElement.addEventListener("focusin", () => {});
    this.textEditorElement.addEventListener("focusout", () => {});

    playBtn.addEventListener("click", () => {
      if (this.timingManger.running || this.timingManger.primed) {
        this.timingManger.finish();
        return;
      }

      playBtn.innerText = "[:q] Stop";
      this.timingManger.prime();
      document.getElementById("text-editor").tabIndex = -1;
      document.getElementById("text-editor").focus();
    });
  }

  /**
   * @param {KeyboardEvent} ev
   */
  keydown(ev) {
    let key = ev.key;
    if (this.timingManger.primed) this.timingManger.run();
  }
}
