import { getCurrentInstance } from "./components";

export function provide(key, value) {
  const instance: any = getCurrentInstance();
  const parentProvides = instance.parent ? instance.parent.provides : {};

  if (instance) {
    let { provides } = instance;
    if (parentProvides === provides) {
      // parentProvides === provides则表明是第一次进行provide
      provides = instance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}

export function inject(key, value?: any) {
  const instance: any = getCurrentInstance();

  if (instance) {
    const { provides } = instance;
    const injectValue = provides[key];

    if (!injectValue) {
      if (typeof value === "function") {
        return value();
      } else {
        return value;
      }
    }
    return injectValue;
  }
}
