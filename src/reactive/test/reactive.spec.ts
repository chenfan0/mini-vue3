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
    expect(isReactive(obj.foo)).toBe(true);
    expect(obj.bar).toBe(10);
  });
});
