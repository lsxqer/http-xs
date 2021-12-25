


export const objectCreate = <
  T extends Record<string, any> = Record<string, any>,
  U extends Record<string, any> = Record<string, any>,
>(superProto: U = null) => Object.create(superProto) as T & U;




