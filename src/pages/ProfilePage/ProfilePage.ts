import { BlockInstance } from '@models';
import { createBlock } from '@framework';
import { createButton, createInput } from '@components';
import { bindFieldValidation, bindFormSubmit } from '@utils';

//language=hbs
const template = `<main class="content-wrapper">
    {{{ SideButton }}}
    <div class="profile-container">
        <section class="profile">
            <article class="profile-avatar-wrapper">
                <div class="profile-avatar">
                    {{{ AvatarIcon }}}
                    <span id="avatar-change-text" class="profile-avatar-change">Сменить аватар</span>
                </div>
                <span class="profile-avatar-name">Данила</span>
            </article>
            {{{ TabList }}}
            {{#if personalInfo}}
              {{{ PersonalInfoForm }}}
            {{else}}
              {{{ ChangePasswordForm }}}
            {{/if}}
        </section>
    </div>
</main>`;

//language=hbs
const tabListTemplate = `
  <ul class="profile-tab-list">
    <li data-tab="personal" class="profile-tab profile-tab-active" id="tab-personal-info">Персональная информация</li>
    <li data-tab="password" class="profile-tab" id="tab-change-pass">Смена пароля</li>
  </ul>
`;

//language=hbs
const personalInfoFormTemplate = `
  <form class="form" method="post">
    <div class="form-row">
      {{{ InputMail }}}
      {{{ InputLogin }}}
    </div>
    <div class="form-row">
      {{{ InputName }}}
      {{{ InputSurname }}}
    </div>
    <div class="form-row">
      {{{ InputDisplayName }}}
      {{{ InputPhone }}}
    </div>
    {{{ ButtonSubmit }}}
    {{{ ButtonLeave }}}
  </form>
`;

//language=hbs
const changePasswordFormTemplate = `
  <form class="form" method="post">
    {{{ InputOldPass }}}
    {{{ InputNewPass }}}
    {{{ InputRepeatPass }}}
    {{{ ButtonSubmit }}}
    {{{ ButtonLeave }}}
  </form>
`;

const sideButtonTemplate = `<button class="profile-side-button" id="profile-side-button">
        <img src="/assets/backIcon.svg" alt="backIcon" class="profile-side-button-img">
    </button>`;

const avatarIconTemplate = `<img id='avatar-icon' src="/assets/avatarPlug.png" alt='avatarPlug' class="profile-avatar-icon"/>`;

const createPersonalInfoForm = (): BlockInstance => {
  const inputMail = createInput({
    name: 'email',
    placeholder: 'Введите почту',
    type: 'email',
    id: 'profile-form-email',
    title: 'Почта',
    onBlur: (e: FocusEvent) => {
      const inputEl = e.target as HTMLInputElement;
      bindFieldValidation(inputEl);
    },
  });
  const inputLogin = createInput({
    name: 'login',
    placeholder: 'Введите логин',
    id: 'profile-form-login',
    title: 'Логин',
    onBlur: (e: FocusEvent) => {
      const inputEl = e.target as HTMLInputElement;
      bindFieldValidation(inputEl);
    },
  });
  const inputName = createInput({
    name: 'first_name',
    placeholder: 'Введите имя',
    id: 'profile-form-first_name',
    title: 'Имя',
    onBlur: (e: FocusEvent) => {
      const inputEl = e.target as HTMLInputElement;
      bindFieldValidation(inputEl);
    },
  });
  const inputSurname = createInput({
    name: 'second_name',
    placeholder: 'Введите фамилию',
    id: 'profile-form-second_name',
    title: 'Фамилия',
    onBlur: (e: FocusEvent) => {
      const inputEl = e.target as HTMLInputElement;
      bindFieldValidation(inputEl);
    },
  });
  const inputDisplayName = createInput({
    name: 'display_name',
    placeholder: 'Введите имя в чате',
    id: 'profile-form-display_name',
    title: 'Имя в чате',
    onBlur: (e: FocusEvent) => {
      const inputEl = e.target as HTMLInputElement;
      bindFieldValidation(inputEl);
    },
  });
  const inputPhone = createInput({
    name: 'phone',
    placeholder: 'Введите телефон',
    id: 'profile-form-phone',
    title: 'Телефон',
    onBlur: (e: FocusEvent) => {
      const inputEl = e.target as HTMLInputElement;
      bindFieldValidation(inputEl);
    },
  });
  const buttonSubmit = createButton({
    id: 'profile-form-button-save',
    type: 'submit',
    colorType: 'blue',
    text: 'Сохранить изменения',
  });
  const buttonLeave = createButton({
    id: 'profile-button-leave',
    colorType: 'red',
    text: 'Выйти из аккаунта',
  });

  return createBlock({
    InputMail: inputMail,
    InputLogin: inputLogin,
    InputName: inputName,
    InputSurname: inputSurname,
    InputDisplayName: inputDisplayName,
    InputPhone: inputPhone,
    ButtonSubmit: buttonSubmit,
    ButtonLeave: buttonLeave,
    events: {
      submit: (e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const inputs = form.querySelectorAll('input');
        bindFormSubmit(inputs, 'Персональные данные:');
      },
    },
    render: () => personalInfoFormTemplate,
  });
};

const createChangePasswordForm = (): BlockInstance => {
  const inputOldPass = createInput({
    name: 'oldPassword',
    placeholder: 'Введите старый пароль',
    id: 'profile-form-oldPassword',
    title: 'Текущий пароль',
    onBlur: (e: FocusEvent) => {
      const inputEl = e.target as HTMLInputElement;
      bindFieldValidation(inputEl);
    },
  });
  const inputNewPass = createInput({
    name: 'newPassword',
    placeholder: 'Введите новый пароль',
    id: 'profile-form-newPassword',
    title: 'Новый пароль',
    onBlur: (e: FocusEvent) => {
      const inputEl = e.target as HTMLInputElement;
      bindFieldValidation(inputEl);
    },
  });
  const inputRepeatPass = createInput({
    name: 'repeat_newPassword',
    placeholder: 'Введите новый пароль ещё раз',
    id: 'profile-form-repeat_newPassword',
    title: 'Повторите новый пароль',
    onBlur: (e: FocusEvent) => {
      const inputEl = e.target as HTMLInputElement;
      bindFieldValidation(inputEl);
    },
  });
  const buttonSubmit = createButton({
    id: 'profile-form-button-save',
    type: 'submit',
    colorType: 'blue',
    text: 'Сохранить изменения',
  });
  const buttonLeave = createButton({
    id: 'profile-button-leave',
    colorType: 'red',
    text: 'Выйти из аккаунта',
  });
  return createBlock({
    InputOldPass: inputOldPass,
    InputNewPass: inputNewPass,
    InputRepeatPass: inputRepeatPass,
    ButtonSubmit: buttonSubmit,
    ButtonLeave: buttonLeave,
    events: {
      submit: (e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const inputs = form.querySelectorAll('input');
        bindFormSubmit(inputs, 'Данные смены пароля:');
      },
    },
    render: () => changePasswordFormTemplate,
  });
};

const onTabClick = (personalInfo: boolean, liElement: HTMLLIElement): void => {
  profilePageInstance.setProps({ personalInfo });
  const tabListContainer = liElement.parentElement;
  if (tabListContainer) {
    tabListContainer.querySelectorAll('li').forEach((li) => {
      li.classList.remove('profile-tab-active');
    });
  }
  liElement.classList.add('profile-tab-active');
};

let profilePageInstance: BlockInstance;

profilePageInstance = createBlock({
  personalInfo: true,
  SideButton: createBlock({
    events: { click: () => history.back() },
    render: () => sideButtonTemplate,
  }),
  AvatarIcon: createBlock({
    events: {
      mouseenter: () => {
        const textEl = document.querySelector('#avatar-change-text');
        textEl?.classList.add('show');
      },
      mouseleave: () => {
        const textEl = document.querySelector('#avatar-change-text');
        textEl?.classList.remove('show');
      },
    },
    render: () => avatarIconTemplate,
  }),
  PersonalInfoForm: createPersonalInfoForm(),
  ChangePasswordForm: createChangePasswordForm(),
  TabList: createBlock({
    personalInfo: true,
    events: {
      click: {
        selector: 'li',
        handler: (e: Event) => {
          const li = (e.target as HTMLElement).closest('li');
          if (!li) return;
          const tab = li.dataset.tab;
          onTabClick(tab === 'personal', li);
        },
      },
    },
    render: () => tabListTemplate,
  }),
  render: () => template,
});

export const createProfilePage = (): BlockInstance => {
  return profilePageInstance;
};
