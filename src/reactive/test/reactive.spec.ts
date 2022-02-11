import { effect } from "../effect";
import { reactive, isReactive } from "../reactive";

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
});
