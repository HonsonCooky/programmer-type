import { DurationManager } from "./duration-manager.js";
import { KeyboardInputManager } from "./keyboard-input-manager.js";
import { NavigationMangager } from "./navigation-manager.js";
import { SuiteManager } from "./suite-manager.js";
import { TextEditorManager } from "./text-editor-manager.js";
import { ThemeManager } from "./theme-manager.js";
import { TimeManager } from "./time-manager.js";

window.suiteManager = new SuiteManager();
window.durationManager = new DurationManager();
window.themeManager = new ThemeManager();

window.timeManager = new TimeManager();
window.navigationManager = new NavigationMangager();
window.textEditorManager = new TextEditorManager();
window.keyboardInputManager = new KeyboardInputManager();
