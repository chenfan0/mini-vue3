import { NODE_TYPES } from "./ast";
import { helperMapName, TO_DISPLAY_STRING } from "./runtimeHelpers";

export function generate(ast) {
  const context = createCodegenContext();
  const { push } = context;

  if (ast.helpers.length > 0) {
    genFunctionPreamble(ast, context);
  }

  push("\n");
  push("return ");

  const args = ["_ctx", "_cache"];
  const functionName = "render";

  push(`function ${functionName}(${args.join(", ")}) {`);
  push('return ')
  geneNode(ast.codegenNode, context);
  push(`}`);

  return {
    code: context.code,
  };

  function genFunctionPreamble(ast, context) {
    const { push } = context;
    const VueBinging = "Vue";
    const aliasHelper = (s) => `${helperMapName[s]}: _${helperMapName[s]}`;
    push(
      `const { ${ast.helpers.map(aliasHelper).join(", ")} } = ${VueBinging}`
    );
  }
}

function createCodegenContext() {
  const context = {
    code: "",
    push(source: string) {
      context.code += source;
    },
    helper(key) {
      return `_${helperMapName[key]}`
    }
  };

  return context;
}

function geneNode(node, context) {
  switch (node.type) {
    case NODE_TYPES.TEXT:
      genText(node, context);
      break;
    case NODE_TYPES.INTERPOLATION:
      genInterpolation(node, context);
      break;
    case NODE_TYPES.SIMPLE_EXPRESSION:
      genExpression(node, context)
      break
    default:
      break
  }
}
function genText(node, context) {
  const { push } = context;
  push(`"${node.content}"`);
}

function genInterpolation(node, context) {
  const { push, helper } = context;
  
  push(`${helper(TO_DISPLAY_STRING)}(`);
  geneNode(node.content, context)
  push(')')
}

function genExpression(node, context) {
  const { push } = context
  push(`${node.content}`)
}
