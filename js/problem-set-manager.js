export class ProblemSetManager extends EventTarget {
	problemSetDescription = document.getElementById("description");
	problemSetLabel = document.getElementById("problem-set-selected");
	problemSetDropdownContent = document.getElementById("problem-set-select").querySelector(".dropdown-content");

	async setup() {
		this.sets = await this._getFolderContents("/");

		for (const set of this.sets) {
			const btn = document.createElement("button");
			btn.innerText = set.title;
			btn.addEventListener("click", () => {
				this.selectSet(set);
			});
			this.problemSetDropdownContent.appendChild(btn);
		}

		if (this.sets[0]) await this.selectSet(this.sets[0]);
	}

	/**
	 *
	 * @param {string} folder
	 * @returns {Promise<{title:string, isDirectory: boolean}[]>}
	 */
	async _getFolderContents(folder) {
		const fetchFiles = await fetch(`${window.location.origin}/tests${folder}`).then((res) => res.text());
		return Array.from(fetchFiles.matchAll(/class="([^"]*)" title="([^"]*)"/g))
			.map(([_, c, t]) => {
				return { title: t, isDirectory: c.includes("directory") };
			})
			.filter((o) => o.title != "..");
	}

	_updateUI() {
		this.problemSetLabel.innerText = this.selectedSet.title;
		Array.from(this.problemSetDropdownContent.children).forEach((child) => {
			if (child.innerText === this.selectedSet.title) child.style.color = "var(--rose)";
			else child.style.color = "var(--text)";
		});

		switch (this.selectedSet.metaData.type) {
			case "programming":
				this.problemSetDescription.innerHTML =
					"<b>Programming:</b> A simple typing test. Type out the sequence of characters as best you can.<br/>Indentation is done automatically, but you will need to enter new lines.";
				break;
		}
	}

	/** @param {{title: string, isDirectory: boolean}} set  */
	async selectSet(set) {
		if (!set.isDirectory) return;

		const examples = await this._getFolderContents(`/${set.title}`);
		if (examples.length === 0) return;

		const metaData = await fetch(`${window.location.origin}/tests/${set.title}/_meta.json`).then((res) => res.json());
		if (!metaData) return;

		this.selectedSet = set;
		this.selectedSet.metaData = metaData;
		this.selectedSet.examples = examples.filter((o) => o.title.startsWith("example"));

		this._updateUI();
		this.dispatchEvent(new Event("setSelected"));
		this.selectNextExample();
	}

	async selectNextExample() {
		const nextIndex = Math.floor(Math.random() * this.selectedSet.examples.length);
		const nextExample = this.selectedSet.examples[nextIndex];
		this.currentExample = await fetch(
			`${window.location.origin}/tests/${this.selectedSet.title}/${nextExample.title}`,
		).then((res) => res.blob());
		this.dispatchEvent(new Event("exampleSelected"));
	}
}
