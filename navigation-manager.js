export class NavigationMangager {
	keymaps = {
		d: {
			element: document.getElementById("duration-select"),
		},
		g: {
			element: document.getElementById("play"),
			action: "click",
			noReset: true,
		},
		h: {
			element: document.getElementById("help"),
		},
		l: {
			element: document.getElementById("language-select"),
		},
		t: {
			element: document.getElementById("theme-select"),
			s: {
				element: document.getElementById("system-theme"),
				action: "click",
			},
			l: {
				element: document.getElementById("light-theme"),
				action: "click",
			},
			d: {
				element: document.getElementById("dark-theme"),
				action: "click",
			},
		},
	};
	currentKeyPath = this.keymaps;
	escapeCount = 0;

	constructor() {
		window.addEventListener("keydown", (event) => this.keyPress(event.key.toLowerCase()));
	}

	keyPress(key) {
		if (this.currentKeyPath.noReset) {
			if (this.escapeCount < 2) {
				if (key === "escape") this.escapeCount++;
				return;
			}
		}

		if (key === "escape") {
			this.escape();
			return;
		}

		let keyPath = this.currentKeyPath[key];

		if (!keyPath) {
			this.reset();
			return;
		}

		this.newKeyPath(keyPath, key);
	}

	escape() {
		this.escapeCount = 0;
		this.reset();
	}

	reset() {
		document.getElementById("key-context").innerText = "*base*";
		document.activeElement.blur();
		this.currentKeyPath = this.keymaps;
	}

	newKeyPath(keyPath, key) {
		const keyPathIndicator = document.getElementById("key-context");
		if (keyPathIndicator.innerText === "*base*") keyPathIndicator.innerText = key;
		else keyPathIndicator.innerText += `-${key}`;

		this.currentKeyPath = keyPath;

		if (this.currentKeyPath.action) {
			if (this.currentKeyPath.element) this.currentKeyPath.element[this.currentKeyPath.action]();
			else this.currentKeyPath.action();
			if (!this.currentKeyPath.noReset) this.reset();
			return;
		}

		if (this.currentKeyPath.element) {
			this.currentKeyPath.element.tabIndex = -1;
			this.currentKeyPath.element.focus();
		}
	}
}
