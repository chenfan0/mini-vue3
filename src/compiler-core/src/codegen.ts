export function generate(ast) {
  const context = createCodegenContext()
  const { push } = context
  push('return ')

  const args = ["_ctx", "_cache"];
  const functionName = "render";

  push(`function ${functionName}(${args.join(", ")}) {`)
  geneNode(ast.codegenNode, context)
  push(`}`)

  return {
    code: context.code
  };
}

function createCodegenContext() {
  const context = {
    code: '',
    push(source: string) {
      context.code += source
    }
  }

  return context
}

function geneNode(node, context) {
  const { push } = context
  push(`return "${node.content}"`)
}
