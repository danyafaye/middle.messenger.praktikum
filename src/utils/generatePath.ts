export const generatePath = (path: string, params: Record<string, string | number>): string => {
  if (!path) {
    return '';
  }

  let result = path;

  Object.entries(params).forEach(([key, value]) => {
    const placeholder = `:${key}`;
    result = result.replace(placeholder, String(value));
  });

  return result;
};
