import { h, ref } from "../../../lib/mini-vue.esm.js";

export const Child = {
  name: "Child",
  setup(props) {},
  render() {
    return h("div", {}, this.$props.msg);
  },
};
