export class FileManager extends EventTarget {
  testsOrigin = "https://api.github.com/repos/HonsonCooky/programmer-type/contents/tests";
  suites = [
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

  /**
   * @param {string} set
   * @returns {Promise<string|undefined>}
   */
  async updateRandomTest(set) {
    const setObjs = this.suites.filter((i) => i.name === set);
    if (setObjs.length === 0) {
      console.log("Unknown Test Suite", set);
      return;
    }

    const setObj = setObjs[0];
    const randomIndex = Math.floor(Math.random() * setObj.tests.length);
    const randomTestPath = setObj.tests[randomIndex];

    const url = `${this.testsOrigin}/${set}/${randomTestPath}`;
    const cachedData = localStorage.getItem(url);

    if (cachedData) {
      this.currentTest = JSON.parse(cachedData);
    } else {
      console.warn("Using GitHub API");
      this.currentTest = await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const txt = atob(data.content);
          localStorage.setItem(url, JSON.stringify(txt));
          return txt;
        });
    }

    this.dispatchEvent(new Event("testUpdated"));
  }
}
