import { NODE_TYPES } from "../ast";

export function transformExpression(node) {
  if (node.type === NODE_TYPES.INTERPOLATION) {
    node.content = processExpression(node.content)
  }
}

function processExpression(node) { 
  node.content = '_ctx.' + node.content
  return node
}

