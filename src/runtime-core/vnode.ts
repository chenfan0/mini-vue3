import { isObject } from "../shared/index";
import { ShapeFlags } from "../shared/ShapeFlags";

export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");

export function createVNode(type, props = {}, children: any = []) {
  const vnode = {
    type,
    props,
    children,
    el: null,
    shapeFlag: getShapeFlag(type),
  };

  if (Array.isArray(children)) {
    // 子节点为数组
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  } else if (typeof children === "string") {
    // 子节点为text类型
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  }
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (isObject(children)) {
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN;
    }
  }
  return vnode;
}

function getShapeFlag(type) {
  return typeof type === "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}

export function createTextVNode(text: string) {
  return createVNode(Text, {}, text);
}
