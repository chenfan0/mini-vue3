import { createVNode } from "./vnode";

export function createAppAPI(render) {
  return function createApp(App) {
    return {
      mount(rootComponent) {
        const vnode = createVNode(App);
        render(vnode, rootComponent, null);
      },
    };
  };
}
