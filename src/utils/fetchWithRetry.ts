export const fetchWithRetry = async (
  url: string,
  options: RequestInit & { tries?: number } = {}
): Promise<Response> => {
  const { tries = 1, ...rest } = options;
  const onError = (err: unknown): Promise<Response> => {
    const triesLeft = tries - 1;
    if (!triesLeft) {
      return Promise.reject(err);
    }
    return fetchWithRetry(url, { ...options, tries: triesLeft });
  };
  try {
    return await fetch(url, rest);
  } catch (err) {
    return onError(err);
  }
};
