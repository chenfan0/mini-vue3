import { h, provide, inject } from "../../../lib/mini-vue.esm.js";

export default {
  name: "App",
  setup() {
    provide("name", "App");
    const name = inject("name");
    return {
      name,
    };
  },
  render() {
    return h("div", {}, [h("div", {}, `App provide ${this.name}`), h(cpn1)]);
  },
};

const cpn1 = {
  name: "cpn1",
  setup() {
    const name = inject("name");
    provide("name2", "cpn2");

    return {
      name,
    };
  },
  render() {
    return h("div", {}, [h("div", {}, `cpn1 ${this.name}`), h(cpn2)]);
  },
};

const cpn2 = {
  name: "cpn1",
  setup() {
    const name = inject("name");
    const abc = inject("abc", "abc");
    return {
      name,
      abc,
    };
  },
  render() {
    return h("div", {}, `cpn2 ${this.name} - ${this.abc}`);
  },
};
