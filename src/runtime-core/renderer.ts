import { createComponentInstance, setupComponent } from "./components";
import { ShapeFlags } from "../shared/ShapeFlags";
import { Fragment, Text } from "./vnode";
import { createAppAPI } from "./createApp";
import { effect } from "../reactive/index";
import { EMPTY_OBJ } from "../shared/index";
import { shouldUpdateComponent } from "./componentUpdateUtils";
import { queueJobs } from "./scheduler";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProps: hostPatchProps,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;

  function render(vnode, container, parent) {
    patch(null, vnode, container, parent, null);
  }

  function patch(n1, n2, container, parent, anchor) {
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
          processElement(n1, n2, container, parent, anchor);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parent, anchor);
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

  function processComponent(n1, n2, container, parent, anchor) {
    if (!n1) {
      mountComponent(n2, container, parent, anchor);
    } else {
      updateComponent(n1, n2);
    }
  }

  function mountComponent(initialVNode, container, parent, anchor) {
    const instance = (initialVNode.component = createComponentInstance(
      initialVNode,
      parent
    ));

    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container, anchor);
  }

  function updateComponent(n1, n2) {
    // 需要把n1.component赋值给n2.component
    // 不然下次更新n2.component会为null
    const instance = (n2.component = n1.component);
    if (shouldUpdateComponent(n1, n2)) {
      instance.next = n2;
      instance.update();
    }
  }

  function setupRenderEffect(instance, vnode, container, anchor) {
    instance.update = effect(
      () => {
        const { proxy, isMounted } = instance;
        if (!isMounted) {
          const subTree = (instance.subTree = instance.render.call(proxy));

          patch(null, subTree, container, instance, anchor);

          vnode.el = subTree.el;
          instance.isMounted = true;
        } else {
          // next是新的虚拟节点，vnode是旧的虚拟节点
          const { next, vnode } = instance;
          if (next) {
            next.el = vnode.el;
            updateComponentPreRender(instance, next);
          }
          const subTree = instance.render.call(proxy);
          const prevTree = instance.subTree;
          instance.subTree = subTree;
          patch(prevTree, subTree, container, instance, anchor);
        }
      },
      {
        scheduler() {
          queueJobs(instance.update);
        },
      }
    );
  }

  function updateComponentPreRender(instance, next) {
    instance.props = next.props;
    instance.next = null;
    instance.vnode = next;
  }

  function processElement(n1, n2, container, parent, anchor) {
    if (!n1) {
      mountElement(n2, container, parent, anchor);
    } else {
      patchElement(n1, n2, parent, anchor);
    }
  }

  function mountElement(vnode, container, parent, anchor) {
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
    hostInsert(el, container, anchor);
  }

  function patchElement(n1, n2, parent, anchor) {
    // p1 oldProps, p2 newProps
    const p1 = n1.props || EMPTY_OBJ;
    const p2 = n2.props || EMPTY_OBJ;
    // 将el赋值给n2，因为下次patch n2就是n1
    const el = (n2.el = n1.el);

    patchProps(p1, p2, el);

    patchChildren(n1, n2, el, parent, anchor);
  }

  function patchChildren(n1, n2, container, parent, anchor) {
    const c1 = n1.children;
    const c2 = n2.children;
    const el = n1.el;
    const prevShapeFlag = n1.shapeFlag;
    const { shapeFlag } = n2;
    if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // 新节点children是文本类型, 旧节点children是数组类型
        unmountChildren(n1);
        hostSetElementText(el, c2);
      } else {
        patchKeydChildren(c1, c2, container, parent, anchor);
      }
    } else {
      if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 新节点children是数组类型，旧节点children是文本类型
        hostSetElementText(el, "");
        mountChildren(n2, el, parent);
      } else {
        // 新旧节点children类型都是文本类型
        if (c1 !== c2) {
          hostSetElementText(el, c2);
        }
      }
    }
  }

  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }

  function patchKeydChildren(
    c1: any[],
    c2: any[],
    container,
    parent,
    parentAnchor
  ) {
    let i = 0;
    let e1 = c1.length - 1;
    let e2 = c2.length - 1;
    const l2 = c2.length;

    while (i <= e1 && i <= e2) {
      if (isSameVNodeType(c1[i], c2[i])) {
        patch(c1[i], c2[i], container, parent, parentAnchor);
      } else {
        break;
      }
      i++;
    }

    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameVNodeType(n1, n2)) {
        patch(c1[e1], c2[e2], container, parent, parentAnchor);
      } else {
        break;
      }
      e1--;
      e2--;
    }

    if (i > e1) {
      if (i <= e2) {
        // 找到锚点位置
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : null;

        while (i <= e2) {
          // abc -> abcde
          // bcd -> abcd
          // 新增节点
          patch(null, c2[i], container, parent, anchor);
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        // 删除节点
        hostRemove(c1[i].el);
        i++;
      }
    } else {
      let s1 = i;
      let s2 = i;
      const toBePatched = e2 - s2 + 1;
      let patched = 0;
      const keyToNewIndexMap = new Map();
      const newIndexToOldIndexMap = new Array(toBePatched).fill(0);

      let moved = false;
      let maxIndexSoFar = 0;

      for (let i = s2; i <= e2; i++) {
        const key = c2[i].key;
        keyToNewIndexMap.set(key, i);
      }

      for (let i = s1; i <= e1; i++) {
        if (patched >= toBePatched) {
          hostRemove(c2[i]);
          continue;
        }

        const preVnode = c1[i];
        const key = preVnode.key;
        let newIndex;

        if (key !== null || key !== undefined) { 
          newIndex = keyToNewIndexMap.get(key);
        } else {
          for (let j = s2; j <= e2; j++) {
            if (isSameVNodeType(preVnode, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === undefined) {
          hostRemove(preVnode.el);
        } else {
          if (maxIndexSoFar < newIndex) {
            maxIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          patch(preVnode, c2[newIndex], container, parent, null);
          patched++;
        }
      }

      // 返回最长递增子序列的下标，也就是新数组的下标。
      // 新数组节点的下标在该数组中，则说明不需要移动
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : [];

      let j = increasingNewIndexSequence.length - 1;

      for (let i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = i + s2;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 >= l2 ? null : c2[nextIndex + 1].el;

        if (newIndexToOldIndexMap[i] === 0) {
          // 需要新增节点
          patch(null, nextChild, container, parent, anchor);
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            hostInsert(nextChild.el, container, anchor);
          } else {
            j--;
          }
        }
      }
    }
  }

  function unmountChildren(vnode) {
    vnode.children.forEach((v) => {
      const el = v.el;
      hostRemove(el);
    });
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
      patch(null, item, container, parent, null);
    });
  }

  return {
    createApp: createAppAPI(render),
  };
}

function getSequence(arr: number[]): number[] {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = (u + v) >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}
