export const queryStringify = (data: Record<string, string | number | boolean>): string =>
  Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
