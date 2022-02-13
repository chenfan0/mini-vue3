export const extend = Object.assign;

export const isObject = (value) => {
  return value !== null && typeof value === "object";
};

export const hasChange = (value, newValue) => {
  return !Object.is(value, newValue);
};

export function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
