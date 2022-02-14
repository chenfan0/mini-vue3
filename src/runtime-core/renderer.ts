import { createComponentInstance, setupComponent } from "./components";
import { ShapeFlags } from "../shared/ShapeFlags";
import { Fragment, Text } from "./vnode";

export function render(vnode, container, parent) {
  patch(vnode, container, parent);
}

function patch(vnode, container, parent) {
  const { shapeFlag, type } = vnode;

  switch (type) {
    case Fragment:
      processFragment(vnode, container, parent);
      break;
    case Text:
      processText(vnode, container);
      break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container, parent);
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container, parent);
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
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);

  patch(subTree, container, instance);

  vnode.el = subTree.el;
}

function processElement(vnode, container, parent) {
  mountElement(vnode, container, parent);
}

function mountElement(vnode, container, parent) {
  const { type, props, children, shapeFlag } = vnode;
  // 创建DOM节点
  const el = (vnode.el = document.createElement(type));

  // handle props
  // 如果key为 on开头并且on后面的第一个字符为大写，则认定为事件监听
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  for (const key in props) {
    // 处理事件
    if (isOn(key)) {
      const event = key.slice(2).toLocaleLowerCase();
      el.addEventListener(event, props[key]);
    } else {
      el.setAttribute(key, props[key]);
    }
  }

  // handle children
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el, parent);
  }

  container.appendChild(el);
}

function mountChildren(vnode, container, parent) {
  vnode.children.forEach((item) => {
    patch(item, container, parent);
  });
}
