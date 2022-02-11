import { reactive } from "../reactive";
import { effect, stop } from "../effect";

describe("effect", () => {
  it("happy path", () => {
    const obj = reactive({
      age: 18,
    });
    let nextAge;
    effect(() => {
      nextAge = obj.age + 1;
    });

    expect(nextAge).toBe(19);

    obj.age++;

    expect(nextAge).toBe(20);
  });

  it("runner", () => {
    // effect函数会返回一个runner函数，该函数实际上就是传入的fn函数
    let foo = 10;
    const runner: any = effect(() => {
      foo++;
      return "foo";
    });
    expect(foo).toBe(11);

    const r = runner();

    expect(r).toBe("foo");
    expect(foo).toBe(12);
  });

  it("sheduler", () => {
    // 当有传递scheduler参数时，第一次执行还是执行effct的第一个参数fn
    // 当数据发生变化时，执行的是scheduler函数
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        scheduler,
      }
    );
    // 一开始scheduler不会被调用
    expect(scheduler).not.toHaveBeenCalled();
    // effect函数的第一个参数fn会被调用
    expect(dummy).toBe(1);

    // 当obj发送变化时
    obj.foo++;
    // 调用scheduler
    expect(scheduler).toHaveBeenCalledTimes(1);
    // 不会执行effect的第一个参数
    expect(dummy).toBe(1);

    run();

    expect(dummy).toBe(2);
  });

  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    // obj.prop = 3;
    obj.prop++;
    expect(dummy).toBe(2);
    runner();
    expect(dummy).toBe(3);
  });

  it("onStop", () => {
    const obj = reactive({
      foo: 1,
    });
    const onStop = jest.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        onStop,
      }
    );
    // 调用stop后，onStop会被执行
    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });
});
