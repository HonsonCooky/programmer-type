/**
 * @typedef {"Action"|"Code"} SuiteType
 */

/**
 * @typedef {Object} SuiteItem
 * @property {string} name - The name of the suite.
 * @property {SuiteType} type - The type of the suite.
 * @property {string} shortcut - The type of the suite.
 * @property {Array<string>} tests - An array of paths to the test files for the suite.
 */

/**
 * Class representing a database of test suites.
 */
class SuiteDb {
  /**
   * @private
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

  /**
   * Get the names of all suites.
   */
  getSuites() {
    return this.#suites.map(({ name, type, shortcut }) => ({ name, type, shortcut }));
  }

  /**
   * @param {string} suiteName
   */
  getTests(suiteName) {
    const suite = this.#suites.find((s) => s.name === suiteName);
    if (!suite) return [];
    return Object.freeze(suite.tests);
  }
}

/**
 * An instance of the SuiteDb class.
 * @type {SuiteDb}
 */
export const SuiteDataBase = new SuiteDb();
