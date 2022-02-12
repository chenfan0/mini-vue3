const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
};

export const publicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    if (key in instance.setupState) {
      return instance.setupState[key];
    }

    const publicGetter = publicPropertiesMap[key];
    if (key === "$el") {
      return publicGetter(instance);
    }
  },
};
