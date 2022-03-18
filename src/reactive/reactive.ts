import { def, isObject } from "../shared/index";
import {
  mutableHandlers,
  shallowReactiveHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  RAW = "__v_raw",
  SKIP = "__v_skip",
}

function getTargetType(raw) {
  return raw[ReactiveFlags.SKIP];
}

function createReactiveObj(raw, baseHandlers) {
  if (!isObject(raw)) {
    console.error(`${raw} 必须是一个对象`);
  }
  if (getTargetType(raw)) return raw;
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

export function toRaw(observed) {
  const raw = observed && observed[ReactiveFlags.RAW];
  return raw ? raw : observed;
}

export function markRaw(value) {
  def(value, ReactiveFlags.SKIP, true);
  return value;
}
