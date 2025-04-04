export const VALIDATION_RULES: Record<string, RegExp> = {
  // first_name, second_name:
  // - латиница или кириллица
  // - первая буква должна быть заглавной
  // - без пробелов, без спецсимволов (только дефис)
  first_name: /^[A-ZА-Я][A-Za-zА-Яа-я-]+$/,
  second_name: /^[A-ZА-Я][A-Za-zА-Яа-я-]+$/,

  // login:
  // - может содержать латиницу, может содержать цифры
  // - без пробелов, без спецсимволов
  // - длина 3..20
  login: /^[A-Za-z0-9]{3,20}$/,

  // email:
  // - обязательна «собака» @
  // - есть точка (.)
  // - перед «собакой» и после неё — буквы или цифры
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,

  // phone:
  // - от 10 до 15 символов
  // - состоит из цифр, может начинаться с плюса
  phone: /^\+?\d{10,15}$/,

  // password
  // - минимум 6 символов, латиница/цифры, без пробелов
  // - от 8 до 40 символов
  password: /^[A-Za-z0-9]{6,40}$/,
  newPassword: /^[A-Za-z0-9]{6,40}$/,
  oldPassword: /^[A-Za-z0-9]{6,40}$/,
  repeat_newPassword: /^[A-Za-z0-9]{6,40}$/,
  repeat_password: /^[A-Za-z0-9]{6,40}$/,

  // message: не должно быть пустым
  message: /^(?!\s*$).+/,
};

export const validateField = (fieldName: string, value: string): boolean => {
  const rule = VALIDATION_RULES[fieldName];
  if (!rule) {
    return true;
  }
  return rule.test(value);
};

export const bindFieldValidation = (input: HTMLInputElement) => {
  input.addEventListener('blur', () => {
    const isValid = validateField(input.name, input.value);
    showOrHideError(input, isValid);
  });
};

export const showOrHideError = (input: HTMLInputElement, isValid: boolean) => {
  const errorElem = input.parentElement?.querySelector('.input-error');
  if (!isValid) {
    if (errorElem) {
      errorElem.textContent = 'Поле заполнено неверно';
      errorElem.classList.add('input-error-visible');
    }
    input.classList.add('input-invalid');
  } else {
    if (errorElem) {
      errorElem.textContent = '';
      errorElem.classList.remove('input-error-visible');
    }
    input.classList.remove('input-invalid');
  }
};
