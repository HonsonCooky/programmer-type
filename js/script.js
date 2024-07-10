import { ThemeManager } from "./theme-manager.js";
import { NavigationMangager } from "./navigation-manager.js";
import { TextEditorManager } from "./text-editor-manager.js";
import { ContextManager } from "./context-manager.js";
import { ProblemSetManager } from "./problem-set-manager.js";

// Manage Theme
const themeManager = new ThemeManager();
themeManager.setup();

// Manage major Contexts
const problemSetManager = new ProblemSetManager();

const navigationManager = new NavigationMangager({ problemSetManager });
const textEditorManager = new TextEditorManager({ problemSetManager });

const contextManager = new ContextManager({ navigationManager, textEditor: textEditorManager });
contextManager.setup();
