import { createBlock } from '@framework';
import { createButton, createInput, createLink, createTitle } from '@components';
import { bindFieldValidation, bindFormSubmit, navigateTo } from '@utils';
import { BlockInstance } from '@models';

//language=hbs
const template = `<main class="content-wrapper">
    <section class="form-wrapper">
        {{{ Title }}}
        {{{ Form }}}
        {{{ Link }}}
    </section>
</main>`;

//language=hbs
const formTemplate = `<form class="form" method="post">
  {{{ InputLogin }}}
  {{{ InputPassword }}}
  {{{ ButtonSubmit }}}
</form>`;

const createFormBlock = (): BlockInstance => {
  const inputLogin = createInput({
    title: 'Логин',
    id: 'sign-in-form-login',
    name: 'login',
    placeholder: 'Введите логин',
    onBlur: (e: FocusEvent) => {
      const inputEl = e.target as HTMLInputElement;
      bindFieldValidation(inputEl);
    },
  });
  const inputPassword = createInput({
    title: 'Пароль',
    id: 'sign-in-form-password',
    name: 'password',
    placeholder: 'Введите пароль',
    onBlur: (e: FocusEvent) => {
      const inputEl = e.target as HTMLInputElement;
      bindFieldValidation(inputEl);
    },
  });
  const buttonSubmit = createButton({
    id: 'sign-in-form-button',
    type: 'submit',
    text: 'Войти',
  });
  return createBlock({
    InputLogin: inputLogin,
    InputPassword: inputPassword,
    ButtonSubmit: buttonSubmit,
    events: {
      submit: (e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const inputs = form.querySelectorAll('input');
        bindFormSubmit(inputs, 'Данные для входа:');
      },
    },
    render: () => formTemplate,
  });
};

export const createSignInPage = () => {
  const title = createTitle({
    text: 'Вход',
  });
  const formBlock = createFormBlock();
  const link = createLink({
    link: '/',
    id: 'link-to-sign-up',
    text: 'Нет аккаунта?',
    variant: 'secondary',
    onClick: (e) => {
      navigateTo(e, 'sign-up');
    },
  });

  return createBlock({
    Title: title,
    Link: link,
    Form: formBlock,
    render: () => template,
  });
};
