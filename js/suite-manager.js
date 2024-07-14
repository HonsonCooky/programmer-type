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
  ];

  constructor() {
    super();

    // Init selected test suite.
    this.selectedSuite = this.suiteCurrentValueElement.innerText;

    // Add event listners for each button.
    for (const suiteBtn of this.suiteDropdownContentElements) {
      if (suiteBtn.innerText.includes(this.selectedSuite)) suiteBtn.classList.add("selected");
      suiteBtn.addEventListener("click", this._onSuiteClick.bind(this, suiteBtn));
    }
  }

  _onSuiteClick(suiteBtn) {
    this.selectedSuite = suiteBtn.innerText.replace(/\[.\]\s/g, "");
    this.updateRandomTest();
    this._updateUI();
    this.dispatchEvent(new Event("suiteUpdated"));
  }

  _updateUI() {
    this.suiteCurrentValueElement.innerText = this.selectedSuite;
    for (const suiteBtn of this.suiteDropdownContentElements) {
      if (suiteBtn.innerText.includes(this.selectedSuite)) suiteBtn.classList.add("selected");
      else suiteBtn.classList.remove("selected");
    }
  }

  _fetchAndCache() {
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

  /**
   * @param {string} set
   * @returns {Promise<string|undefined>}
   */
  updateRandomTest() {
    const setObjs = this.SUITES.filter((i) => i.name === this.selectedSuite);
    if (setObjs.length === 0) {
      console.log("Unknown Test Suite", this.selectedSuite);
      return;
    }

    const setObj = setObjs[0];
    const randomIndex = Math.floor(Math.random() * setObj.tests.length);
    const randomTestPath = setObj.tests[randomIndex];

    const url = `${this.TESTS_ORIGIN}/${this.selectedSuite}/${randomTestPath}`;
    const cachedData = localStorage.getItem(url);

    if (!cachedData) return this._fetchAndCache();

    this.currentTest = JSON.parse(cachedData);
    this.dispatchEvent(new Event("testUpdated"));
  }
}
