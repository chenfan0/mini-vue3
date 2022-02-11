import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _value;
  private _getter;
  private _effect;
  private _dirty = true;

  constructor(getter) {
    this._getter = getter;
    //
    this._effect = new ReactiveEffect(this._getter, () => {
      // scheduler函数会在依赖改变时，执行
      // 当computed依赖的值发生改变时，将this._dirty设置为true
      // 这样当下次获取.value时，this._dirty就为true，就会重新触发getter函数，获取最新的值
      this._dirty = true;
    });
  }

  get value() {
    if (this._dirty) {
      // this._dirty 如果为true，则说明需要重新执行getter函数
      this._value = this._effect.run();
      // 执行完getter函数将this._dirty设置为false，这样当依赖没有改变时，再次获取.value时，不会重新出发getter函数
      this._dirty = false;
    }
    return this._value;
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter);
}
