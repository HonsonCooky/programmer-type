import { SuiteDataBase } from "../../db/suites.js";

export class Suite extends EventTarget {
  #dropdown = document.getElementById("_s_suite");
  #options = this.#dropdown.querySelector(".dropdown-content");
  #displayValue = document.getElementById("suite-value");

  constructor() {
    super();

    // Load Suite Buttons
    const suites = SuiteDataBase.getSuites();
    suites.forEach((s) => {
      const suiteBtn = document.createElement("button");
      suiteBtn.id = `_s${s.shortcut}_suite-${s.name.toLowerCase()}`;
      suiteBtn.innerHTML = `<span>[${s.shortcut.toUpperCase()}] ${s.name}</span><i>${s.type}</i>`;
      suiteBtn.addEventListener("click", () => this.#selectSuite(s));

      this.#options.appendChild(suiteBtn);
    });

    // Load initial suite
    this.#selectSuite(suites[0]);

    // Ensure post construction event listeners can trigger
    this.init = () => this.#selectSuite(suites[0]);
  }

  /**@param {{ name: string; type: string; shortcut: string; }} suite */
  #selectSuite(suite) {
    this.#displayValue.innerHTML = `<span class="value">${suite.name}</span> : <span class="value2">${suite.type}</span>`;
    Array.from(this.#options.children).forEach((child) => {
      if (child.tagName != "BUTTON") return;
      if (child.innerText.includes(suite.name)) child.classList.add("selected");
      else child.classList.remove("selected");
    });
    this.dispatchEvent(new CustomEvent("updated", { detail: suite }));
  }
}
