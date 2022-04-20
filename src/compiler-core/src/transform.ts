import { NODE_TYPES } from "./ast";
import { TO_DISPLAY_STRING } from "./runtimeHelpers";

export function transform(root, options = {}) {
  const context = createTransformContext(root, options);
  
  traverseNode(context, root);
  createRootCodegen(root)
  
  root.helpers = [...context.helpers.keys()]
}

function createRootCodegen(root) {
  root.codegenNode = root.children[0]
}

function createTransformContext(root, options) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Map(),
    helper(key) {
      context.helpers.set(key, 1)
    }
  };

  return context;
}

function traverseNode(context, node) {
  const nodeTransforms: any[] = context.nodeTransforms;

  for (let i = 0; i < nodeTransforms.length; i++) {
    const nodeTransform = nodeTransforms[i]
    nodeTransform(node);
  }

  switch (node.type) {
    case NODE_TYPES.INTERPOLATION: 
      context.helper(TO_DISPLAY_STRING)
      break
    case NODE_TYPES.ROOT:
    case NODE_TYPES.ELEMENT:
      traverseChildren(context, node.children)
      break
    default:
      break
  }
}

function traverseChildren(context, children) {
  if (children === undefined) return;

  for (let i = 0; i < children.length; i++) {
    traverseNode(context, children[i]);
  }
}
