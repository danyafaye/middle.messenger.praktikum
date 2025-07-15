import { createBlock } from '@framework';
import { createButton, createInput, createLink, createTitle } from '@components';
import { bindFieldValidation, bindFormSubmit } from '@utils';
import { BlockInstance, BlockProps } from '@models';
import { router, ROUTES } from '@router';
import { authApi, SignUpData, UserData } from '@api';
import { connect } from '@store';

//language=hbs
const template = `
    <main class="content-wrapper">
        <section class="form-wrapper">
            {{{ Title }}}
            {{{ Form }}}
            {{{ Link }}}
        </section>
    </main>`;

//language=hbs
const formTemplate = `
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
`;

const createFormBlock = () => {
  const inputMail = createInput({
    title: 'Почта',
    id: 'sign-up-form-email',
    type: 'email',
    name: 'email',
    placeholder: 'Введите почту',
    onBlur: (e: FocusEvent) => {
      const inputEl = e.target as HTMLInputElement;
      bindFieldValidation(inputEl);
    },
  });
  const inputLogin = createInput({
    title: 'Логин',
    id: 'sign-up-form-login',
    name: 'login',
    placeholder: 'Введите логин',
    onBlur: (e: FocusEvent) => {
      const inputEl = e.target as HTMLInputElement;
      bindFieldValidation(inputEl);
    },
  });
  const inputPhone = createInput({
    title: 'Телефон',
    id: 'sign-up-form-phone',
    name: 'phone',
    placeholder: 'Введите телефон',
    onBlur: (e: FocusEvent) => {
      const inputEl = e.target as HTMLInputElement;
      bindFieldValidation(inputEl);
    },
  });
  const inputName = createInput({
    title: 'Имя',
    id: 'sign-up-form-first_name',
    name: 'first_name',
    placeholder: 'Введите имя',
    onBlur: (e: FocusEvent) => {
      const inputEl = e.target as HTMLInputElement;
      bindFieldValidation(inputEl);
    },
  });
  const inputSurname = createInput({
    title: 'Фамилия',
    id: 'sign-up-form-second_name',
    name: 'second_name',
    placeholder: 'Введите фамилию',
    onBlur: (e: FocusEvent) => {
      const inputEl = e.target as HTMLInputElement;
      bindFieldValidation(inputEl);
    },
  });
  const inputPass = createInput({
    title: 'Пароль',
    id: 'sign-up-form-password',
    name: 'password',
    placeholder: 'Введите пароль',
    onBlur: (e: FocusEvent) => {
      const inputEl = e.target as HTMLInputElement;
      bindFieldValidation(inputEl);
    },
  });
  const inputRepeatPass = createInput({
    title: 'Повторите пароль',
    id: 'sign-up-form-repeat_password',
    name: 'repeat_password',
    placeholder: 'Введите пароль ещё раз',
    onBlur: (e: FocusEvent) => {
      const inputEl = e.target as HTMLInputElement;
      bindFieldValidation(inputEl);
    },
  });
  const button = createButton({
    id: 'sign-up-form-button',
    type: 'submit',
    text: 'Зарегистрироваться',
  });
  return createBlock({
    InputMail: inputMail,
    InputLogin: inputLogin,
    InputPhone: inputPhone,
    InputName: inputName,
    InputSurname: inputSurname,
    InputPass: inputPass,
    InputRepeatPass: inputRepeatPass,
    Button: button,
    events: {
      submit: async (e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const inputs = form.querySelectorAll('input');

        let formData = await bindFormSubmit<SignUpData>(inputs, 'Данные формы регистрации');

        if (formData) {
          const { repeat_password, ...filteredData } = formData as SignUpData & {
            repeat_password?: string;
          };
          formData = filteredData as SignUpData;
        }

        if (formData) {
          try {
            await authApi.signUp(formData);
            router.navigate(ROUTES.SIGN_IN);
          } catch (error) {
            console.error('Ошибка при регистрации:', error);
          }
        }
      },
    },
    render: () => formTemplate,
  });
};

type SignUpPageProps = BlockProps & {
  user?: UserData;
};

const mapStateToProps = (state: Record<string, unknown>): Partial<SignUpPageProps> => ({
  user: state.user as UserData | undefined,
});

const SignUpPageBase = (props: SignUpPageProps) => {
  const title = createTitle({
    text: 'Регистрация',
  });
  const link = createLink({
    link: '/',
    id: 'link-to-sign-in',
    text: 'Войти',
    variant: 'secondary',
    onClick: () => {
      router.navigate(ROUTES.SIGN_IN);
    },
  });
  const formBlock = createFormBlock();

  return createBlock({
    Title: title,
    Link: link,
    Form: formBlock,
    render: () => template,
    componentDidMount: () => {
      if (props.user) {
        router.navigate(ROUTES.CHAT);
      }
    },
    componentDidUpdate: (oldProps: BlockProps, newProps: BlockProps) => {
      if (!oldProps.user && newProps.user) {
        router.navigate(ROUTES.CHAT);
      }

      return true;
    },
  }) as BlockInstance;
};

export const createSignUpPage = connect(mapStateToProps, SignUpPageBase);
