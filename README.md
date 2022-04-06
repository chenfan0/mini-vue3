# mini-vue3
- 实现 Vue3 核心逻辑的最简模型，本项目参考 https://github.com/cuixiaorui/mini-vue 实现。
- 与该仓库有关的文章可以访问: https://juejin.cn/column/7065487683673391118
<!--filetoc-start-->
- [reactive](https://github.com/chenfan0/mini-vue3/tree/main/src/reactive)
  - [test](https://github.com/chenfan0/mini-vue3/tree/main/src/reactive/test)
    - [computed.spec.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/reactive/test/computed.spec.ts)
    - [effect.spec.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/reactive/test/effect.spec.ts)
    - [effectScope.spec.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/reactive/test/effectScope.spec.ts)
    - [reactive.spec.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/reactive/test/reactive.spec.ts)
    - [readonly.spec.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/reactive/test/readonly.spec.ts)
    - [ref.spec.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/reactive/test/ref.spec.ts)
    - [watch.spec.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/reactive/test/watch.spec.ts)
  - [baseHandlers.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/reactive/baseHandlers.ts)
  - [computed.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/reactive/computed.ts)
  - [effect.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/reactive/effect.ts)
  - [effectScope.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/reactive/effectScope.ts)
  - [index.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/reactive/index.ts)
  - [reactive.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/reactive/reactive.ts)
  - [ref.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/reactive/ref.ts)
  - [watch.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/reactive/watch.ts)
- [runtime-core](https://github.com/chenfan0/mini-vue3/tree/main/src/runtime-core)
  - [helpers](https://github.com/chenfan0/mini-vue3/tree/main/src/runtime-core/helpers)
    - [renderSlots.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/runtime-core/helpers/renderSlots.ts)
  - [apiInject.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/runtime-core/apiInject.ts)
  - [componentEmit.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/runtime-core/componentEmit.ts)
  - [componentProps.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/runtime-core/componentProps.ts)
  - [componentPublicInstance.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/runtime-core/componentPublicInstance.ts)
  - [components.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/runtime-core/components.ts)
  - [componentSlots.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/runtime-core/componentSlots.ts)
  - [componentUpdateUtils.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/runtime-core/componentUpdateUtils.ts)
  - [createApp.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/runtime-core/createApp.ts)
  - [h.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/runtime-core/h.ts)
  - [index.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/runtime-core/index.ts)
  - [renderer.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/runtime-core/renderer.ts)
  - [scheduler.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/runtime-core/scheduler.ts)
  - [vnode.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/runtime-core/vnode.ts)
- [runtime-dom](https://github.com/chenfan0/mini-vue3/tree/main/src/runtime-dom)
  - [index.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/runtime-dom/index.ts)
- [shared](https://github.com/chenfan0/mini-vue3/tree/main/src/shared)
  - [index.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/shared/index.ts)
  - [ShapeFlags.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/shared/ShapeFlags.ts)
- [index.ts](https://github.com/chenfan0/mini-vue3/tree/main/src/index.ts)
<!--filetoc-end-->
## 目前实现功能
### reactivity
- [x] reactive
- [x] shallowReactive 
- [x] readonly
- [x] shallowReadonly
- [x] isReactive
- [x] isReadonly
- [x] isProxy
- [x] ref
- [x] isRef
- [x] unRef
- [X] toRaw
- [x] proxyRefs
- [x] computed
- [x] effect
- [x] watch
### runtime-core
- [x] 初始化Component主流程
- [x] 初始化Element主流程
- [x] shapeFlags
- [x] 组件代理对象
- [x] 注册事件
- [x] 组件props
- [x] 组件emit
- [x] 组件slots
- [x] getCurrentInstance
- [x] provide/inject
- [x] 更新element的基本流程
- [x] 更新Component的基本流程
- [x] nextTick
### runtime-dom
- [x] custom renderer
### compiler
暂未实现
