import { showOrHideError, validateField } from '@utils';

export const bindFormSubmit = (
  inputs: NodeListOf<HTMLInputElement>,
  message: string = 'Данные формы'
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
    const data: Record<string, string> = {};
    inputs.forEach((inp) => {
      const inputEl = inp as HTMLInputElement;
      data[inputEl.name] = inputEl.value;
    });
    console.log(message, data);
  }
};
