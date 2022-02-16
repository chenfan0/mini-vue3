import {
  h,
  ref,
  getCurrentInstance,
  nextTick,
} from "../../../lib/mini-vue.esm.js";

export const App = {
  name: "APP",
  setup() {
    const count = ref(0);
    const instance = getCurrentInstance();
    function update() {
      for (let i = 0; i < 100; i++) {
        count.value++;
      }
      debugger;
      nextTick(() => {
        console.log(instance);
      });
    }

    return {
      count,
      update,
    };
  },
  render() {
    return h("div", {}, [
      h("div", {}, `count: ${this.count}`),
      h("button", { onClick: this.update }, "update"),
    ]);
  },
};
