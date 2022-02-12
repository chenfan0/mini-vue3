import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./components";

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {
  if (typeof vnode.type === "string") {
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container);
  }
}

function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function processElement(vnode, container) {
  mountElement(vnode, container);
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode);

  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function mountElement(vnode, container) {
  const { type, props, children } = vnode;
  // create element
  const el = document.createElement(type);

  // handle props
  for (const prop in props) {
    el.setAttribute(prop, props[props]);
  }

  // handle children
  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(children, el);
  }

  container.appendChild(el);
}

function mountChildren(vnodes, container) {
  vnodes.forEach((vnode) => {
    patch(vnode, container);
  });
}

function setupRenderEffect(instance, container) {
  const subTree = instance.render();

  patch(subTree, container);
}
