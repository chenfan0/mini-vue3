import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

function createReactiveObj(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}

export function reactive(raw: any) {
  return createReactiveObj(raw, mutableHandlers);
}

export function readonly(raw) {
  return createReactiveObj(raw, readonlyHandlers);
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}
