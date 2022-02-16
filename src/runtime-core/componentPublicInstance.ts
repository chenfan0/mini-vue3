import { hasOwn } from "../shared/index";

const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
  $slots: (i) => i.slots,
  $props: (i) => i.props,
};

export const publicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    if (hasOwn(instance.setupState, key)) {
      return instance.setupState[key];
    } else if (hasOwn(instance.props, key)) {
      return instance.props[key];
    }

    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
