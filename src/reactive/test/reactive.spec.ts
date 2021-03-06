import { effect } from "../effect";
import { reactive, isReactive, isProxy, shallowReactive, toRaw, markRaw } from "../reactive";

describe("reactive", () => {
  it("happy path", () => {
    const obj = {
      age: 18,
    };
    const proxyObj: any = reactive(obj);
    expect(obj).not.toBe(proxyObj);
    proxyObj.age++;
    expect(proxyObj.age).toBe(19);
    expect(isReactive(proxyObj)).toBe(true);
    expect(isReactive(obj)).toBe(false);
    expect(isProxy(obj)).toBe(false);
    expect(isProxy(proxyObj)).toBe(true);
  });
  it("nest reactive", () => {
    const obj = reactive({
      foo: {
        age: 10,
      },
      bar: 10,
    });
    let dummy;
    effect(() => {
      dummy = obj.foo;
    });
    expect(isReactive(obj.foo)).toBe(true);
    obj.foo = 1;
    expect(dummy).toBe(1);
    expect(obj.bar).toBe(10);
  });

  it("shallowRef", () => {
    const obj = {
      foo: {
        name: 123,
      },
    };
    const shallow: any = shallowReactive(obj);
    expect(isReactive(shallow)).toBe(true);
    expect(isReactive(shallow.foo)).toBe(false);
  });

  it('toRaw', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(toRaw(observed)).toBe(original)
    expect(toRaw(original)).toBe(original)
  })

  it('markRaw', () => {
    const foo = markRaw({})
    expect(isReactive(reactive(foo))).toBe(false)

    const bar = reactive({ foo })
    expect(isReactive(bar.foo)).toBe(false)
  })
});
