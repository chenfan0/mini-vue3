'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const extend = Object.assign;
const isObject = (value) => {
    return value !== null && typeof value === "object";
};
const hasChange = (value, newValue) => {
    return !Object.is(value, newValue);
};
function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
function isArray(value) {
    return Array.isArray(value);
}
// foo-add => fooAdd
const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, p) => {
        return p ? p.toUpperCase() : "";
    });
};
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
// fooAdd => onFooAdd
const handleEventName = (name) => {
    return name ? "on" + capitalize(name) : "";
};
const EMPTY_OBJ = {};

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots,
    $props: (i) => i.props,
};
const publicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        if (hasOwn(instance.setupState, key)) {
            return instance.setupState[key];
        }
        else if (hasOwn(instance.props, key)) {
            return instance.props[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

function initProps(instance, rawProps) {
    // 将props挂载到实例上
    instance.props = rawProps;
    // attrs
}

let activeEffect;
let shouldTrack;
const targetMap = new WeakMap();
class ReactiveEffect {
    constructor(fn, scheduler) {
        this.scheduler = scheduler;
        // 该变量用来记录是否调过stop函数
        this.active = true;
        // 收集该effect的dep
        this.deps = [];
        this._fn = fn;
        this.scheduler = scheduler;
    }
    run(...args) {
        activeEffect = this;
        if (!this.active) {
            return this._fn(...args);
        }
        shouldTrack = true;
        const res = this._fn(...args);
        shouldTrack = false;
        return res;
    }
    stop() {
        if (this.active) {
            cleanupEffect(this);
            this.onStop && this.onStop();
            this.active = false;
        }
    }
}
function cleanupEffect(effect) {
    effect.deps.forEach((dep) => {
        dep.delete(effect);
    });
    // 清空effect.deps
    effect.deps.length = 0;
}
function track(target, key) {
    if (!isTracking())
        return;
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
function trackEffects(dep) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}
function isTracking() {
    return shouldTrack && activeEffect !== undefined;
}
function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap)
        return;
    const dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    if (!dep)
        return;
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}
function effect(fn, options = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    extend(_effect, options);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}

function createGetter(isReadonly = false, isShallow = false) {
    return function get(target, key, receiver) {
        const res = Reflect.get(target, key, receiver);
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) {
            return isReadonly;
        }
        if (!isReadonly) {
            track(target, key);
        }
        if (isObject(res) && !isShallow) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, newValue, receiver) {
        const res = Reflect.set(target, key, newValue, receiver);
        // 触发依赖
        trigger(target, key);
        return res;
    };
}
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
const mutableHandlers = {
    get,
    set,
};
const readonlyHandlers = {
    get: readonlyGet,
    set(target) {
        console.warn(`${target} is a readonly can not be set`);
        return true;
    },
};
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
});

function createReactiveObj(raw, baseHandlers) {
    if (!isObject(raw)) {
        console.error(`${raw} 必须是一个对象`);
    }
    return new Proxy(raw, baseHandlers);
}
function reactive(raw) {
    return createReactiveObj(raw, mutableHandlers);
}
function readonly(raw) {
    return createReactiveObj(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createReactiveObj(raw, shallowReadonlyHandlers);
}

function emit(instance, event, ...args) {
    const { props } = instance;
    const handlerName = camelize(handleEventName(event));
    const handler = props[handlerName];
    handler && handler(...args);
}

function initSlots(instance, children) {
    // instance.slots = Array.isArray(children) ? children : [children];
    const { vnode } = instance;
    if (vnode.shapeFlag & 16 /* SLOT_CHILDREN */) {
        instance.slots = children;
        for (const slot in children) {
            const value = children[slot];
            children[slot] = (props) => normalizeSlotValue(value(props));
        }
    }
}
function normalizeSlotValue(value) {
    return isArray(value) ? value : [value];
}

let currentInstance = null;
function createComponentInstance(vnode, parent) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        provides: parent ? parent.provides : {},
        isMounted: false,
        subTree: {},
        next: null,
        update: null,
        emit: () => { },
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    const rawProps = instance.vnode.props;
    initProps(instance, rawProps);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const component = instance.type;
    const props = instance.vnode.props;
    const emit = instance.emit;
    // ctx 代理
    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);
    const { setup } = component;
    if (setup) {
        setCurrentInstance(instance);
        const setupResult = setup(shallowReadonly(props), { emit });
        setCurrentInstance(null);
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // TODO function
    // 如果返回的是一个对象，会将返回的值注入到instance中
    if (isObject(setupResult)) {
        instance.setupState = proxyRefs(setupResult);
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const component = instance.type;
    if (component.render) {
        instance.render = component.render;
    }
}
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}

const Fragment = Symbol("Fragment");
const Text = Symbol("Text");
function createVNode(type, props = {}, children = []) {
    const vnode = {
        type,
        props,
        children,
        component: null,
        key: props.key || undefined,
        el: null,
        shapeFlag: getShapeFlag(type),
    };
    if (Array.isArray(children)) {
        // 子节点为数组
        vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    else if (typeof children === "string") {
        // 子节点为text类型
        vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    }
    if (vnode.shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        if (isObject(children)) {
            vnode.shapeFlag |= 16 /* SLOT_CHILDREN */;
        }
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === "string"
        ? 1 /* ELEMENT */
        : 2 /* STATEFUL_COMPONENT */;
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}

function createAppAPI(render) {
    return function createApp(App) {
        return {
            mount(rootComponent) {
                const vnode = createVNode(App);
                render(vnode, rootComponent, null);
            },
        };
    };
}

class ComputedRefImpl {
    constructor(getter) {
        this._dirty = true;
        this._getter = getter;
        //
        this._effect = new ReactiveEffect(this._getter, () => {
            // scheduler函数会在依赖改变时，执行
            // 当computed依赖的值发生改变时，将this._dirty设置为true
            // 这样当下次获取.value时，this._dirty就为true，就会重新触发getter函数，获取最新的值
            this._dirty = true;
        });
    }
    get value() {
        if (this._dirty) {
            // this._dirty 如果为true，则说明需要重新执行getter函数
            this._value = this._effect.run();
            // 执行完getter函数将this._dirty设置为false，这样当依赖没有改变时，再次获取.value时，不会重新出发getter函数
            this._dirty = false;
        }
        return this._value;
    }
}
function computed(getter) {
    return new ComputedRefImpl(getter);
}

class RefImplement {
    constructor(value) {
        this.__v_isRef = true;
        this._rawValue = value;
        this._value = convert(value);
        this.deps = new Set();
    }
    get value() {
        if (isTracking()) {
            trackEffects(this.deps);
        }
        return this._value;
    }
    set value(newValue) {
        if (!hasChange(this._rawValue, newValue))
            return;
        this._rawValue = newValue;
        this._value = convert(newValue);
        triggerEffects(this.deps);
    }
}
function convert(value) {
    return isObject(value) ? reactive(value) : value;
}
function ref(value) {
    return new RefImplement(value);
}
function isRef(ref) {
    if (!ref)
        return false;
    return !!ref.__v_isRef;
}
function unRef(ref) {
    return isRef(ref) ? ref.value : ref;
}
function proxyRefs(objWithRefs) {
    return new Proxy(objWithRefs, {
        get(target, key, receiver) {
            return unRef(Reflect.get(target, key, receiver));
        },
        set(target, key, newValue, receiver) {
            // 当原来值是ref类型，而修改的值不是ref类型
            if (isRef(target[key]) && !isRef(newValue)) {
                return (target[key].value = newValue);
            }
            return Reflect.set(target, key, newValue, receiver);
        },
    });
}

function shouldUpdateComponent(n1, n2) {
    const { props: oldProps } = n1;
    const { props: newProps } = n2;
    for (const key in newProps) {
        if (oldProps[key] !== newProps[key]) {
            return true;
        }
    }
    return false;
}

const queue = [];
let isFlushPending = false;
const p = Promise.resolve();
function nextTick(fn) {
    return fn ? p.then(fn) : p;
}
function queueJobs(fn) {
    // queue.in;
    if (!queue.includes(fn)) {
        queue.push(fn);
    }
    queueFlush();
}
function queueFlush() {
    if (isFlushPending)
        return;
    isFlushPending = true;
    nextTick(flushJobs);
}
function flushJobs() {
    isFlushPending = false;
    let job;
    while ((job = queue.shift())) {
        job && job();
    }
}

function createRenderer(options) {
    const { createElement: hostCreateElement, patchProps: hostPatchProps, insert: hostInsert, remove: hostRemove, setElementText: hostSetElementText, } = options;
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
                if (shapeFlag & 1 /* ELEMENT */) {
                    processElement(n1, n2, container, parent, anchor);
                }
                else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
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
        }
        else {
            updateComponent(n1, n2);
        }
    }
    function mountComponent(initialVNode, container, parent, anchor) {
        const instance = (initialVNode.component = createComponentInstance(initialVNode, parent));
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
        instance.update = effect(() => {
            const { proxy, isMounted } = instance;
            if (!isMounted) {
                const subTree = (instance.subTree = instance.render.call(proxy));
                patch(null, subTree, container, instance, anchor);
                vnode.el = subTree.el;
                instance.isMounted = true;
            }
            else {
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
        }, {
            scheduler() {
                queueJobs(instance.update);
            },
        });
    }
    function updateComponentPreRender(instance, next) {
        instance.props = next.props;
        instance.next = null;
        instance.vnode = next;
    }
    function processElement(n1, n2, container, parent, anchor) {
        if (!n1) {
            mountElement(n2, container, parent, anchor);
        }
        else {
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
        if (shapeFlag & 4 /* TEXT_CHILDREN */) {
            el.textContent = children;
        }
        else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
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
        if (prevShapeFlag & 8 /* ARRAY_CHILDREN */) {
            if (shapeFlag & 4 /* TEXT_CHILDREN */) {
                // 新节点children是文本类型, 旧节点children是数组类型
                unmountChildren(n1);
                hostSetElementText(el, c2);
            }
            else {
                patchKeydChildren(c1, c2, container, parent, anchor);
            }
        }
        else {
            if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
                // 新节点children是数组类型，旧节点children是文本类型
                hostSetElementText(el, "");
                mountChildren(n2, el, parent);
            }
            else {
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
    function patchKeydChildren(c1, c2, container, parent, parentAnchor) {
        let i = 0;
        let e1 = c1.length - 1;
        let e2 = c2.length - 1;
        const l2 = c2.length;
        while (i <= e1 && i <= e2) {
            if (isSameVNodeType(c1[i], c2[i])) {
                patch(c1[i], c2[i], container, parent, parentAnchor);
            }
            else {
                break;
            }
            i++;
        }
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1];
            const n2 = c2[e2];
            if (isSameVNodeType(n1, n2)) {
                patch(c1[e1], c2[e2], container, parent, parentAnchor);
            }
            else {
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
        }
        else if (i > e2) {
            while (i <= e1) {
                // 删除节点
                hostRemove(c1[i].el);
                i++;
            }
        }
        else {
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
                }
                else {
                    for (let j = s2; j <= e2; j++) {
                        if (isSameVNodeType(preVnode, c2[j])) {
                            newIndex = j;
                            break;
                        }
                    }
                }
                if (newIndex === undefined) {
                    hostRemove(preVnode.el);
                }
                else {
                    if (maxIndexSoFar < newIndex) {
                        maxIndexSoFar = newIndex;
                    }
                    else {
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
                }
                else if (moved) {
                    if (j < 0 || i !== increasingNewIndexSequence[j]) {
                        hostInsert(nextChild.el, container, anchor);
                    }
                    else {
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
function getSequence(arr) {
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
                }
                else {
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

function h(type, props, children) {
    return createVNode(type, props, children);
}

function renderSlots(slots, props, name) {
    // 处理具名插槽
    if (slots[name]) {
        if (typeof slots[name] === "function") {
            return createVNode(Fragment, {}, slots[name](props));
        }
    }
    // 处理默认插槽
    const totalSlots = [];
    for (const slot in slots) {
        totalSlots.push(...slots[slot](props));
    }
    return createVNode(Fragment, {}, totalSlots);
}

function provide(key, value) {
    const instance = getCurrentInstance();
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
function inject(key, value) {
    const instance = getCurrentInstance();
    if (instance) {
        const { provides } = instance;
        const injectValue = provides[key];
        if (!injectValue) {
            if (typeof value === "function") {
                return value();
            }
            else {
                return value;
            }
        }
        return injectValue;
    }
}

function createElement(type) {
    return document.createElement(type);
}
function patchProps(el, key, val) {
    // handle props
    // 如果key为 on开头并且on后面的第一个字符为大写，则认定为事件监听
    const isOn = (key) => /^on[A-Z]/.test(key);
    // 处理事件
    if (isOn(key)) {
        const event = key.slice(2).toLocaleLowerCase();
        el.addEventListener(event, val);
    }
    else if (val !== undefined && val !== null) {
        el.setAttribute(key, val);
    }
    else {
        // 当属性值为undefined或者为null时，直接删除该属性即可
        el.removeAttribute(key);
    }
}
function insert(child, container, anchor) {
    container.insertBefore(child, anchor);
}
function remove(el) {
    const parent = el.parentNode;
    if (parent) {
        parent.removeChild(el);
    }
}
function setElementText(el, text) {
    el.textContent = text;
}
const renderer = createRenderer({
    createElement,
    patchProps,
    insert,
    remove,
    setElementText,
});
function createApp(...args) {
    return renderer.createApp(...args);
}

exports.computed = computed;
exports.createApp = createApp;
exports.createRenderer = createRenderer;
exports.createTextVNode = createTextVNode;
exports.effect = effect;
exports.getCurrentInstance = getCurrentInstance;
exports.h = h;
exports.inject = inject;
exports.nextTick = nextTick;
exports.provide = provide;
exports.proxyRefs = proxyRefs;
exports.reactive = reactive;
exports.readonly = readonly;
exports.ref = ref;
exports.renderSlots = renderSlots;
exports.renderer = renderer;
exports.shallowReadonly = shallowReadonly;
