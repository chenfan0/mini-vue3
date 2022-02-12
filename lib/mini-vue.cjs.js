'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function createVNode(type, props, children) {
    return {
        type: type,
        props: props,
        children: children,
    };
}

var isObject = function (value) {
    return value !== null && typeof value === "object";
};

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
    };
    return component;
}
function setupComponent(instance) {
    // TODO
    // initProps()
    // initSlots()
    setupStatefulComponent(instance);
}
function setupStatefulComponent(component) {
    var setup = component.type.setup;
    if (setup) {
        var setupResult = setup();
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
    var component = instance.type;
    if (component.render) {
        instance.render = component.render;
    }
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    if (typeof vnode.type === "string") {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountComponent(vnode, container) {
    var instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function mountElement(vnode, container) {
    var type = vnode.type, props = vnode.props, children = vnode.children;
    // create element
    var el = document.createElement(type);
    // handle props
    for (var prop in props) {
        el.setAttribute(prop, props[props]);
    }
    // handle children
    if (typeof children === "string") {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(children, el);
    }
    container.appendChild(el);
}
function mountChildren(vnodes, container) {
    vnodes.forEach(function (vnode) {
        patch(vnode, container);
    });
}
function setupRenderEffect(instance, container) {
    var subTree = instance.render();
    patch(subTree, container);
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

exports.createApp = createApp;
exports.h = h;
