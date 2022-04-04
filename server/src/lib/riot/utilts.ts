export const isReactNative = () =>
  typeof navigator === "object" && navigator.product === "ReactNative";

export const isNode = () =>
  typeof process === "object" &&
  Boolean(process.versions?.node) &&
  !isReactNative();

export function pick<T extends Record<string, any>>(
  obj: T,
  ...props: string[]
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => props.includes(k))
  ) as Partial<T>;
}
