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
// const prev = h("div", {}, [
//   h("div", { key: "c" }, "c"),
//   h("div", { key: "d" }, "d"),
//   h("div", { key: "e" }, "e"),
// ]);

// const next = h("div", {}, [
//   h("div", { key: "a" }, "a"),
//   h("div", { key: "b" }, "b"),
//   h("div", { key: "c", id: "c" }, "c"),
//   h("div", { key: "d" }, "d"),
//   h("div", { key: "e" }, "e"),
// ]);

const prev = h("div", {}, [
  h("div", { key: "a" }, "a"),
  h("div", { key: "b" }, "b"),
  h("div", { key: "c" }, "c"),
  h("div", { key: "d" }, "d"),
  h("div", { key: "e" }, "e"),
  h("div", { key: "z" }, "z"),
  h("div", { key: "f" }, "f"),
  h("div", { key: "g" }, "g"),
]);

const next = h("div", {}, [
  h("div", { key: "a" }, "a"),
  h("div", { key: "b" }, "b"),
  h("div", { key: "d" }, "d"),
  h("div", { key: "c" }, "c"),
  h("div", { key: "y" }, "y"),
  h("div", { key: "e" }, "e"),
  h("div", { key: "f" }, "f"),
  h("div", { key: "g" }, "g"),
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
