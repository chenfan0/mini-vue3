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
});
