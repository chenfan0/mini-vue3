import { watch } from "../watch";
import { reactive } from "../reactive";

describe("watch", () => {
  it("happy path", () => {
    const obj = reactive({
      age: 10,
    });
    let old = 0;
    let newV = 0;

    // watch(obj, () => {
    //   old++;
    // });
    // obj.age = 11;
    // expect(old).toBe(1);
    watch(
      () => obj.age,
      (newValue, oldValue) => {
        old = oldValue;
        newV = newValue;
      },
      {
        immediate: true,
      }
    );
    expect(old).toBe(undefined);
    expect(newV).toBe(10);
    obj.age = 12;
    expect(old).toBe(10);
    expect(newV).toBe(12);
    // watch(
    //   () => obj.age,
    //   (oldValue, newValue) => {
    //     console.log("1111111111");

    //     old = oldValue;
    //     newV = newValue;
    //   },
    //   { immediate: true }
    // );
    // expect(old).toBe(undefined);
    // expect(newV).toBe(10);
    // obj.age = 11;

    // expect(old).toBe(10);
    // expect(newV).toBe(11);
  });
});
