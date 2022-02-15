import { h, ref } from "../../../lib/mini-vue.esm.js";

// 老的是数组，新的是文本
const text = h("div", {}, "text");
const text1 = h("div", {}, "text1");
const array = h("div", {}, [h("div", {}, "arr1"), h("div", {}, "arr2")]);
// 旧子节点是数组，新子节点是文本
const ArrayToText = {
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;

    return {
      isChange,
    };
  },
  render() {
    const self = this;
    return self.isChange === true ? text : array;
  },
};

const TextToArray = {
  name: "TextToArray",
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;

    return {
      isChange,
    };
  },
  render() {
    const self = this;
    return self.isChange === false ? text : array;
  },
};

const TextToText = {
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;

    return {
      isChange,
    };
  },
  render() {
    const self = this;
    return self.isChange === false ? text : text1;
  },
};

export const App = {
  name: "App",
  setup() {},
  render() {
    return h("div", {}, [
      // h(ArrayToText),
      // h(TextToArray),
      h(TextToText),
    ]);
  },
};
