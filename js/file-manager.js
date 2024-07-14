export class FileManager {
  testsOrigin = "https://api.github.com/repos/HonsonCooky/programmer-type/contents/tests";

  async _fetch(path) {
    const url = `${this.testsOrigin}/${path ?? ""}`;
    const cachedData = localStorage.getItem(url);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    console.warn("Using GitHub API");
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem(url, JSON.stringify(data));
        localStorage.setItem(url + ":timestamp", Date.now());
        return data;
      });
  }

  async fetchSets() {
    return await this._fetch();
  }

  async fetchSetData(set) {
    const tests = await this._fetch(set).then((items) => items.filter((item) => !item.name.startsWith("_")));
    const metaData = await this._fetch(`${set}/_meta.json`).then((data) => JSON.parse(atob(data.content)));
    return {
      tests,
      metaData,
    };
  }

  async fetchTest(set, test) {
    return await this._fetch(`${set}/${test}`).then((data) => atob(data.content));
  }
}
