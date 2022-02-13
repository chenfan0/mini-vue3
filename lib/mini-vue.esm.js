function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        el: null,
        shapeFlag: getShapeFlag(type),
    };
    if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    else {
        vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === "string"
        ? 1 /* ELEMENT */
        : 2 /* STATEFUL_COMPONENT */;
}

var isObject = function (value) {
    return value !== null && typeof value === "object";
};

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
};
var publicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        if (key in instance.setupState) {
            return instance.setupState[key];
        }
        var publicGetter = publicPropertiesMap[key];
        if (key === "$el") {
            return publicGetter(instance);
        }
    },
};

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
    };
    return component;
}
function setupComponent(instance) {
    // TODO
    // initProps()
    // initSlots()
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    var component = instance.type;
    // ctx 代理
    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);
    var setup = component.setup;
    if (setup) {
        var setupResult = setup();
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
    // create element
    var el = (vnode.el = document.createElement(type));
    // handle props
    for (var prop in props) {
        el.setAttribute(prop, props[prop]);
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

export { createApp, h };
