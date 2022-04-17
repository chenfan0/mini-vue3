import { NODE_TYPES } from "./ast";

const enum TAG_TYPE {
  START,
  END
}

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
  const s = context.source
  if (s.startsWith("{{")) {
    node = parseInterpolation(context);
  } else if (s[0] === '<') {
    if (/[a-z]/i.test(s[1])) {
      node = parseElement(context)
    }
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

function parseElement(context) {
  const node = parseTag(context, TAG_TYPE.START)
  parseTag(context, TAG_TYPE.END)
  
  return node
}

function parseTag(context, type: TAG_TYPE) {
  const match: any = /^<\/?([a-z]*)/i.exec(context.source)
  const tag = match[1]
  
  advanceBy(context, match[0].length + 1)
  if (type === TAG_TYPE.END) return
  return {
    type: NODE_TYPES.ELEMENT,
    tag,
  }
}


function advanceBy(context, length: number) {
  context.source = context.source.slice(length);
}

