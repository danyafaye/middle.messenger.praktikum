import { createBlock } from '@framework';
import { createButton, createInput, createLink, createTitle } from '@components';
import { bindFieldValidation, bindFormSubmit, navigateTo } from '@utils';
import { BlockInstance } from '@models';

//language=hbs
const template = `<main class="content-wrapper">
    <section class="form-wrapper">
        {{{ Title }}}
        <form class="form" method="post">
            {{{ InputLogin }}}
            {{{ InputPassword }}}
            {{{ ButtonSubmit }}}
        </form>
        {{{ Link }}}
    </section>
</main>`;

export const createSignInPage = () => {
  const title = createTitle({
    text: 'Вход',
  });
  const inputLogin = createInput({
    title: 'Логин',
    id: 'sign-in-form-login',
    name: 'login',
    placeholder: 'Введите логин',
  });
  const inputPassword = createInput({
    title: 'Пароль',
    id: 'sign-in-form-password',
    name: 'password',
    placeholder: 'Введите пароль',
  });
  const buttonSubmit = createButton({
    id: 'sign-in-form-button',
    type: 'submit',
    text: 'Войти',
  });
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
    InputLogin: inputLogin,
    InputPassword: inputPassword,
    ButtonSubmit: buttonSubmit,
    Link: link,
    render: () => template,
    afterRender: (block: BlockInstance) => {
      const content = block.getContent();
      const form = content.querySelector('form');
      const inputs = content.querySelectorAll('input');
      inputs.forEach((input) => {
        bindFieldValidation(input as HTMLInputElement);
      });
      if (form) {
        bindFormSubmit(form);
      }
    },
  });
};
