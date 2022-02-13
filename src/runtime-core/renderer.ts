import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./components";
import { ShapeFlags } from "../shared/ShapeFlags";

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {
  const { shapeFlag } = vnode;
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container);
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container);
  }
}

function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountComponent(initialVNode, container) {
  const instance = createComponentInstance(initialVNode);

  setupComponent(instance);
  setupRenderEffect(instance, initialVNode, container);
}

function setupRenderEffect(instance, vnode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);

  patch(subTree, container);

  vnode.el = subTree.el;
}

function processElement(vnode, container) {
  mountElement(vnode, container);
}

function mountElement(vnode, container) {
  const { type, props, children, shapeFlag } = vnode;
  // create element
  const el = (vnode.el = document.createElement(type));

  // handle props
  for (const prop in props) {
    el.setAttribute(prop, props[prop]);
  }

  // handle children
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(children, el);
  }

  container.appendChild(el);
}

function mountChildren(vnodes, container) {
  vnodes.forEach((vnode) => {
    patch(vnode, container);
  });
}
