import { camelize, capitalize, handleEventName } from "../shared/index";

export function emit(instance, event, ...args) {
  const { props } = instance;

  const handlerName = camelize(handleEventName(event));
  const handler = props[handlerName];

  handler && handler(...args);
}
