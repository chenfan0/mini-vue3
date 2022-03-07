import { trackEffects, triggerEffects, isTracking } from "./effect";
import { reactive, isProxy } from "./reactive";

import { hasChange, isObject } from "../shared/index";

class RefImplement {
  private _value;
  private deps;
  private _rawValue;
  public readonly __v_isRef = true;

  constructor(value) {
    this._rawValue = value;
    this._value = convert(value);
    this.deps = new Set();
  }

  get value() {
    if (isTracking()) {
      trackEffects(this.deps);
    }
    return this._value;
  }

  set value(newValue) {
    if (!hasChange(this._rawValue, newValue)) return;
    this._rawValue = newValue;
    this._value = convert(newValue);

    triggerEffects(this.deps);
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

export function ref(value) {
  return new RefImplement(value);
}

export function isRef(ref) {
  if (!ref) return false;
  return !!ref.__v_isRef;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objWithRefs) {
  return new Proxy(objWithRefs, {
    get(target, key, receiver) {
      return unRef(Reflect.get(target, key, receiver));
    },
    set(target, key, newValue, receiver) {
      // 当原来值是ref类型，而修改的值不是ref类型
      if (isRef(target[key]) && !isRef(newValue)) {
        return (target[key].value = newValue);
      }
      return Reflect.set(target, key, newValue, receiver);
    },
  });
}

class ObjRefImple {
  public readonly __v_isRef = true;

  constructor(private readonly _object, private readonly _key) { }
  
  get value() {
    return this._object[this._key]
  }

  set value(newVal) {
    this._object[this._key] = newVal
  }
}

export function toRef(object, key) {
  const val = object[key];
  return isRef(val) ? val : new ObjRefImple(object, key);
}

export function toRefs(object) {
  if (!isProxy(object)) {
    console.warn(`toRefs() expects a reactive object but received a plain one.`)
  }
  const ret = Array.isArray(object) ? new Array(object.length) : {}
  for (const key in object) {
    ret[key] = isRef(object[key]) ? object[key] : new ObjRefImple(object, key)
  }
  return ret
}
