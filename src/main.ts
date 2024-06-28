import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";

import { addIcons, OhVueIcon } from "oh-vue-icons";
import { BiChevronDown, SiTypescript } from "oh-vue-icons/icons";

addIcons(BiChevronDown, SiTypescript);

const app = createApp(App);
app.component("v-icon", OhVueIcon);
app.mount("#app");
