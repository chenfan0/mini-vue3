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

export function isArray(value) {
  return Array.isArray(value);
}

// foo-add => fooAdd
export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, p: string) => {
    return p ? p.toUpperCase() : "";
  });
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// fooAdd => onFooAdd
export const handleEventName = (name: string) => {
  return name ? "on" + capitalize(name) : "";
};

export function warn(...args) {
  console.warn(...args);
}

export const EMPTY_OBJ = {};
