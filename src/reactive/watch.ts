import { ReactiveEffect } from "./effect";

export function watch(source, cb, options: any = {}) {
  let getter, oldValue, newValue;
  const job = () => {
    newValue = _effect.run();
    cb(newValue, oldValue);
    // 将newValue赋值为oldValue，这样下次执行才不会出错。
    oldValue = newValue;
  };

  if (typeof source === "function") {
    getter = source;
  } else {
    getter = () => traverse(source);
  }

  const _effect = new ReactiveEffect(getter, () => {
    if (options.flush === "post") {
      // 当flush为post，将job放到微任务中执行
      const p = Promise.resolve();
      p.then(job);
    } else {
      job();
    }
  });
  if (options.immediate === true) {
    job();
  } else {
    oldValue = _effect.run();
  }
}

// 通用的读取操作
function traverse(value, seen = new Set()) {
  if (typeof value !== "object" || typeof value === null || seen.has(value))
    return;

  seen.add(value);

  for (const key in value) {
    traverse(value[key], seen);
  }
  return value;
}
