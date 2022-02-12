import { h } from "../../lib/mini-vue.esm.js";

export const App = {
  setup() {
    const msg = "mini-vue";
    return {
      msg,
    };
  },
  render() {
    return h("div", { class: "red" }, [
      h("p", { class: "p" }, "hello"),
      h("h1", { class: "h1" }, "mini-vue"),
    ]);
  },
};
