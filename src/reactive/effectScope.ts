export class EffectScope {
  effects: any[] = []
  run(fn) {
    const res = fn()
    return res
  }
}

export function effectScope() {}
