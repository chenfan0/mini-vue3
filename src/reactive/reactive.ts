import { isObject } from "../shared/index";
import {
  mutableHandlers,
  shallowReactiveHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

function createReactiveObj(raw, baseHandlers) {
  if (!isObject(raw)) {
    console.error(`${raw} 必须是一个对象`);
  }
  return new Proxy(raw, baseHandlers);
}

export function reactive(raw: any) {
  return createReactiveObj(raw, mutableHandlers);
}

export function shallowReactive(raw: any) {
  return createReactiveObj(raw, shallowReactiveHandlers);
}

export function readonly(raw) {
  return createReactiveObj(raw, readonlyHandlers);
}

export function shallowReadonly(raw) {
  return createReactiveObj(raw, shallowReadonlyHandlers);
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
