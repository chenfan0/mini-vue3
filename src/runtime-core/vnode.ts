import { ShapeFlags } from "../shared/ShapeFlags";

export function createVNode(type, props = {}, children = []) {
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
  } else {
    // 子节点为text类型
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  }
  return vnode;
}

function getShapeFlag(type) {
  return typeof type === "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}
