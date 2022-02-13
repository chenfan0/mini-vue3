import { h } from "../../../lib/mini-vue.esm.js";

export default {
  name: "Foo",
  setup(props, { emit }) {
    function click() {
      console.log("click");
      emit("add", 1, 2);
      emit("foo-add", "foo");
    }
    return {
      click,
    };
  },
  render() {
    const btn = h(
      "button",
      {
        onClick: this.click,
      },
      "addEmit"
    );
    return h("div", {}, [btn]);
  },
};
