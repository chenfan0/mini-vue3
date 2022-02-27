import { isArray } from "../shared/index";
import { ShapeFlags } from "../shared/ShapeFlags";

export function initSlots(instance, children) {
  // instance.slots = Array.isArray(children) ? children : [children];
  const { vnode } = instance;
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    instance.slots = children;

    for (const slot in children) {
      const value = children[slot];

      children[slot] = (props) => normalizeSlotValue(value(props));
    }
  }
}

function normalizeSlotValue(value) {
  return isArray(value) ? value : [value];
}
