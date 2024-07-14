import { FileManager } from "./file-manager.js";

export class SuiteManager extends EventTarget {
  suiteDropdownElement = document.getElementById("suite");
  suiteDropdownContentElements = Array.from(this.suiteDropdownElement.querySelector(".dropdown-content").children);
  suiteCurrentValueElement = this.suiteDropdownElement.querySelector(".current-value");

  _updateUI() {
    this.suiteCurrentValueElement.innerText = this.selectedSuite;
    for (const suiteBtn of this.suiteDropdownContentElements) {
      if (suiteBtn.innerText.includes(this.selectedSuite)) suiteBtn.classList.add("selected");
      else suiteBtn.classList.remove("selected");
    }
  }

  /**
   * @param {HTMLElement} btn
   * @param {FileManager} fileManager
   */
  _suiteChangeAction(btn, fileManager) {
    return async function () {
      this.selectedSuite = btn.innerText.replace(/\[.\]\s/g, "");
      await fileManager.updateRandomTest(this.selectedSuite);
      this._updateUI();
      this.dispatchEvent(new Event("suiteUpdated"));
    };
  }

  /**
   * @param {Object} param0
   * @param {FileManager} param0.fileManager
   */
  constructor({ fileManager }) {
    super();
    this.selectedSuite = this.suiteCurrentValueElement.innerText;
    for (const suiteBtn of this.suiteDropdownContentElements) {
      if (suiteBtn.innerText.includes(this.selectedSuite)) suiteBtn.classList.add("selected");
      suiteBtn.addEventListener("click", this._suiteChangeAction(suiteBtn, fileManager).bind(this));
    }
  }
}
