import { extend } from "../shared/index";

// 这里使用一个变量保存活跃的effect，
// 但是如果存在effect嵌套的情况，就会有问题，需要把这个变成一个栈。
let activeEffect: ReactiveEffect | undefined;
const effectStack: ReactiveEffect[] = [];
let shouldTrack;
const targetMap = new WeakMap();

const trackStack: boolean[] = [];

export function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}

export function enableTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = true;
}

export function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === undefined ? true : last;
}

export class ReactiveEffect {
  // effect传递的第一个参数
  private _fn: (...args) => void;
  // effect传递的第二个对象的scheduler属性。如果有传该参数，则trigger是会触发该函数
  // 调用stop函数会执行该函数
  onStop?: () => void;
  // 该变量用来记录是否调过stop函数
  active = true;
  // 收集该effect的dep
  deps: any[] = [];

  constructor(fn, public scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
  }

  run(...args) {
    if (!this.active) {
      return this._fn(...args);
    }
    if (!effectStack.includes(this)) {
      effectStack.push((activeEffect = this));

      // 
      enableTracking()

      const res = this._fn(...args);
      resetTracking()
      effectStack.pop();
      const n = effectStack.length;
      activeEffect = n > 0 ? effectStack[n - 1] : undefined;
      return res;
    }
  }

  stop() {
    if (this.active) {
      cleanupEffect(this);
      this.onStop && this.onStop();
      this.active = false;
    }
  }
}

function cleanupEffect(effect: ReactiveEffect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
  // 清空effect.deps
  effect.deps.length = 0;
}

export function track(target, key) {
  if (!isTracking()) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  trackEffects(dep);
}

export function trackEffects(dep) {
  dep.add(activeEffect);

  activeEffect!.deps.push(dep);
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);

  triggerEffects(dep);
}

export function triggerEffects(dep) {
  if (!dep) return;

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);

  extend(_effect, options);
  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;

  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
