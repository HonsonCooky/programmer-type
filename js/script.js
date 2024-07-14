import { DurationManager } from "./duration-manager.js";
import { KeyboardInputManager } from "./keyboard-input-manager.js";
import { NavigationMangager } from "./navigation-manager.js";
import { SuiteManager } from "./suite-manager.js";
import { TextEditorManager } from "./text-editor-manager.js";
import { ThemeManager } from "./theme-manager.js";
import { TimeManager } from "./time-manager.js";

const suiteManager = new SuiteManager();
const durationManger = new DurationManager();
const themeManager = new ThemeManager();

const timeManager = new TimeManager();
const navigationManager = new NavigationMangager();
const textEditorManager = new TextEditorManager();
const keyboardInputManager = new KeyboardInputManager({ navigationManager, textEditorManager });
