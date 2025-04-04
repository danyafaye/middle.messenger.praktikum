import { createBlock } from '@framework';
import { createButton, createInput, createLink, createTitle } from '@components';
import { bindFieldValidation, bindFormSubmit, navigateTo } from '@utils';
import { BlockInstance } from '@models';

//language=hbs
const template = `<main class="content-wrapper">
    <section class="form-wrapper">
        {{{ Title }}}
        <form class="form" method="post">
            {{{ InputMail }}}
            <div class="form-row">
                {{{ InputLogin }}}
                {{{ InputPhone }}}
            </div>
            <div class="form-row">
                {{{ InputName }}}
                {{{ InputSurname }}}
            </div>
            <div class="form-row">
                {{{ InputPass }}}
                {{{ InputRepeatPass }}}
            </div>
            {{{ Button }}}
        </form>
        {{{ Link }}}
    </section>
</main>`;

export const createSignUpPage = () => {
  const title = createTitle({
    text: 'Регистрация',
  });
  const inputMail = createInput({
    title: 'Почта',
    id: 'sign-up-form-email',
    type: 'email',
    name: 'email',
    placeholder: 'Введите почту',
  });
  const inputLogin = createInput({
    title: 'Логин',
    id: 'sign-up-form-login',
    name: 'login',
    placeholder: 'Введите логин',
  });
  const inputPhone = createInput({
    title: 'Телефон',
    id: 'sign-up-form-phone',
    name: 'phone',
    placeholder: 'Введите телефон',
  });
  const inputName = createInput({
    title: 'Имя',
    id: 'sign-up-form-first_name',
    name: 'first_name',
    placeholder: 'Введите имя',
  });
  const inputSurname = createInput({
    title: 'Фамилия',
    id: 'sign-up-form-second_name',
    name: 'second_name',
    placeholder: 'Введите фамилию',
  });
  const inputPass = createInput({
    title: 'Пароль',
    id: 'sign-up-form-password',
    name: 'password',
    placeholder: 'Введите пароль',
  });
  const inputRepeatPass = createInput({
    title: 'Повторите пароль',
    id: 'sign-up-form-repeat_password',
    name: 'repeat_password',
    placeholder: 'Введите пароль ещё раз',
  });
  const button = createButton({
    id: 'sign-up-form-button',
    type: 'submit',
    text: 'Зарегистрироваться',
  });
  const link = createLink({
    link: '/',
    id: 'link-to-sign-in',
    text: 'Войти',
    variant: 'secondary',
    onClick: (e) => {
      navigateTo(e, '/');
    },
  });

  return createBlock({
    Title: title,
    InputMail: inputMail,
    InputLogin: inputLogin,
    InputPhone: inputPhone,
    InputName: inputName,
    InputSurname: inputSurname,
    InputPass: inputPass,
    InputRepeatPass: inputRepeatPass,
    Button: button,
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
