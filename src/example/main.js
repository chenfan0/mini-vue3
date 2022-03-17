import { createApp, h } from "../../lib/mini-vue.esm.js";

// import { App } from "./App.js";
// import { App } from "./emit/App.js";
// import App from "./slots/App.js";
// import App from "./getCurrentInstance/App.js";
// import App from "./provide_inject/App.js";
// import { App } from "./update_props/App.js";
// import { App } from "./update_children/App.js";
// import { App } from "./update_children/Diff.js";
// import { App } from "./update_component/App.js";
// import { App } from "./nextTick/App.js";
import App from "./app.component/App.js";

const app = createApp(App);

app.component("myComponent", {
  render() {
    return h("h1", {}, "my-component");
  },
});

app.mount(document.querySelector("#app"));
