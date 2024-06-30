const themeAttr = "theme";
const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const theme = isDark ? "dark" : "light";
document.documentElement.setAttribute(themeAttr, theme);

const nav = document.getElementById("nav");
const languageSelectBtn = document.getElementById("language-select");

function languageSelectActions(event) {
	const dropdown = languageSelectBtn.parentElement;
}

function focusNavActions(event) {
	if (document.activeElement != nav) return;

	const key = event.key.toLowerCase();

	// Remove Nav Focus
	if (key === "n" || key === "escape") {
		window.removeEventListener("keydown", focusNavActions);
		languageSelectBtn.querySelector("span").innerHTML = "Language Select";
		nav.blur();
		return;
	}

	// Select Language
	if (key === "l") {
	}
}

function focusNav() {
	nav.tabIndex = -1;
	nav.focus();
	languageSelectBtn.querySelector("span").innerHTML = "[L]anguage Select";
	window.addEventListener("keydown", focusNavActions);
}

window.addEventListener("keydown", (event) => {
	const key = event.key.toLowerCase();
	if (document.activeElement != document.body) return;

	if (key === "n") {
		event.preventDefault();
		focusNav();
	}
});
