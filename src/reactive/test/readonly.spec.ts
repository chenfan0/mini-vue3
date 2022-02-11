import { isProxy, isReadonly, readonly, shallowReadonly } from "../reactive";

describe("redonly", () => {
  it("happy path", () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);
    expect(isReadonly(original)).toBe(false);
    expect(isProxy(wrapped)).toBe(true);
    expect(isProxy(original)).toBe(false);
  });

  it("warn when call set", () => {
    console.warn = jest.fn();

    const user = readonly({
      age: 10,
    });

    user.age = 11;

    expect(console.warn).toBeCalled();
    expect(isReadonly(user)).toBe(true);
  });

  it("nested readonly", () => {
    const obj = readonly({
      foo: {
        age: 10,
      },
    });
    expect(isReadonly(obj.foo)).toBe(true);
  });

  it("shallowReadonly", () => {
    const obj = shallowReadonly({
      foo: {
        age: 10,
      },
    });
    expect(isReadonly(obj)).toBe(true);
    expect(isReadonly(obj.foo)).toBe(false);
  });
});
