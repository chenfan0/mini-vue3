import { NODE_TYPES } from "../src/ast";
import { baseParse } from "../src/parse";
import { transform } from "../src/transform";

describe("transform", () => {
  it("happy path", () => {
    const ast = baseParse("<div>hi,{{message}}</div>");
    const plugin = (node) => {
      if (node.type === NODE_TYPES.TEXT) {
        node.content += 'miniVue'
      }
    } 
    transform(ast, {
      nodeTransforms: [plugin]
    });
    expect(ast.children[0].children[0].content).toBe("hi,miniVue");
  });
});
