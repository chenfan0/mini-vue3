import { h, ref } from "../../../lib/mini-vue.esm.js";

export const App = {
  name: "App",
  setup() {
    const count = ref(0);
    const attr = ref({
      foo: "foo",
      bar: "bar",
    });

    const onClick = () => {
      count.value++;
    };
    const add = () => {
      attr.value = {
        foo: "foo",
        bar: "bar",
        baz: "baz",
      };
    };

    const set = () => {
      attr.value.foo = undefined;
    };

    const patch = () => {
      attr.value.bar = "new bar";
    };

    const remove = () => {
      attr.value = {
        foo: "foo",
      };
    };

    return {
      count,
      onClick,
      attr,
      add,
      remove,
      patch,
      set,
    };
  },
  render() {
    return h("div", { ...this.attr }, [
      h("div", {}, "count " + this.count),
      h("button", { onClick: this.onClick }, "click"),
      h("button", { onClick: this.set }, "设置undefined"),
      h("button", { onClick: this.patch }, "修改属性"),
      h("button", { onClick: this.add }, "添加属性"),
      h("button", { onClick: this.remove }, "删除属性"),
    ]);
    // return h("button", { onClick: this.add, ...this.attr }, "添加属性");
  },
};
