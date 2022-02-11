import { track, trigger } from "./effect";

export function reactive(raw: any) {
  return new Proxy(raw, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);

      // 收集依赖
      track(target, key);

      return res;
    },
    set(target, key, newValue, receiver) {
      const res = Reflect.set(target, key, newValue, receiver);

      // 触发依赖
      trigger(target, key);

      return res;
    },
  });
}
