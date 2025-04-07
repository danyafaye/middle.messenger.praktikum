import Handlebars from 'handlebars';
import { createFooter } from '@components';
import {
  create404Page,
  create500Page,
  createProfilePage,
  createSignInPage,
  createChatPage,
  createSignUpPage,
} from '@pages';
import { fullCompare } from '@utils';

enum ROUTES {
  SIGN_IN = '/',
  SIGN_UP = '/sign-up',
  PAGE_404 = '/404',
  PAGE_500 = '/500',
  PROFILE = '/profile',
}

Handlebars.registerHelper('fullCompare', fullCompare);

const footer = createFooter;
const page404 = create404Page;
const page500 = create500Page;
const chatPage = createChatPage;
const profilePage = createProfilePage;
const signInPage = createSignInPage;
const signUpPage = createSignUpPage;

export const render = () => {
  const path = window.location.pathname;
  let pageContent;

  if (path.startsWith('/chat')) {
    pageContent = chatPage();
  } else {
    const routes = {
      [ROUTES.SIGN_IN]: signInPage,
      [ROUTES.SIGN_UP]: signUpPage,
      [ROUTES.PAGE_404]: page404,
      [ROUTES.PAGE_500]: page500,
      [ROUTES.PROFILE]: profilePage,
    };
    pageContent = routes[path as ROUTES]() ?? page404();
  }

  const appElement = document.getElementById('app');
  if (appElement) {
    appElement.replaceChildren(pageContent.getContent(), footer().getContent());
    pageContent.dispatchComponentDidMount();
    footer().dispatchComponentDidMount();
  }
};
