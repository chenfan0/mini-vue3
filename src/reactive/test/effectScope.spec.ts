import { reactive } from "../reactive";
import { effect } from "../effect";
import { effectScope, EffectScope } from "../effectScope";

describe("reactivity/effect/scope", () => {
  it("should run", () => {
    const fnSpy = jest.fn(() => {});
    new EffectScope().run(fnSpy);
    expect(fnSpy).toHaveBeenCalledTimes(1);
  });

  it("should accept zero argument", () => {
    const scope = new EffectScope();
    expect(scope.effects.length).toBe(0);
  });

  it("should return run value", () => {
    expect(new EffectScope().run(() => 1)).toBe(1);
  });

  // it("should collect the effects", () => {
  //   const scope = new EffectScope();
  //   scope.run(() => {
  //     let dummy;
  //     const counter = reactive({ num: 0 });
  //     effect(() => (dummy = counter.num));

  //     expect(dummy).toBe(0);
  //     counter.num = 7;
  //     expect(dummy).toBe(7);
  //   });

  //   expect(scope.effects.length).toBe(1);
  // });
});
