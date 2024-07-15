export class SuiteManager extends EventTarget {
  // Releated Elements
  suiteDropdownElement = document.getElementById("suite");
  suiteDropdownContentElements = Array.from(this.suiteDropdownElement.querySelector(".dropdown-content").children);
  suiteCurrentValueElement = this.suiteDropdownElement.querySelector(".current-value");

  // Constants
  TESTS_ORIGIN = "https://api.github.com/repos/HonsonCooky/programmer-type/contents/tests";
  SUITES = [
    {
      name: "TypeScript",
      type: "Code",
      tests: ["example1.ts", "example2.ts"],
    },
    {
      name: "CSharp",
      type: "Code",
      tests: ["example1.cs", "example2.cs"],
    },
    {
      name: "Neovim",
      type: "Action",
      tests: ["example1.cmd"],
    },
  ];

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
      console.log("Unknown Test Suite", this.selectedSuiteName);
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
    console.warn("Using GitHub API");
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const txt = atob(data.content);
        localStorage.setItem(url, JSON.stringify(txt));
        this.currentTest = txt;
        this.dispatchEvent(new Event("testUpdated"));
      });
  }

  setup() {
    // Init selected test suite.
    this.selectedSuiteName = this.suiteCurrentValueElement.innerText;
    this._findSelectedSuite();

    // Add event listners for each button.
    for (const suiteBtn of this.suiteDropdownContentElements) {
      if (suiteBtn.innerText.includes(this.selectedSuiteName)) suiteBtn.classList.add("selected");
      suiteBtn.addEventListener("click", this._onSuiteClick.bind(this, suiteBtn));
    }
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
    const randomIndex = Math.floor(Math.random() * this.selectedSuite.tests.length);
    const randomTestPath = this.selectedSuite.tests[randomIndex];

    const url = `${this.TESTS_ORIGIN}/${this.selectedSuiteName}/${randomTestPath}`;
    const cachedData = localStorage.getItem(url);

    // Async call: will dispatch event independantly.
    if (!cachedData) return this._fetchAndCache(url);

    this.currentTest = JSON.parse(cachedData);
    this.dispatchEvent(new Event("testUpdated"));
  }
}
