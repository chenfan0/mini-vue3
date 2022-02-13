import { h } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  setup() {
    const msg = "mini-vue";
    return {
      msg,
    };
  },
  render() {
    window.self = this;
    // [
    //   h("p", { class: "p" }, "hello"),
    //   h("h1", { class: "h1" }, "mini-vue"),
    // ]
    return h(
      "div",
      {
        class: "red",
        onClick: () => {
          console.log("click");
        },
      },
      [h("div", {}, "mini-vue"), h(Foo, { age: 18 })]
    );
  },
};
