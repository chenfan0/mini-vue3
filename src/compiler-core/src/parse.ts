import { NODE_TYPES } from "./ast";

const enum TAG_TYPE {
  START,
  END,
}

export function baseParse(content: string) {
  const context = createParseContext(content);

  return createRoot(createParseChildren(context, []));
}

function createParseContext(content: string) {
  return {
    source: content,
  };
}

function createRoot(children) {
  return {
    children,
  };
}

function createParseChildren(context, ancestors) {
  const nodes: any[] = [];
  while (!isEnd(context, ancestors)) {
    let node;
    const s = context.source;
    if (s.startsWith("{{")) {
      node = parseInterpolation(context);
    } else if (s[0] === "<") {
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors);
      }
    }

    if (!node) {
      node = parseText(context);
    }

    nodes.push(node);
  }

  return nodes;
}

function isEnd(context, ancestors) {
  const s: string = context.source;
  if (s.startsWith("</")) {
    for (let i = ancestors.length - 1; i >= 0; i--) {
      const tag = ancestors[i];
      if (startsWithEndOpen(s, tag)) {
        return true;
      }
    }
  }
  return !s;
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
  const rawContentLength = closeIndex - openDelimiter.length;
  const rawContent = parseTextData(context, rawContentLength);
  advanceBy(context, closeDelimiter.length);
  const content = rawContent.trim();

  return {
    type: NODE_TYPES.INTERPOLATION,
    content: {
      type: NODE_TYPES.SIMPLE_EXPRESSION,
      content,
    },
  };
}

function parseElement(context, ancestors: string[]) {
  const element: any = parseTag(context, TAG_TYPE.START);
  ancestors.push(element.tag);
  element.children = createParseChildren(context, ancestors);
  ancestors.pop();

  if (startsWithEndOpen(context.source, element.tag)) {
    parseTag(context, TAG_TYPE.END);
  } else {
    throw new Error(`${element.tag}标签没有结束标签`);
  }

  return element;
}

function startsWithEndOpen(source: string, tag: string) {
  return (
    source.startsWith("</") &&
    source.slice(2, tag.length + 2).toLowerCase() === tag.toLowerCase()
  );
}

function parseTag(context, type: TAG_TYPE) {
  const match: any = /^<\/?([a-z]*)/i.exec(context.source);
  const tag = match[1];

  advanceBy(context, match[0].length + 1);
  if (type === TAG_TYPE.END) return;
  return {
    type: NODE_TYPES.ELEMENT,
    tag,
  };
}

function parseText(context) {
  const endTokens = ["{{", "<"];
  let endIndex = context.source.length;
  for (let i = 0; i < endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i]);
    if (index > -1 && endIndex > index) {
      endIndex = index;
    }
  }

  const content = parseTextData(context, endIndex);

  return {
    type: NODE_TYPES.TEXT,
    content,
  };
}

function parseTextData(context, length: number) {
  const content = context.source.slice(0, length);

  advanceBy(context, length);

  return content;
}

function advanceBy(context, length: number) {
  context.source = context.source.slice(length);
}
