import { TestsManager } from "./tests-manager.js"

export class NavigationMangager {
	keymappings = {
		d: {
			element: document.getElementById("duration-select")
		},
		p: {
			element: document.getElementById("duration-select")
		}
	}

	setup() {
		this.testsManager = new TestsManager();
		this.testsManager.setup().then(() => {
			console.log(this.testsManager.testsList);
		})
	}

	/**
	* @param {KeyboardEvent} ev
	*/
	keydown(ev) { }

	lostFocus() { }
}
