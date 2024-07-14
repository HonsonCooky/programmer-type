export class DurationManager extends EventTarget {
  durationDropdownElement = document.getElementById("duration");
  durationDropdownContentElements = Array.from(
    this.durationDropdownElement.querySelector(".dropdown-content").children,
  );
  durationCurrentValueElement = this.durationDropdownElement.querySelector(".current-value");

  _updateUI() {
    this.durationCurrentValueElement.innerText = this.selectedDuration;
    for (const durationBtn of this.durationDropdownContentElements) {
      if (durationBtn.innerText.includes(this.selectedDuration)) durationBtn.classList.add("selected");
      else durationBtn.classList.remove("selected");
    }
  }

  /**
   * @param {HTMLElement} btn
   */
  _durationChangeAction(btn) {
    return function () {
      this.selectedDuration = btn.innerText.replace(/\[.\]\s/g, "");
      this._updateUI();
      this.dispatchEvent(new Event("durationUpdated"));
    };
  }

  constructor() {
    super();
    this.selectedDuration = this.durationCurrentValueElement.innerText;
    for (const durationBtn of this.durationDropdownContentElements) {
      if (durationBtn.innerText.includes(this.selectedDuration)) durationBtn.classList.add("selected");
      durationBtn.addEventListener("click", this._durationChangeAction(durationBtn).bind(this));
    }
  }
}
