import { h, resolveComponent } from "../../../lib/mini-vue.esm.js";

export default {
  setup() {
    return {};
  },
  render() {
    return h("div", {}, [h(resolveComponent("my-component")), h("div", {}, "hahaha")]);
  },
};
