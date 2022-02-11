import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

function createReactiveObj(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}

export function reactive(raw: any) {
  return createReactiveObj(raw, mutableHandlers);
}

export function readonly(raw) {
  return createReactiveObj(raw, readonlyHandlers);
}
