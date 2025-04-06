const passwordError = 'Минимум 6 символов, латиница/цифры, без пробелов';
const messageError = 'Поле не должно быть пустым';
const phoneError = 'От 10 до 15 символов, состоит из цифр, может начинаться с плюса';
const emailError = 'Обязательна @, есть ., перед @ и после - буквы или цифры';
const loginError =
  'Может содержать латиницу, цифры, без пробелов и спецсимволов, длина от 3 до 20 символов';
const firstSecondNameError =
  'Латиница или кириллица, первая буква заглавная, без пробелов и спецсимволов';

export const VALIDATION_RULES: Record<string, [RegExp, string]> = {
  // first_name, second_name:
  // - латиница или кириллица
  // - первая буква должна быть заглавной
  // - без пробелов, без спецсимволов (только дефис)
  first_name: [/^[A-ZА-Я][A-Za-zА-Яа-я-]+$/, firstSecondNameError],
  second_name: [/^[A-ZА-Я][A-Za-zА-Яа-я-]+$/, firstSecondNameError],

  // login:
  // - может содержать латиницу, может содержать цифры
  // - без пробелов, без спецсимволов
  // - длина 3..20
  login: [/^[A-Za-z0-9]{3,20}$/, loginError],

  // email:
  // - обязательна «собака» @
  // - есть точка (.)
  // - перед «собакой» и после неё — буквы или цифры
  email: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, emailError],

  // phone:
  // - от 10 до 15 символов
  // - состоит из цифр, может начинаться с плюса
  phone: [/^\+?\d{10,15}$/, phoneError],

  // password
  // - минимум 6 символов, латиница/цифры, без пробелов
  // - от 6 до 40 символов
  password: [/^[A-Za-z0-9]{6,40}$/, passwordError],
  newPassword: [/^[A-Za-z0-9]{6,40}$/, passwordError],
  oldPassword: [/^[A-Za-z0-9]{6,40}$/, passwordError],
  repeat_newPassword: [/^[A-Za-z0-9]{6,40}$/, passwordError],
  repeat_password: [/^[A-Za-z0-9]{6,40}$/, passwordError],

  // message: не должно быть пустым
  message: [/^(?!\s*$).+/, messageError],
};

export const validateField = (fieldName: string, value: string): [boolean, string] => {
  const [rule, message] = VALIDATION_RULES[fieldName];
  if (!rule) {
    return [true, ''];
  }
  return [rule.test(value), message];
};

export const bindFieldValidation = (input: HTMLInputElement) => {
  const [isValid, errorMessage] = validateField(input.name, input.value);
  showOrHideError(input, isValid, errorMessage);
};

export const showOrHideError = (
  input: HTMLInputElement,
  isValid: boolean,
  errorMessage: string = 'Поле заполнено неверно'
) => {
  const errorElem = input.parentElement?.querySelector('.input-error');
  if (!isValid) {
    if (errorElem) {
      errorElem.textContent = errorMessage;
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
