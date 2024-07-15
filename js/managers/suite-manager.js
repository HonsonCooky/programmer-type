export class SuiteManager extends EventTarget {
  // Releated Elements
  suiteDropdownElement = document.getElementById("suite");
  suiteDropdownContentElements = Array.from(this.suiteDropdownElement.querySelector(".dropdown-content").children);
  suiteCurrentValueElement = this.suiteDropdownElement.querySelector(".current-value");

  // Constants
  TESTS_ORIGIN = "../../tests";

  // Hardcoding these to avoid needing a database or GitHub API call.
  SUITES = [
    {
      name: "CSharp",
      type: "Code",
      tests: ["example1.cs", "example2.cs"],
    },
    {
      name: "FSharp",
      type: "Code",
      tests: ["example1.fs", "example2.fs"],
    },
    {
      name: "Neovim",
      type: "Action",
      tests: ["example1.js"],
    },
    {
      name: "TypeScript",
      type: "Code",
      tests: ["example1.ts", "example2.ts"],
    },
  ];

  constructor() {
    super();

    // Init selected test suite.
    this.selectedSuiteName = this.suiteCurrentValueElement.innerText;
    this._findSelectedSuite();

    // Add event listners for each button.
    for (const suiteBtn of this.suiteDropdownContentElements) {
      if (suiteBtn.innerText.includes(this.selectedSuiteName)) suiteBtn.classList.add("selected");
      suiteBtn.addEventListener("click", this._onSuiteClick.bind(this, suiteBtn));
    }
  }

  _onSuiteClick(suiteBtn) {
    this.selectedSuiteName = suiteBtn.innerText.replace(/\[.\]\s/g, "");
    this._findSelectedSuite();
    this._updateUI();
    this.updateRandomTest();
    this.dispatchEvent(new Event("suiteUpdated"));
  }

  _findSelectedSuite() {
    const possibleSuites = this.SUITES.filter((i) => i.name === this.selectedSuiteName);
    if (possibleSuites.length === 0) {
      return;
    }

    this.selectedSuite = possibleSuites[0];
  }

  _updateUI() {
    this.suiteCurrentValueElement.innerText = this.selectedSuiteName;
    for (const suiteBtn of this.suiteDropdownContentElements) {
      if (suiteBtn.innerText.includes(this.selectedSuiteName)) suiteBtn.classList.add("selected");
      else suiteBtn.classList.remove("selected");
    }
  }

  _fetchAndCache(url) {
    fetch(url)
      .then((response) => response.text())
      .then((txt) => {
        localStorage.setItem(url, txt);
        this.currentTest = txt;
        this.dispatchEvent(new Event("testUpdated"));
      });
  }

  /**
   * @param {string} set
   * @returns {Promise<string|undefined>}
   */
  updateRandomTest() {
    this.dispatchEvent(new Event("updatingTest"));
    if (!this.selectedSuite) {
      console.error("No selected suite", this.selectedSuite);
      return;
    }

    const curIndex = this._randomIndex;
    while (this._randomIndex === curIndex)
      this._randomIndex = Math.floor(Math.random() * this.selectedSuite.tests.length);

    const randomTestPath = this.selectedSuite.tests[this._randomIndex];

    const url = `${this.TESTS_ORIGIN}/${this.selectedSuiteName}/${randomTestPath}`;
    const cachedData = localStorage.getItem(url);

    // Async call: will dispatch event independantly.
    if (!cachedData) return this._fetchAndCache(url);

    this.currentTest = cachedData;
    this.dispatchEvent(new Event("testUpdated"));
  }
}
