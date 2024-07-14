import { DurationManager } from "./duration-manager.js";
import { Navigation } from "./navigation.js";
import { Program } from "./program.js";
import { SuiteManager } from "./suite-manager.js";
import { TextEditor } from "./text-editor.js";
import { ThemeManager } from "./theme-manager.js";
import { TimeManager } from "./time-manager.js";

const context = new Program();
context.setup({
  // Managers
  themeManager: new ThemeManager(),
  suiteManager: new SuiteManager(),
  durationManager: new DurationManager(),
  timeManager: new TimeManager(),

  // Contexts
  textEditor: new TextEditor(),
  navigator: new Navigation(),
});
