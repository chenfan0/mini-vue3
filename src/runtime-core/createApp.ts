import { createVNode } from "./vnode";

function createAppContext() {
  return {
    app: null as any,
    components: {},
  };
}

export function createAppAPI(render) {
  return function createApp(App) {
    const context = createAppContext();

    const app = (context.app = {
      mount(rootComponent) {
        const vnode: any = createVNode(App);
        vnode.appContext = context;
        render(vnode, rootComponent, null);
      },
      component(name: string, component?) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
      },
    });

    return app;
  };
}
