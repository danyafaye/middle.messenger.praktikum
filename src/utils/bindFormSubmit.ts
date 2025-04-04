import { showOrHideError, validateField } from '@utils';

export const bindFormSubmit = (form: HTMLFormElement) => {
  form.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    let hasErrors = false;
    const inputs = form.querySelectorAll('input');
    inputs.forEach((input) => {
      const isValid = validateField(input.name, input.value);
      showOrHideError(input as HTMLInputElement, isValid);
      if (!isValid) {
        hasErrors = true;
      }
    });

    if (!hasErrors) {
      const formData: Record<string, string> = {};
      inputs.forEach((input) => {
        formData[input.name] = input.value;
      });
      console.log('Данные формы:', formData);
    }
  });
};
