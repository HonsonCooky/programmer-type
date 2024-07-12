import { ThemeManager } from "./theme-manager.js";
import { NavigationMangager } from "./navigation-manager.js";
import { TextEditorManager } from "./text-editor-manager.js";
import { ContextManager } from "./context-manager.js";
import { ProblemSetManager } from "./problem-set-manager.js";
import { TimingManager } from "./timing-manager.js";

// Manage Theme
const themeManager = new ThemeManager();
themeManager.setup();

// Manage major Contexts
const problemSetManager = new ProblemSetManager();
const timingManger = new TimingManager();

const navigationManager = new NavigationMangager({ problemSetManager, timingManger });
const textEditorManager = new TextEditorManager({ problemSetManager, timingManger });
textEditorManager.setup();

const contextManager = new ContextManager({ navigationManager, textEditorManager });
contextManager.setup();

// Load in problem sets - Do last so references and event listeners are ready to go.
await problemSetManager.setup();
timingManger.setup();
