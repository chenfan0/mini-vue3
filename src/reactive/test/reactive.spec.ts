import { reactive } from "../reactive";

describe("reactive", () => {
  it("happy path", () => {
    const obj = {
      age: 18,
    };
    const proxyObj: any = reactive(obj);
    expect(obj).not.toBe(proxyObj);

    proxyObj.age++;
    expect(proxyObj.age).toBe(19);
  });
});
