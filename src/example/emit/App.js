import { h } from "../../../lib/mini-vue.esm.js";
import Foo from "./Foo.js";

export const App = {
  setup(props, { emit }) {},
  render() {
    return h("div", {}, [
      h(Foo, {
        onAdd: (...args) => {
          console.log("onAdd", ...args);
        },
        onFooAdd: (...args) => {
          console.log("onFooAdd", ...args);
        },
      }),
    ]);
  },
};
