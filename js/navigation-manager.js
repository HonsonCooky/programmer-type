import { ProblemSetManager } from "./problem-set-manager.js";

class NavigationKeyboardManager {
	keyMappings = {
		d: {
			element: document.getElementById("duration-select"),
			0: {
				element: document.getElementById("duration-15"),
				action: "click",
			},
			1: {
				element: document.getElementById("duration-30"),
				action: "click",
			},
			2: {
				element: document.getElementById("duration-60"),
				action: "click",
			},
			3: {
				element: document.getElementById("duration-90"),
				action: "click",
			},
			4: {
				element: document.getElementById("duration-120"),
				action: "click",
			},
			5: {
				element: document.getElementById("duration-infinite"),
				action: "click",
			},
		},
		h: {
			element: document.getElementById("help"),
		},
		p: {
			element: document.getElementById("duration-select"),
		},
	};
}

export class NavigationMangager {

	/**
	 * @param {Object} param0
	 * @param {ProblemSetManager} param0.problemSetManager
	 */
	constructor({ problemSetManager }) {
		this.problemSetManager = problemSetManager;
		this.currentKeyMap = this.keyMappings;
	}


	_onSetsLoaded() {
		const problemSetDropdownContent = document.getElementById("problem-set-select").querySelector(".dropdown-content");
		for (const set of this.problemSetManager.sets) {
			const btn = document.createElement("button");
			btn.innerText = set.title;
			btn.addEventListener("click", () => {
				this.problemSetManager.selectSet(set);
			});
			problemSetDropdownContent.appendChild(btn);
		}
	}

	_onSetSelected() {
		// Update Label
		const problemSetLabel = document.getElementById("problem-set-selected");
		problemSetLabel.innerText = this.problemSetManager.selectedSet.title;

		// Highlight Selected
		Array.from(document.getElementById("problem-set-select").querySelector(".dropdown-content").children).forEach(
			(child) => {
				if (child.innerText === this.problemSetManager.selectedSet.title) child.style.color = "var(--rose)";
				else child.style.color = "var(--text)";
			},
		);

		console.log(this.problemSetManager.selectedSet);
	}

	setup() {
		this.problemSetManager.addEventListener("setsLoaded", this._onSetsLoaded.bind(this));
		this.problemSetManager.addEventListener("setSelected", this._onSetSelected.bind(this));
	}

	/**
	 * @param {KeyboardEvent} ev
	 */
	keydown(ev) {
		let key = ev.key;
		let newMap = this.currentKeyMap[key];

		if (!newMap) {
			this.currentKeyMap = this.keyMappings;
			return;
		}
	}

	lostFocus() { }
}
