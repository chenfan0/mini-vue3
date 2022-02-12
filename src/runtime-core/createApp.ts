import { createVNode } from "./vnode";
import { render } from "./renderer";

export function createApp(App) {
  return {
    mount(rootComponent) {
      const vnode = createVNode(App);

      render(vnode, rootComponent);
    },
  };
}
