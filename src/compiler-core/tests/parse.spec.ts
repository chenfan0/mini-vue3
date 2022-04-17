import { NODE_TYPES } from "../src/ast";
import { baseParse } from "../src/parse";

describe("Parse", () => {
  describe("interpolation", () => {
    test("simple interpolation", () => {
      const ast: any = baseParse("{{message}}");

      expect(ast.children[0]).toStrictEqual({
        type: NODE_TYPES.INTERPOLATION,
        content: {
          type: NODE_TYPES.SIMPLE_EXPRESSION,
          content: "message",
        },
      });
    });
  });

  describe("element", () => {
    test("simple element div", () => {
      const ast: any = baseParse("<div></div>");

      expect(ast.children[0]).toStrictEqual({
        type: NODE_TYPES.ELEMENT,
        tag: "div",
        children: [],
      });
    });
  });

  describe("text", () => {
    test("simple text", () => {
      const ast: any = baseParse("some text");

      expect(ast.children[0]).toStrictEqual({
        type: NODE_TYPES.TEXT,
        content: "some text",
      });
    });
  });

  test("hello word", () => {
    const ast = baseParse("<p>hi,{{message}}</p>");

    expect(ast.children[0]).toStrictEqual({
      type: NODE_TYPES.ELEMENT,
      tag: "p",
      children: [
        {
          type: NODE_TYPES.TEXT,
          content: "hi,",
        },
        {
          type: NODE_TYPES.INTERPOLATION,
          content: {
            type: NODE_TYPES.SIMPLE_EXPRESSION,
            content: "message",
          },
        },
      ],
    });
  });

  test("lack end tag", () => {
    expect(() => baseParse("<p><div></p>")).toThrow('div标签没有结束标签');
  });

  test("nested element", () => {
    const ast = baseParse("<div><p>hi,</p>{{message}}</div>");

    expect(ast.children[0]).toStrictEqual({
      type: NODE_TYPES.ELEMENT,
      tag: "div",
      children: [
        {
          type: NODE_TYPES.ELEMENT,
          tag: "p",
          children: [
            {
              type: NODE_TYPES.TEXT,
              content: "hi,",
            },
          ],
        },
        {
          type: NODE_TYPES.INTERPOLATION,
          content: {
            type: NODE_TYPES.SIMPLE_EXPRESSION,
            content: "message",
          },
        },
      ],
    });
  });
});
