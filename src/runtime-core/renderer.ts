import { createComponentInstance, setupComponent } from "./components";
import { ShapeFlags } from "../shared/ShapeFlags";
import { Fragment, Text } from "./vnode";
import { createAppAPI } from "./createApp";
import { effect } from "../reactive/index";
import { EMPTY_OBJ } from "../shared/index";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProps: hostPatchProps,
    insert: hostInsert,
  } = options;

  function render(vnode, container, parent) {
    patch(null, vnode, container, parent);
  }

  function patch(n1, n2, container, parent) {
    const { shapeFlag, type } = n2;

    switch (type) {
      case Fragment:
        processFragment(n2, container, parent);
        break;
      case Text:
        processText(n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n2, container, parent);
        }
    }
  }

  function processFragment(vnode, container, parent) {
    mountChildren(vnode, container, parent);
  }

  function processText(vnode, container) {
    const el = (vnode.el = document.createTextNode(vnode.children));

    container.appendChild(el);
  }

  function processComponent(vnode, container, parent) {
    mountComponent(vnode, container, parent);
  }

  function mountComponent(initialVNode, container, parent) {
    const instance = createComponentInstance(initialVNode, parent);

    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
  }

  function setupRenderEffect(instance, vnode, container) {
    effect(() => {
      const { proxy, isMounted } = instance;
      if (!isMounted) {
        const subTree = (instance.subTree = instance.render.call(proxy));

        patch(null, subTree, container, instance);

        vnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        const subTree = instance.render.call(proxy);
        const prevTree = instance.subTree;
        instance.subTree = subTree;
        patch(prevTree, subTree, container, instance);
      }
    });
  }

  function processElement(n1, n2, container, parent) {
    if (!n1) {
      mountElement(n2, container, parent);
    } else {
      patchElement(n1, n2);
    }
  }

  function mountElement(vnode, container, parent) {
    const { type, props, children, shapeFlag } = vnode;
    // 创建DOM节点
    const el = (vnode.el = hostCreateElement(type));

    // 处理props
    for (const key in props) {
      hostPatchProps(el, key, props[key]);
    }

    // 处理children属性
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parent);
    }
    hostInsert(el, container);
  }

  function patchElement(n1, n2) {
    // props

    const p1 = n1.props || EMPTY_OBJ;
    const p2 = n2.props || EMPTY_OBJ;

    // 将el赋值给n2，因为下次patch n2就是n1
    const el = (n2.el = n1.el);

    patchProps(p1, p2, el);
  }

  function patchProps(oldProps, newProps, el) {
    if (oldProps !== newProps) {
      // 遍历新属性，增加或者修改属性值
      for (const key in newProps) {
        const prevProp = oldProps[key];
        const currentProp = newProps[key];

        if (prevProp !== currentProp) {
          hostPatchProps(el, key, currentProp);
        }
      }
      // 当旧属性不为空对象时
      if (oldProps !== EMPTY_OBJ) {
        // 遍历旧属性，删除旧属性有而新属性没有的属性
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProps(el, key, null);
          }
        }
      }
    }
  }

  function mountChildren(vnode, container, parent) {
    vnode.children.forEach((item) => {
      patch(null, item, container, parent);
    });
  }

  return {
    createApp: createAppAPI(render),
  };
}
