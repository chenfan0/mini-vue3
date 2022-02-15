import { h, ref } from "../../../lib/mini-vue.esm.js";

// 左侧对比
// const prev = h("div", {}, [
//   h("div", { key: "a" }, "a"),
//   h("div", { key: "b" }, "b"),
//   h("div", { key: "c" }, "c"),
// ]);

// const next = h("div", {}, [
//   h("div", { key: "a" }, "a"),
//   h("div", { key: "b" }, "b"),
//   h("div", { key: "c" }, "c"),
//   h("div", { key: "d" }, "d"),
//   h("div", { key: "e" }, "e"),
// ]);

// // 右侧对比
const prev = h("div", {}, [
  h("div", { key: "c" }, "c"),
  h("div", { key: "d" }, "d"),
  h("div", { key: "e" }, "e"),
]);

const next = h("div", {}, [
  h("div", { key: "a" }, "a"),
  h("div", { key: "b" }, "b"),
  h("div", { key: "c" }, "c"),
  h("div", { key: "d" }, "d"),
  h("div", { key: "e" }, "e"),
]);

export const App = {
  setup() {
    const isChange = ref(true);
    window.isChange = isChange;
    return {
      isChange,
    };
  },
  render() {
    return this.isChange === true ? prev : next;
  },
};
