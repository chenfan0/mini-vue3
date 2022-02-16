import { h, ref } from "../../../lib/mini-vue.esm.js";

import { Child } from "./Child.js";

export const App = {
  name: "App",
  setup() {
    const msg = ref("123");
    const count = ref(0);

    function changeCount() {
      count.value++;
    }
    window.msg = msg;

    function changeMsg() {
      msg.value += "1";
    }

    return {
      msg,
      count,
      changeCount,
      changeMsg,
    };
  },
  render() {
    return h("div", {}, [
      h("button", { onClick: this.changeCount }, `count: ${this.count}`),
      h("button", { onClick: this.changeMsg }, "change msg"),
      h(Child, { msg: this.msg }),
    ]);
  },
};
