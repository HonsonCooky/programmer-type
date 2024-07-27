/**
 * @typedef {Object} SuiteItem
 * @property {string} name - The name of the suite.
 * @property {string} type - The type of the suite.
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
   * @param {string[]} avoid
   */
  async getRandomTest(suiteName, avoid = []) {
    const suite = this.#suites.find((s) => s.name === suiteName);
    if (!suite) return new Response(`Unable to find test suite "${suiteName}"`, { status: 400 });

    const potentialTests = suite.tests.filter((t) => !avoid.includes(t));
    if (potentialTests.length === 0) potentialTests = suite.tests;

    const randomIndex = Math.floor(Math.random() * potentialTests.length);
    const randomTest = potentialTests[randomIndex];

    const testContent = await fetch(`./test-suites/${suiteName}/${randomTest}`);
    if (!testContent.ok) return new Response(`Failed to GET ${suiteTestPath}`, { status: 400 });

    const resObj = { suite, testData: await testContent.text() };
    return new Response(JSON.stringify(resObj), { status: 200 });
  }
}

/**
 * An instance of the SuiteDb class.
 * @type {SuiteDb}
 */
export const SuiteDataBase = new SuiteDb();
