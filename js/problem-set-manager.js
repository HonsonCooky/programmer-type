import { FileManager } from "./file-manager.js";

export class ProblemSetManager extends EventTarget {
  problemSetLabel = document.getElementById("problem-set-selected");
  problemSetDropdownContent = document.getElementById("problem-set-select").querySelector(".dropdown-content");

  /**
   * @param {Object} param0
   * @param {FileManager} param0.fileManager
   */
  async setup({ fileManager }) {
    this.fileManager = fileManager;
    this.sets = await this.fileManager.fetchSets();

    for (const set of this.sets) {
      const btn = document.createElement("button");
      btn.innerText = set.name;
      btn.addEventListener("click", () => {
        this.selectSet(set);
      });
      this.problemSetDropdownContent.appendChild(btn);
    }

    await this.selectSet(this.sets.filter((a) => a.name === "TypeScript")[0]);
  }

  _updateUI() {
    this.problemSetLabel.innerText = this.selectedSet.name;
    Array.from(this.problemSetDropdownContent.children).forEach((child) => {
      if (child.innerText === this.selectedSet.name) child.classList.add("selected");
      else child.classList.remove("selected");
    });
  }

  /** @param {{name: string, path: string, isDirectory: boolean}} set  */
  async selectSet(set) {
    if (!set.type === "dir") return;

    const tests = await this.fileManager.fetchSetData(set.name);
    if (!tests) return;

    this.selectedSet = set;
    this.selectedSet.tests = tests;

    this._updateUI();
    this.dispatchEvent(new Event("setSelected"));
    this.selectNextTest();
  }

  async selectNextTest(attempt = 0) {
    try {
      const nextIndex = Math.floor(Math.random() * this.selectedSet.tests.length);
      const nextTest = this.selectedSet.tests[nextIndex];
      this.currentTest = await this.fileManager.fetchTest(this.selectedSet.name, nextTest.name);
      this.dispatchEvent(new Event("testSelected"));
    } catch (e) {
      if (attempt < 3) this.selectNextTest(attempt++);
      else console.error("Unable to load test", e);
    }
  }
}
