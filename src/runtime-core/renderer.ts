import { createComponentInstance, setupComponent } from "./components";
import { ShapeFlags } from "../shared/ShapeFlags";
import { Fragment, Text } from "./vnode";
import { createAppAPI } from "./createApp";
import { effect } from "../reactive/index";

export function createRenderer(options) {
  const { createElement, patchProps, insert } = options;

  function render(vnode, container, parent) {
    patch(null, vnode, container, parent);
  }

  function patch(n1, n2, container, parent) {
    const { shapeFlag, type } = n2;

    switch (type) {
      case Fragment:
        processFragment(n2, container, parent);
        break;
      case Text:
        processText(n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n2, container, parent);
        }
    }
  }

  function processFragment(vnode, container, parent) {
    mountChildren(vnode, container, parent);
  }

  function processText(vnode, container) {
    const el = (vnode.el = document.createTextNode(vnode.children));

    container.appendChild(el);
  }

  function processComponent(vnode, container, parent) {
    mountComponent(vnode, container, parent);
  }

  function mountComponent(initialVNode, container, parent) {
    const instance = createComponentInstance(initialVNode, parent);

    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
  }

  function setupRenderEffect(instance, vnode, container) {
    effect(() => {
      const { proxy, isMounted } = instance;
      if (!isMounted) {
        const subTree = (instance.subTree = instance.render.call(proxy));

        patch(null, subTree, container, instance);

        vnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        const subTree = instance.render.call(proxy);
        const prevTree = instance.subTree;
        instance.subTree = subTree;
        patch(prevTree, subTree, container, instance);
      }
    });
  }

  function processElement(n1, n2, container, parent) {
    if (!n1) {
      mountElement(n2, container, parent);
    } else {
      console.log("update", "-----------");
    }
  }

  function mountElement(vnode, container, parent) {
    const { type, props, children, shapeFlag } = vnode;
    // 创建DOM节点
    const el = (vnode.el = createElement(type));

    patchProps(el, props);

    // handle children
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parent);
    }
    insert(el, container);
    // container.appendChild(el);
  }

  function mountChildren(vnode, container, parent) {
    vnode.children.forEach((item) => {
      patch(null, item, container, parent);
    });
  }

  return {
    createApp: createAppAPI(render),
  };
}
