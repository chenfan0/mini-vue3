import { createApp } from "../../lib/mini-vue.esm.js";

// import { App } from "./App.js";
import { App } from "./emit/App.js";
createApp(App).mount(document.querySelector("#app"));
