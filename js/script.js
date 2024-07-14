import { DurationManager } from "./duration-manager.js";
import { FileManager } from "./file-manager.js";
import { SuiteManager } from "./suite-manager.js";
import { ThemeManager } from "./theme-manager.js";

const themeManager = new ThemeManager();

const fileManager = new FileManager();
const suiteManager = new SuiteManager({ fileManager });

const durationManger = new DurationManager();
