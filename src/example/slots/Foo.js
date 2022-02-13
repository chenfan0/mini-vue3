import { h, renderSlots } from "../../../lib/mini-vue.esm.js";

export default {
  setup(props) {},
  render() {
    const foo = h("p", {}, "Foo");
    const age = 18;
    return h("div", {}, [
      renderSlots(this.$slots, age),
      foo,
      renderSlots(this.$slots, age, "footer"),
    ]);
  },
};
