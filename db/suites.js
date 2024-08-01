/**
 * @typedef {"Action"|"Code"} SuiteType
 */

/**
 * @typedef {Object} SuiteItem
 * @property {string} name - The name of the suite.
 * @property {SuiteType} type - The type of the suite.
 * @property {string} shortcut - The keyboard shortcut for the suite.
 * @property {Array<string>} tests - An array of paths to the test files for the suite.
 */

/**
 * Class representing a database of test suites.
 */
class SuiteDb {
  #cacheBtn = document.getElementById("cache-btn");
  #lastTestName = "";

  constructor() {
    this.#cacheBtn.addEventListener("click", () => {
      if (!this.#cacheBtn.checked) localStorage.clear();
      localStorage.setItem("PTCache", this.#cacheBtn.checked);
    });

    this.#cacheBtn.checked = localStorage.getItem("PTCache") === "true";
  }

  /**
   * Test URLs must be referenced directly, so this object acts as our DB for
   * all tests.
   * @type {Array<SuiteItem>} An array of suite objects.
   */
  #suites = [
    {
      name: "CSharp",
      type: "Code",
      shortcut: "c",
      tests: ["example1.cs", "example2.cs"],
    },
    {
      name: "FSharp",
      type: "Code",
      shortcut: "f",
      tests: ["example1.fs", "example2.fs"],
    },
    {
      name: "TypeScript",
      type: "Code",
      shortcut: "t",
      tests: ["example1.ts", "example2.ts"],
    },
    {
      name: "Vim",
      type: "Action",
      shortcut: "v",
      tests: ["example1.json"],
    },
  ];

  /** Determine if a test should be cached */
  #shoudCache() {
    return this.#cacheBtn?.checked ?? false;
  }

  /**
   * Get a new test URL based on the currently loaded test suite.
   * @param {string[]} tests
   */
  #getRandomTestURL(suiteName) {
    const suite = this.#suites.find((s) => s.name === suiteName);
    if (!suite) throw Error(`Unknown suite: ${suiteName}`);

    const tests = Object.freeze(suite.tests);
    let unseenTests = tests.filter((t) => this.#lastTestName != t);
    if (unseenTests.length === 0) unseenTests = tests;

    const randomIndex = Math.floor(Math.random() * unseenTests.length);
    const randomTest = unseenTests[randomIndex];
    this.#lastTestName = randomTest;
    return `../db/test-suites/${suiteName}/${randomTest}`;
  }

  /**
   * Get the name, type and shortcut of all suites.
   */
  getSuites() {
    return this.#suites.map(({ name, type, shortcut }) => ({ name, type, shortcut }));
  }

  /**
   * Given a test suite name, return the file contents for a random test.
   * This function will also take care of caching the test if the user has
   * indicated they would like that.
   * @param {string} suiteName
   */
  async getNextTest(suiteName) {
    const testURL = this.#getRandomTestURL(suiteName);
    const local = localStorage.getItem(testURL);
    if (local) return local;

    const remote = await fetch(testURL).then((res) => res.text());
    if (!remote) throw Error(`Unable to GET ${testURL}`);
    if (this.#shoudCache()) localStorage.setItem(testURL, remote);
    return remote;
  }
}

/**
 * An instance of the SuiteDb class.
 * @type {SuiteDb}
 */
export const SuiteDataBase = new SuiteDb();
