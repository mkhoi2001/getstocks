export function excludeField<T, Key extends keyof T>(obj: T, keys: Key[]): T {
  for (const key of keys) {
    delete obj[key]
  }
  return obj
}
