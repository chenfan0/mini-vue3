import { h } from "../../../lib/mini-vue.esm.js";
import Foo from "./Foo.js";

export default {
  setup() {},
  render() {
    const header = (props) => h("p", {}, "header" + props);
    const footer = (props) => h("p", {}, "footer" + props);
    return h("div", {}, [h("div", {}, "App"), h(Foo, {}, { header, footer })]);
  },
};
