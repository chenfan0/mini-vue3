export function shouldUpdateComponent(n1, n2) {
  const { props: oldProps } = n1;
  const { props: newProps } = n2;
  for (const key in newProps) {
    if (oldProps[key] !== newProps[key]) {
      return true;
    }
  }
  return false;
}
