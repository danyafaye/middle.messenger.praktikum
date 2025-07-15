export type Indexed<T = any> = {
  [k in string | symbol]: T;
};

export type StringIndexed = Record<string, unknown>;
