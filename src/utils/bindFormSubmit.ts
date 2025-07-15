import { showOrHideError, validateField } from '@utils';

export const bindFormSubmit = async <T = Record<string, string>>(
  inputs: NodeListOf<HTMLInputElement>,
  logMessage?: string
) => {
  let isValid = true;
  inputs.forEach((inp) => {
    const inputEl = inp as HTMLInputElement;
    const [valid, message] = validateField(inputEl.name, inputEl.value);
    showOrHideError(inputEl, valid, message);
    if (!valid) {
      isValid = false;
    }
  });

  if (isValid) {
    const data = {} as T;
    inputs.forEach((inp) => {
      const inputEl = inp as HTMLInputElement;
      (data as Record<string, string>)[inputEl.name] = inputEl.value;
    });

    if (logMessage) {
      console.log(logMessage, data);
    }

    return data;
  }

  return null;
};
