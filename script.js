import { ThemeManager } from "./theme-manager.js";
import { NavigationMangager } from "./navigation-manager.js";
import { TextEditorManager } from "./text-editor-manager.js";
import { ContextManager } from "./context-manager.js";

// Manage Theme
const themeManager = new ThemeManager();
themeManager.setup();

// Manage KeyPress and Context
const navigationManager = new NavigationMangager();
const textEditor = new TextEditorManager();
const keyPressManager = new ContextManager({
	navigationManager,
	textEditor,
});
