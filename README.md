# mini-vue3
- 实现 Vue3 核心逻辑的最简模型，本项目参考 https://github.com/cuixiaorui/mini-vue 实现。
- 与该仓库有关的文章可以访问: https://juejin.cn/column/7065487683673391118
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
