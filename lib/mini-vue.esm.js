function createVNode(type, props, children) {
    if (props === void 0) { props = {}; }
    if (children === void 0) { children = []; }
    var vnode = {
        type: type,
        props: props,
        children: children,
        el: null,
        shapeFlag: getShapeFlag(type),
    };
    if (Array.isArray(children)) {
        // 子节点为数组
        vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    else {
        // 子节点为text类型
        vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === "string"
        ? 1 /* ELEMENT */
        : 2 /* STATEFUL_COMPONENT */;
}

var extend = Object.assign;
var isObject = function (value) {
    return value !== null && typeof value === "object";
};
function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
function isArray(value) {
    return Array.isArray(value);
}
// foo-add => fooAdd
var camelize = function (str) {
    return str.replace(/-(\w)/g, function (_, p) {
        return p ? p.toUpperCase() : "";
    });
};
var capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
// fooAdd => onFooAdd
var handleEventName = function (name) {
    return name ? "on" + capitalize(name) : "";
};

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
    $slots: function (i) { return i.slots; },
};
var publicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        if (hasOwn(instance.setupState, key)) {
            return instance.setupState[key];
        }
        else if (hasOwn(instance.props, key)) {
            return instance.props[key];
        }
        var publicGetter = publicPropertiesMap[key];
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

var targetMap = new WeakMap();
function trigger(target, key) {
    var depsMap = targetMap.get(target);
    if (!depsMap)
        return;
    var dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (var _i = 0, dep_1 = dep; _i < dep_1.length; _i++) {
        var effect_1 = dep_1[_i];
        if (effect_1.scheduler) {
            effect_1.scheduler();
        }
        else {
            effect_1.run();
        }
    }
}

function createGetter(isReadonly, isShallow) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (isShallow === void 0) { isShallow = false; }
    return function get(target, key, receiver) {
        var res = Reflect.get(target, key, receiver);
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) {
            return isReadonly;
        }
        if (isObject(res) && !isShallow) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, newValue, receiver) {
        var res = Reflect.set(target, key, newValue, receiver);
        // 触发依赖
        trigger(target, key);
        return res;
    };
}
var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var shallowReadonlyGet = createGetter(true, true);
var mutableHandlers = {
    get: get,
    set: set,
};
var readonlyHandlers = {
    get: readonlyGet,
    set: function (target) {
        console.warn("".concat(target, " is a readonly can not be set"));
        return true;
    },
};
var shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
});

function createReactiveObj(raw, baseHandlers) {
    if (!isObject(raw)) {
        console.error("".concat(raw, " \u5FC5\u987B\u662F\u4E00\u4E2A\u5BF9\u8C61"));
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

function emit(instance, event) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var props = instance.props;
    var handlerName = camelize(handleEventName(event));
    var handler = props[handlerName];
    handler && handler.apply(void 0, args);
}

function initSlots(instance, children) {
    // instance.slots = Array.isArray(children) ? children : [children];
    instance.slots = children;
    var _loop_1 = function (slot) {
        var value = children[slot];
        children[slot] = function (props) { return normalizeSlotValue(value(props)); };
    };
    for (var slot in children) {
        _loop_1(slot);
    }
}
function normalizeSlotValue(value) {
    return isArray(value) ? value : [value];
}

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        emit: function () { },
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    var rawProps = instance.vnode.props;
    initProps(instance, rawProps);
    // TODO
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    var component = instance.type;
    var props = instance.vnode.props;
    var emit = instance.emit;
    // ctx 代理
    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);
    var setup = component.setup;
    if (setup) {
        var setupResult = setup(shallowReadonly(props), { emit: emit });
        handleSetupResult(instance, setupResult);
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
    var component = instance.type;
    if (component.render) {
        instance.render = component.render;
    }
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    var shapeFlag = vnode.shapeFlag;
    if (shapeFlag & 1 /* ELEMENT */) {
        processElement(vnode, container);
    }
    else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        processComponent(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    var instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, vnode, container) {
    var proxy = instance.proxy;
    var subTree = instance.render.call(proxy);
    patch(subTree, container);
    vnode.el = subTree.el;
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    var type = vnode.type, props = vnode.props, children = vnode.children, shapeFlag = vnode.shapeFlag;
    // 创建DOM节点
    var el = (vnode.el = document.createElement(type));
    // handle props
    // 如果key为 on开头并且on后面的第一个字符为大写，则认定为事件监听
    var isOn = function (key) { return /^on[A-Z]/.test(key); };
    for (var key in props) {
        // 处理事件
        if (isOn(key)) {
            var event_1 = key.slice(2).toLocaleLowerCase();
            el.addEventListener(event_1, props[key]);
        }
        else {
            el.setAttribute(key, props[key]);
        }
    }
    // handle children
    if (shapeFlag & 4 /* TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
        mountChildren(children, el);
    }
    container.appendChild(el);
}
function mountChildren(vnodes, container) {
    vnodes.forEach(function (vnode) {
        patch(vnode, container);
    });
}

function createApp(App) {
    return {
        mount: function (rootComponent) {
            var vnode = createVNode(App);
            render(vnode, rootComponent);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

function renderSlots(slots, props, name) {
    // 处理具名插槽
    if (slots[name]) {
        if (typeof slots[name] === "function")
            return createVNode("div", {}, slots[name](props));
    }
    // 处理默认插槽
    var totalSlots = [];
    for (var slot in slots) {
        totalSlots.push.apply(totalSlots, slots[slot](props));
    }
    return createVNode("div", {}, totalSlots);
}

export { createApp, h, renderSlots };
