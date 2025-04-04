import { createBlock } from '@framework';
import { createLink } from '@components';
import { BlockInstance } from '@models';
import { navigateTo } from '@utils';

import './Footer.scss';

//language=hbs
const footerTemplate: string = `
      <footer class="footer-template">
        <nav>
          <ul class="footer-list">
            <li>
              {{{ Link404 }}}
            </li>
            <li>
              {{{ Link500 }}}
            </li>
            <li>
              {{{ LinkProfile }}}
            </li>
            <li>
              {{{ LinkChat }}}
            </li>
            <li>
              {{{ LinkAuthorization }}}
            </li>
          </ul>
        </nav>
      </footer>
    `;

export const createFooter = (): BlockInstance => {
  const link404 = createLink({
    link: '/',
    id: 'link-to-404',
    text: '404 Страница',
    variant: 'primary',
    onClick: (e) => {
      navigateTo(e, '/404');
    },
  });
  const link500 = createLink({
    link: '/',
    id: 'link-to-500',
    text: '5** Страница',
    variant: 'primary',
    onClick: (e) => {
      navigateTo(e, '/500');
    },
  });
  const linkProfile = createLink({
    link: '/',
    id: 'link-to-profile',
    text: 'Страница профиля',
    variant: 'primary',
    onClick: (e) => {
      navigateTo(e, '/profile');
    },
  });
  const linkChat = createLink({
    link: '/',
    id: 'link-to-chat',
    text: 'Страница чата',
    variant: 'primary',
    onClick: (e) => {
      navigateTo(e, '/chat');
    },
  });
  const linkAuthorization = createLink({
    link: '/',
    id: 'link-to-authorization',
    text: 'Страница входа/регистрации',
    variant: 'primary',
    onClick: (e) => {
      navigateTo(e, '/');
    },
  });

  return createBlock({
    Link404: link404,
    Link500: link500,
    LinkProfile: linkProfile,
    LinkChat: linkChat,
    LinkAuthorization: linkAuthorization,
    render: () => footerTemplate,
  });
};
