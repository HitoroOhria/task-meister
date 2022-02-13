export const newNotFoundNodeErr = (id?: string): Error => {
  const idInfo = id ? `id = ${id}`: ""
  return new Error(`Can not found Node by id. ${idInfo}`);
}

export const newNotFoundChildrenErr = (id?: string): Error => {
  const idInfo = id ? `id = ${id}`: ""
  return  new Error(`Can not found Children by id. ${idInfo}`);
}

export const assertNever = (value: never, message?: string): never => {
  throw new Error(message ?? `Illegal value. value = ${value}`);
};
