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
  #cacheBtn = document.getElementById("_c_cache");
  #lastTestName = "";

  constructor() {
    this.#cacheBtn.addEventListener("click", () => {
      this.#cacheBtn.className = this.#shoudCache() ? "off" : ""; // Toggle

      if (!this.#shoudCache()) this.#clearLocalStorage();
      localStorage.setItem("PTCache", this.#shoudCache());
    });

    const shouldCacheInit = localStorage.getItem("PTCache") === "true" ?? false;
    this.#cacheBtn.className = shouldCacheInit ? "" : "off";
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
      tests: [
        "Arrays.cs",
        "Classes.cs",
        "Conditionals.cs",
        "Exceptions.cs",
        "HelloWorld.cs",
        "Inheritance.cs",
        "Interfaces.cs",
        "Loops.cs",
        "Methods.cs",
        "Variables.cs",
      ],
    },
    {
      name: "FSharp",
      type: "Code",
      shortcut: "f",
      tests: [
        "Arrays.fs",
        "Combined.fs",
        "Conditionals.fs",
        "DiscriminatedUnions.fs",
        "HelloWorld.fs",
        "Interfaces.fs",
        "Records.fs",
      ],
    },
    {
      name: "TypeScript",
      type: "Code",
      shortcut: "t",
      tests: [
        "AsyncAwait.ts",
        "Basic.ts",
        "Enums.ts",
        "Generics.ts",
        "Interfaces.ts",
        "MappedTypes.ts",
        "TypeAssertions.ts",
        "UnionTypes.ts",
      ],
    },
    {
      name: "Vim",
      type: "Action",
      shortcut: "v",
      tests: ["CopyBuffer.json"],
    },
  ];

  /** Determine if a test should be cached */
  #shoudCache() {
    return !this.#cacheBtn.classList.contains("off");
  }

  #clearLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key.startsWith("PT")) {
        localStorage.removeItem(key);
      }
    }
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
 * A singleton instance of the SuiteDb class.
 * @type {SuiteDb}
 */
export const SuiteDataBase = new SuiteDb();
