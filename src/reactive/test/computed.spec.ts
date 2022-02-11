import { reactive } from "../reactive";
import { computed } from "../computed";

describe("computed", () => {
  it("happy path", () => {
    const obj = reactive({
      age: 10,
    });
    const cValue = computed(() => {
      return obj.age;
    });
    expect(cValue.value).toBe(10);
  });

  it("should compute layily", () => {
    const value = reactive({
      foo: 1,
    });
    const getter = jest.fn(() => value.foo);
    const cValue = computed(getter);
    // lazy
    // 当没有调用cValue.value时，是不会调用getter函数的
    expect(getter).not.toHaveBeenCalled();

    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);
    // 多次获取.value不会重新调用getter
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // 修改依赖值
    value.foo = 2;
    // 没有.value所以不会执行getter
    expect(getter).toHaveBeenCalledTimes(1);

    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
