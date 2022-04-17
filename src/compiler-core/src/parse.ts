import { NODE_TYPES } from "./ast";

export function baseParse(content: string) {
  const context = createParseContext(content);

  return createRoot(createParseChildren(context))
}

function createParseContext(content: string) {
  return {
    source: content,
  };
}

function createRoot(children) {
  return {
    children
  }
}

function createParseChildren(context) {
  const nodes: any[] = [];
  let node;
  if (context.source.startsWith("{{")) {
    node = parseInterpolation(context);
  }

  nodes.push(node);

  return nodes
}


function parseInterpolation(context) {
  const openDelimiter = "{{";
  const closeDelimiter = "}}";
  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length
  );
  // {{message}} -> message}}
  advanceBy(context, openDelimiter.length);
  const rawContentLength = closeIndex - openDelimiter.length
  // message}} -> message
  const rawContent: string = context.source.slice(0, rawContentLength);
  // message}}<div> -> <div>
  advanceBy(context, rawContentLength + closeDelimiter.length);
  const content = rawContent.trim()

  return {
    type: NODE_TYPES.INTERPOLATION,
    content: {
      type: NODE_TYPES.SIMPLE_EXPRESSION,
      content,
    },
  };
}

function advanceBy(context, length: number) {
  context.source = context.source.slice(length);
}

