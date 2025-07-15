import { createBlock } from '@framework';
import { createButton, createInput } from '@components';
import { bindFieldValidation, bindFormSubmit, isEqual } from '@utils';
import { BASE_URL_RESOURCES, ChangePasswordData, ProfileInfo, UserData, usersApi } from '@api';
import { authService } from '@services';
import { connect } from '@store/connect';
import { store } from '@store';
import { router, ROUTES } from '@router';
import { createModal } from '@components/Modal';
import { BlockInstance, BlockProps, StringIndexed } from '@models';

// =================== ШАБЛОНЫ ===================
//language=hbs
const template = `
    <main class="content-wrapper">
        {{{ SideButton }}}
        <div class="profile-container">
            <section class="profile">
                <article class="profile-avatar-wrapper">
                    <div class="profile-avatar">
                        {{{ AvatarIcon }}}
                        <span id="avatar-change-text" class="profile-avatar-change">Сменить аватар</span>
                    </div>
                    {{{profileAvatarName}}}
                </article>
                {{{ TabList }}}
                {{#if personalInfo}}
                    {{{ PersonalInfoForm }}}
                {{else}}
                    {{{ ChangePasswordForm }}}
                {{/if}}
            </section>
        </div>
        {{{ProfileModal}}}
    </main>`;

//language=hbs
const tabListTemplate = `
    <ul class="profile-tab-list">
        <li data-tab="personal" class="profile-tab profile-tab-active" id="tab-personal-info">Персональная информация
        </li>
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

//language=hbs
const sideButtonTemplate = `
    <button class="profile-side-button" id="profile-side-button">
        <img src="/assets/backIcon.svg" alt="backIcon" class="profile-side-button-img">
    </button>`;

//language=hbs
const avatarIconTemplate = `<img id='avatar-icon' src="{{avatarUrl}}" alt='avatarPlug' class="profile-avatar-icon" />`;

// =================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===================

const getAvatarLink = (avatarData?: string): string => {
  if (!avatarData) return '/assets/avatarPlug.png';
  return `${BASE_URL_RESOURCES}${avatarData}`;
};

const createValidationHandler = () => (e: FocusEvent) => {
  const inputEl = e.target as HTMLInputElement;
  bindFieldValidation(inputEl);
};

// =================== Компоненты ===================

const ConnectedAvatarIcon = connect(
  (state) => ({
    avatarUrl: getAvatarLink((state.user as UserData)?.avatar),
  }),
  ({ avatarUrl, onClick }: { avatarUrl: string; onClick: () => void }) => {
    return createBlock({
      avatarUrl,
      events: {
        mouseenter: () => document.querySelector('#avatar-change-text')?.classList.add('show'),
        mouseleave: () => document.querySelector('#avatar-change-text')?.classList.remove('show'),
        click: onClick,
      },
      render: () => avatarIconTemplate,
    });
  }
);

const ConnectedAvatarName = connect(
  (state) => ({
    profileAvatarName: (state.user as UserData)?.display_name || '',
  }),
  (props) =>
    createBlock({
      ...props,
      render: () => `<span class="profile-avatar-name">{{profileAvatarName}}</span>`,
    })
);

type PersonalInfoFormProps = {
  userData: UserData;
  InputMail: BlockInstance;
  InputLogin: BlockInstance;
  InputName: BlockInstance;
  InputSurname: BlockInstance;
  InputDisplayName: BlockInstance;
  InputPhone: BlockInstance;
  ButtonSubmit: BlockInstance;
  ButtonLeave: BlockInstance;
};

const ConnectedPersonalInfoForm = connect(
  (state) => ({
    userData: state.user as UserData,
  }),
  ({ userData }: PersonalInfoFormProps) => {
    const validationHandler = createValidationHandler();
    let block: BlockInstance;
    const createFormWithInputs = (data?: UserData) => ({
      InputMail: createInput({
        name: 'email',
        placeholder: 'Введите почту',
        type: 'email',
        id: 'profile-form-email',
        title: 'Почта',
        value: data?.email || '',
        onBlur: validationHandler,
      }),
      InputLogin: createInput({
        name: 'login',
        placeholder: 'Введите логин',
        id: 'profile-form-login',
        title: 'Логин',
        value: data?.login || '',
        onBlur: validationHandler,
      }),
      InputName: createInput({
        name: 'first_name',
        placeholder: 'Введите имя',
        id: 'profile-form-first_name',
        title: 'Имя',
        value: data?.first_name || '',
        onBlur: validationHandler,
      }),
      InputSurname: createInput({
        name: 'second_name',
        placeholder: 'Введите фамилию',
        id: 'profile-form-second_name',
        title: 'Фамилия',
        value: data?.second_name || '',
        onBlur: validationHandler,
      }),
      InputDisplayName: createInput({
        name: 'display_name',
        placeholder: 'Введите имя в чате',
        id: 'profile-form-display_name',
        title: 'Имя в чате',
        value: data?.display_name || '',
        onBlur: validationHandler,
      }),
      InputPhone: createInput({
        name: 'phone',
        placeholder: 'Введите телефон',
        id: 'profile-form-phone',
        title: 'Телефон',
        value: data?.phone || '',
        onBlur: validationHandler,
      }),
    });

    block = createBlock({
      ...createFormWithInputs(userData),
      ButtonSubmit: createButton({
        id: 'profile-form-button-save',
        type: 'submit',
        colorType: 'blue',
        text: 'Сохранить изменения',
      }),
      ButtonLeave: createButton({
        id: 'profile-button-leave',
        colorType: 'red',
        text: 'Выйти из аккаунта',
        type: 'button',
        onClick: () => authService.logout(),
      }),
      events: {
        submit: async (e: Event) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const inputs = form.querySelectorAll('input');
          const formData = await bindFormSubmit<ProfileInfo>(inputs, 'Персональные данные:');
          if (formData) {
            try {
              const updatedUserData = await usersApi.changeUserProfileInfo(formData);
              if (updatedUserData) {
                store.setState('user', updatedUserData);
              }
            } catch (error) {
              console.error('Error updating profile:', error);
            }
          }
        },
      },
      render: () => personalInfoFormTemplate,
      componentDidUpdate: (prevProps: BlockProps, newProps: BlockProps) => {
        if (!isEqual(prevProps, newProps)) {
          block.setProps(createFormWithInputs(newProps.userData as UserData));
        }
      },
    });
    return block;
  }
);

const ChangePasswordForm = () => {
  const validationHandler = createValidationHandler();
  return createBlock({
    InputOldPass: createInput({
      name: 'oldPassword',
      placeholder: 'Введите старый пароль',
      id: 'profile-form-oldPassword',
      title: 'Текущий пароль',
      type: 'password',
      onBlur: validationHandler,
    }),
    InputNewPass: createInput({
      name: 'newPassword',
      placeholder: 'Введите новый пароль',
      id: 'profile-form-newPassword',
      title: 'Новый пароль',
      type: 'password',
      onBlur: validationHandler,
    }),
    InputRepeatPass: createInput({
      name: 'repeat_newPassword',
      placeholder: 'Введите новый пароль ещё раз',
      id: 'profile-form-repeat_newPassword',
      title: 'Повторите новый пароль',
      type: 'password',
      onBlur: validationHandler,
    }),
    ButtonSubmit: createButton({
      id: 'profile-form-button-save',
      type: 'submit',
      colorType: 'blue',
      text: 'Сохранить изменения',
    }),
    ButtonLeave: createButton({
      id: 'profile-button-leave',
      colorType: 'red',
      text: 'Выйти из аккаунта',
      type: 'button',
      onClick: () => authService.logout(),
    }),
    events: {
      submit: async (e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const inputs = form.querySelectorAll('input');
        const formData = await bindFormSubmit<ChangePasswordData>(inputs, 'Данные смены пароля:');
        if (formData) {
          try {
            await usersApi.changeUserPassword(formData);
            inputs.forEach((input) => ((input as HTMLInputElement).value = ''));
          } catch (error) {
            console.error('Ошибка при смене пароля:', error);
          }
        }
      },
    },
    render: () => changePasswordFormTemplate,
  });
};

const TabList = ({
  onTabChange,
}: {
  onTabChange: (isPersonal: boolean, liElement: HTMLLIElement) => void;
}) => {
  return createBlock({
    events: {
      click: {
        selector: 'li',
        handler: (e: Event) => {
          const li = (e.target as HTMLElement).closest('li');
          if (!li) return;
          const tab = li.dataset.tab;
          onTabChange(tab === 'personal', li);
        },
      },
    },
    render: () => tabListTemplate,
  });
};

const SideButton = () => {
  return createBlock({
    events: {
      click: () => router.navigate(ROUTES.CHAT),
    },
    render: () => sideButtonTemplate,
  });
};

const ProfileModal = () => {
  const modalContentTemplate = `<div class="modal-file-upload">
        {{{ FileInput }}}
    </div>`;

  const fileInput = createInput({
    id: 'profile-avatar-input',
    name: 'avatar',
    title: 'Выбрать файл на компьютере',
    placeholder: 'Выберите файл на компьютере',
    type: 'file',
    accept: '.webp,.png,.jpeg,.jpg,.gif',
  });

  const modalContent = createBlock({
    FileInput: fileInput,
    render: () => modalContentTemplate,
  });

  return createModal({
    id: 'profile-modal',
    title: 'Загрузите файл',
    buttonText: 'Сменить',
    buttonAction: async () => {
      const input = document.getElementById('profile-avatar-input') as HTMLInputElement;
      if (input?.files?.length) {
        try {
          const formData = new FormData();
          formData.append('avatar', input.files[0]);
          const newUserData = await usersApi.changeUserAvatar(formData);
          if (newUserData) {
            store.setState('user', newUserData);
          }
        } catch (error) {
          console.error('Ошибка при обновлении аватара:', error);
        }
      }
    },
    content: modalContent,
  });
};

// =================== ProfilePage ===================
export const createProfilePage = () => {
  let showPersonalInfo = true;

  const avatarIcon = ConnectedAvatarIcon({
    onClick: () => profileModal.showModal(),
  });

  const profileAvatarName = ConnectedAvatarName({});

  const personalInfoForm = ConnectedPersonalInfoForm({});
  const changePasswordForm = ChangePasswordForm();

  const profileModal = ProfileModal();

  const tabList = TabList({
    onTabChange: (isPersonal, liElement) => {
      showPersonalInfo = isPersonal;
      block.setProps({ personalInfo: showPersonalInfo });
      const tabListContainer = liElement.parentElement;
      if (tabListContainer) {
        tabListContainer.querySelectorAll('li').forEach((li) => {
          li.classList.remove('profile-tab-active');
        });
      }
      liElement.classList.add('profile-tab-active');
    },
  });

  const sideButton = SideButton();

  const block = createBlock({
    SideButton: sideButton,
    AvatarIcon: avatarIcon,
    profileAvatarName,
    TabList: tabList,
    PersonalInfoForm: personalInfoForm,
    ChangePasswordForm: changePasswordForm,
    ProfileModal: profileModal,
    personalInfo: showPersonalInfo,
    render: () => template,
    componentDidMount: () => {
      let user = (store.getState() as StringIndexed)?.user as UserData;
      if (!user) {
        authService.getUserData().then((userData) => {
          store.setState('user', userData);
        });
      }
    },
  });

  return block;
};
