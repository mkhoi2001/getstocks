type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]

function getTypeKeys<T extends object>(): Array<keyof T> {
  return Object.keys({} as T) as Array<keyof T>
}

export { KeysOfType, getTypeKeys }
