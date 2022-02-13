import { createVNode } from "../vnode";

export function renderSlots(slots, props, name) {
  // 处理具名插槽
  if (slots[name]) {
    if (typeof slots[name] === "function")
      return createVNode("div", {}, slots[name](props));
  }

  // 处理默认插槽
  const totalSlots: any = [];

  for (const slot in slots) {
    totalSlots.push(...slots[slot](props));
  }

  return createVNode("div", {}, totalSlots);
}
