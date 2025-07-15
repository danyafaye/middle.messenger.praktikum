import { createBlock } from '@framework';
import { createButton, createInput, createLink, createTitle } from '@components';
import { bindFieldValidation, bindFormSubmit } from '@utils';
import { BlockInstance, BlockProps } from '@models';
import { router, ROUTES } from '@router';
import { SignInData, UserData } from '@api';
import { authService } from '@services';
import { connect } from '@store';

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
      submit: async (e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const inputs = form.querySelectorAll('input');
        const formData = await bindFormSubmit<SignInData>(inputs, 'Данные для входа:');

        if (formData) {
          try {
            await authService.login(formData);
            router.navigate(ROUTES.CHAT);
          } catch (error) {
            console.error(`Ошибка при входе: ${error}`);
          }
        }
      },
    },
    render: () => formTemplate,
  });
};

type SignInPageProps = BlockProps & {
  user?: UserData;
};

const mapStateToProps = (state: Record<string, unknown>): Partial<SignInPageProps> => ({
  user: state.user as UserData | undefined,
});

const SignInPageBase = (props: SignInPageProps) => {
  const title = createTitle({
    text: 'Вход',
  });
  const formBlock = createFormBlock();
  const link = createLink({
    link: '/',
    id: 'link-to-sign-up',
    text: 'Нет аккаунта?',
    variant: 'secondary',
    onClick: () => {
      router.navigate(ROUTES.SIGN_UP);
    },
  });

  return createBlock({
    Title: title,
    Link: link,
    Form: formBlock,
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
    render: () => template,
  }) as BlockInstance;
};

export const createSignInPage = connect<SignInPageProps>(mapStateToProps, SignInPageBase);
