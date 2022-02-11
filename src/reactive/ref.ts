import { trackEffects, triggerEffects, isTracking } from "./effect";
import { reactive } from "./reactive";

import { hasChange, isObject } from "../shared";

class RefImplement {
  private _value;
  private deps;
  private _rawValue;
  public __v_isRef = true;
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
  return !!ref.__v_isRef;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}
