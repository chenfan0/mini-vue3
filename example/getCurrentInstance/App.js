import { h, getCurrentInstance } from "../../../lib/mini-vue.esm.js";
import Foo from "./Foo.js";

export default {
  name: "App",
  setup() {
    const instance = getCurrentInstance();
    console.log(instance);
  },
  render() {
    const slots = () => h("div", {}, "slots");
    return h("div", {}, [h(Foo, {}, { slots })]);
  },
};
