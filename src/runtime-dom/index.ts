import { createRenderer } from "../runtime-core/renderer";

function createElement(type) {
  return document.createElement(type);
}

function patchProps(el, key, val) {
  // handle props
  // 如果key为 on开头并且on后面的第一个字符为大写，则认定为事件监听
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  // 处理事件
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, val);
  } else if (val !== undefined && val !== null) {
    el.setAttribute(key, val);
  } else {
    // 当属性值为undefined或者为null时，直接删除该属性即可
    el.removeAttribute(key);
  }
}

function insert(child, container, anchor) {
  container.insertBefore(child, anchor);
}

function remove(el) {
  const parent = el.parentNode;
  if (parent) {
    parent.removeChild(el);
  }
}

function setElementText(el, text) {
  el.textContent = text;
}

export const renderer: any = createRenderer({
  createElement,
  patchProps,
  insert,
  remove,
  setElementText,
});

export function createApp(...args) {
  return renderer.createApp(...args);
}

export * from "../runtime-core/index";
