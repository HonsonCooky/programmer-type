import { DurationManager } from "./duration-manager.js";
import { KeyboardInputManager } from "./keyboard-input-manager.js";
import { NavigationMangager } from "./navigation-manager.js";
import { SuiteManager } from "./suite-manager.js";
import { TextEditorManager } from "./text-editor-manager.js";
import { ThemeManager } from "./theme-manager.js";
import { TimeManager } from "./time-manager.js";

// Independant managers
window.themeManager = new ThemeManager();
window.suiteManager = new SuiteManager();
window.durationManager = new DurationManager();

// Dependant managers, require initialization of above
window.timeManager = new TimeManager(); // USE: DurationManager

// Major Context Managers
window.textEditorManager = new TextEditorManager(); // USE: SuiteManager, TimeManager
window.navigationManager = new NavigationMangager();

window.keyboardInputManager = new KeyboardInputManager(); // CONNECTS: NavigationMangager, TextEditorManager
