import { NODE_TYPES } from '../src/ast';
import { baseParse } from '../src/parse'

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
});
