export class SuiteManager extends EventTarget {
  // Releated Elements
  suiteDropdownElement = document.getElementById("suite");
  suiteDropdownContentElements = Array.from(this.suiteDropdownElement.querySelector(".dropdown-content").children);
  suiteCurrentValueElement = this.suiteDropdownElement.querySelector(".current-value");
  suiteTypeHeader = document.getElementById("suite-value");
  cacheCheckbox = document.getElementById("cache-btn");
  _useLocalCache = true;

  // Constants
  TESTS_ORIGIN = "../../assets/test-suites";

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
      name: "Vim",
      type: "Action",
      tests: ["example1.json"],
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
    this._updateUI();

    // Add event listners for each button.
    for (const suiteBtn of this.suiteDropdownContentElements) {
      suiteBtn.addEventListener("click", this._onSuiteClick.bind(this, suiteBtn));
    }

    // Optional Caching
    this._useLocalCache = JSON.parse(localStorage.getItem("should-cache") ?? "true");

    if (this._useLocalCache) {
      this.cacheCheckbox.checked = this._useLocalCache;
      localStorage.setItem("should-cache", this._useLocalCache);
    }

    this.cacheCheckbox.addEventListener(
      "click",
      function() {
        this._useLocalCache = this.cacheCheckbox.checked;
        localStorage.setItem("should-cache", this._useLocalCache);
      }.bind(this),
    );
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
    this.suiteTypeHeader.innerText = this.selectedSuite.type;
    for (const suiteBtn of this.suiteDropdownContentElements) {
      if (suiteBtn.innerText.includes(this.selectedSuiteName)) suiteBtn.classList.add("selected");
      else suiteBtn.classList.remove("selected");
    }
  }

  _fetchAndCache(url) {
    fetch(url)
      .then((response) => response.text())
      .then((txt) => {
        if (this._useLocalCache) localStorage.setItem(url, txt);
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

    if (this.selectedSuite.tests.length > 1) {
      const curIndex = this._randomIndex;
      let attempt = 0;
      while (this._randomIndex === curIndex && attempt < 5) {
        attempt++;
        this._randomIndex = Math.floor(Math.random() * this.selectedSuite.tests.length);
      }
    } else {
      this._randomIndex = 0;
    }

    const randomTestPath = this.selectedSuite.tests[this._randomIndex];

    const url = `${this.TESTS_ORIGIN}/${this.selectedSuiteName}/${randomTestPath}`;
    const cachedData = localStorage.getItem(url);

    // Async call: will dispatch event independantly.
    if (!cachedData) return this._fetchAndCache(url);

    this.currentTest = cachedData;
    this.dispatchEvent(new Event("testUpdated"));
  }
}
