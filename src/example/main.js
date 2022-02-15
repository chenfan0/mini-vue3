import { createApp } from "../../lib/mini-vue.esm.js";

// import { App } from "./App.js";
// import { App } from "./emit/App.js";
// import App from "./slots/App.js";
// import App from "./getCurrentInstance/App.js";
// import App from "./provide_inject/App.js";
// import { App } from "./update_props/App.js";
import { App } from "./update_children/App.js";
createApp(App).mount(document.querySelector("#app"));
