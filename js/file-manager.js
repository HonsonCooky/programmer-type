export class FileManager {
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

	async _fetch(path) {
		const url = `${this.testsOrigin}/${path}`;
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
		return await this._fetch(set).then((items) =>
			items.filter((item) => !item.name.startsWith("_") && item.type != "dir"),
		);
	}

	async fetchTest(set, test) {
		return await this._fetch(`${set}/${test}`).then((data) => atob(data.content));
	}
}
