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
            <ul class="profile-tab-list">
                <li class="profile-tab {{#if personalInfo}}profile-tab-active{{/if}}" id="tab-personal-info">Персональная информация</li>
                <li class="profile-tab {{#unless personalInfo}}profile-tab-active{{/unless}}" id="tab-change-pass">Смена пароля</li>
            </ul>
            {{#if personalInfo}}
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
            {{else}}
                <form class="form" method="post">
                    {{{ InputOldPass }}}
                    {{{ InputNewPass }}}
                    {{{ InputRepeatPass }}}
                  {{{ ButtonSubmit }}}
                  {{{ ButtonLeave }}}
                </form>
            {{/if}}
        </section>
    </div>
</main>`;

const sideButtonTemplate = `<button class="profile-side-button" id="profile-side-button">
        <img src="/assets/backIcon.svg" alt="backIcon" class="profile-side-button-img">
    </button>`;

const avatarIconTemplate = `<img id='avatar-icon' src="/assets/avatarPlug.png" alt='avatarPlug' class="profile-avatar-icon"/>`;

const bindTabEvents = (block: BlockInstance) => {
  const el = block.getContent();
  const tabList = el.querySelector('.profile-tab-list');
  if (!tabList) return;
  tabList.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.id === 'tab-personal-info') {
      block.setProps({ personalInfo: true });
    } else if (target.id === 'tab-change-pass') {
      block.setProps({ personalInfo: false });
    }
  });
};

export const createProfilePage = (): BlockInstance => {
  const inputMail = createInput({
    name: 'email',
    placeholder: 'Введите почту',
    type: 'email',
    id: 'profile-form-email',
    title: 'Почта',
  });
  const inputLogin = createInput({
    name: 'login',
    placeholder: 'Введите логин',
    id: 'profile-form-login',
    title: 'Логин',
  });
  const inputName = createInput({
    name: 'first_name',
    placeholder: 'Введите имя',
    id: 'profile-form-first_name',
    title: 'Имя',
  });
  const inputSurname = createInput({
    name: 'second_name',
    placeholder: 'Введите фамилию',
    id: 'profile-form-second_name',
    title: 'Фамилия',
  });
  const inputDisplayName = createInput({
    name: 'display_name',
    placeholder: 'Введите имя в чате',
    id: 'profile-form-display_name',
    title: 'Имя в чате',
  });
  const inputPhone = createInput({
    name: 'phone',
    placeholder: 'Введите телефон',
    id: 'profile-form-phone',
    title: 'Телефон',
  });
  const inputOldPass = createInput({
    name: 'oldPassword',
    placeholder: 'Введите старый пароль',
    id: 'profile-form-oldPassword',
    title: 'Текущий пароль',
  });
  const inputNewPass = createInput({
    name: 'newPassword',
    placeholder: 'Введите новый пароль',
    id: 'profile-form-newPassword',
    title: 'Новый пароль',
  });
  const inputRepeatPass = createInput({
    name: 'repeat_newPassword',
    placeholder: 'Введите новый пароль ещё раз',
    id: 'profile-form-repeat_newPassword',
    title: 'Повторите новый пароль',
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
  const sideButton = createBlock({
    events: {
      click: () => {
        history.back();
      },
    },
    render: () => sideButtonTemplate,
  });
  const avatarIcon = createBlock({
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
  });

  return createBlock({
    personalInfo: true,
    InputMail: inputMail,
    InputLogin: inputLogin,
    InputName: inputName,
    InputSurname: inputSurname,
    InputDisplayName: inputDisplayName,
    InputPhone: inputPhone,
    InputOldPass: inputOldPass,
    InputNewPass: inputNewPass,
    InputRepeatPass: inputRepeatPass,
    ButtonSubmit: buttonSubmit,
    ButtonLeave: buttonLeave,
    SideButton: sideButton,
    AvatarIcon: avatarIcon,
    render: () => template,
    componentDidMount: (block: BlockInstance) => {
      bindTabEvents(block);
      const form = block.getContent().querySelector('form');
      if (form) {
        bindFormSubmit(form);
      }
    },
    afterRender: (block: BlockInstance) => {
      bindTabEvents(block);
      const form = block.getContent().querySelector('form');
      const inputs = block.getContent().querySelectorAll('input');
      inputs.forEach((input: HTMLInputElement) => {
        bindFieldValidation(input as HTMLInputElement);
      });
      if (form) {
        bindFormSubmit(form);
      }
    },
  });
};
