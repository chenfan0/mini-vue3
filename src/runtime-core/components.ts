import { isObject } from "../shared/index";

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
  };

  return component;
}

export function setupComponent(instance) {
  // TODO
  // initProps()
  // initSlots()
  setupStatefulComponent(instance);
}

function setupStatefulComponent(component) {
  const { setup } = component.type;

  if (setup) {
    const setupResult = setup();
    handleSetupResult(component, setupResult);
  }
}

function handleSetupResult(instance, setupResult) {
  // TODO function

  // 如果返回的是一个对象，会将返回的值注入到instance中
  if (isObject(setupResult)) {
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
  const component = instance.type;

  if (component.render) {
    instance.render = component.render;
  }
}
