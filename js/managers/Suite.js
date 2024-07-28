import { SuiteDataBase } from "../../db/suites.js";

export class Suite extends EventTarget {
  #dropdown = document.getElementById("_s_suite");
  #options = this.#dropdown.querySelector(".dropdown-content");
  #displayValue = this.#dropdown.querySelector(".current-value");
  #suiteTypeValue = document.getElementById("suite-value");

  constructor() {
    super();

    // Load Suite Buttons
    const suites = SuiteDataBase.getSuites();
    suites.forEach((s) => {
      const suiteBtn = document.createElement("button");
      suiteBtn.id = `_s${s.shortcut}_suite-${s.name.toLowerCase()}`;
      suiteBtn.innerHTML = `[${s.shortcut.toUpperCase()}] ${s.name}<br/>&emsp;&emsp;<i>-${s.type}-</i>`;
      suiteBtn.addEventListener("click", () => this.#selectSuite(s));

      this.#options.appendChild(suiteBtn);
    });

    // Load initial suite
    this.#selectSuite(suites[suites.length - 1]);

    // Ensure post construction event listeners can trigger
    this.init = () => this.#selectSuite(suites[suites.length - 1]);
  }

  /**@param {{ name: string; type: string; shortcut: string; }} suite */
  #selectSuite(suite) {
    this.#displayValue.innerText = suite.name;
    this.#suiteTypeValue.innerText = suite.type;
    Array.from(this.#options.children).forEach((child) => {
      if (child.tagName != "BUTTON") return;
      if (child.innerText.includes(suite.name)) child.classList.add("selected");
      else child.classList.remove("selected");
    });
    this.dispatchEvent(new CustomEvent("updated", { detail: suite }));
  }
}
