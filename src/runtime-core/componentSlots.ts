import { isArray } from "../shared/index";

export function initSlots(instance, children) {
  // instance.slots = Array.isArray(children) ? children : [children];
  instance.slots = children;

  for (const slot in children) {
    const value = children[slot];
    children[slot] = (props) => normalizeSlotValue(value(props));
  }
}

function normalizeSlotValue(value) {
  return isArray(value) ? value : [value];
}
