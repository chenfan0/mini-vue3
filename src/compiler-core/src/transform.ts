export function transform(root, options) {
  const context = createTransformContext(root, options);
  traverseNode(context, root);
}

function createTransformContext(root, options) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
  };

  return context;
}

function traverseNode(context, node) {
  const nodeTransforms: any[] = context.nodeTransforms;

  for (let i = 0; i < nodeTransforms.length; i++) {
    const nodeTransform = nodeTransforms[i]
    nodeTransform(node);
  }

  traverseChildren(context, node.children);
}

function traverseChildren(context, children) {
  if (children === undefined) return;

  for (let i = 0; i < children.length; i++) {
    traverseNode(context, children[i]);
  }
}
