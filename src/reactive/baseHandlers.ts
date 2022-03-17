import { track, trigger } from "./effect";

import { reactive, ReactiveFlags, readonly } from "./reactive";

import { isObject, extend } from "../shared/index";

function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    } else if (key === ReactiveFlags.RAW) {
      return target;
    }

    if (!isReadonly) {
      track(target, key);
    }

    if (isObject(res) && !isShallow) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  };
}

function createSetter() {
  return function set(target, key, newValue, receiver) {
    const res = Reflect.set(target, key, newValue, receiver);
    // 触发依赖
    trigger(target, key);

    return res;
  };
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReactiveGet = createGetter(false, true);
const shallowReadonlyGet = createGetter(true, true);

export const mutableHandlers = {
  get,
  set,
};

export const shallowReactiveHandlers = {
  get: shallowReactiveGet,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set(target) {
    console.warn(`${target} is a readonly can not be set`);
    return true;
  },
};

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
});
