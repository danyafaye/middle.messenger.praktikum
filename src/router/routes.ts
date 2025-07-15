import { BlockInstance } from '@models';
import {
  create404Page,
  create500Page,
  createChatPage,
  createProfilePage,
  createSignInPage,
  createSignUpPage,
} from '@pages';
import { generatePath } from '@utils';

type Route = {
  pathname: string;
  component: (params: { id?: string }) => BlockInstance;
};

export enum ROUTES {
  SIGN_IN = '/',
  SIGN_UP = '/sign-up',
  PAGE_404 = '/404',
  PAGE_500 = '/500',
  PROFILE = '/settings',
  CHAT = '/messenger',
  CHAT_WITH_ID = '/messenger/:id',
}

export const ROUTE_URLS = {
  CHAT_WITH_ID: (id: string) => generatePath(ROUTES.CHAT_WITH_ID, { id }),
};

export const routeList = {
  [ROUTES.SIGN_IN]: createSignInPage,
  [ROUTES.SIGN_UP]: createSignUpPage,
  [ROUTES.PAGE_404]: create404Page,
  [ROUTES.PAGE_500]: create500Page,
  [ROUTES.PROFILE]: createProfilePage,
  [ROUTES.CHAT]: (params: { id?: string }) => createChatPage(params),
  [ROUTES.CHAT_WITH_ID]: (params: { id?: string }) => createChatPage(params),
};

const createRouter = (rootId: string) => {
  const routes: Route[] = [];
  const history = window.history;

  const use = (pathname: string, component: (params: { id?: string }) => BlockInstance) => {
    routes.push({ pathname, component });
  };

  const getRoute = (pathname: string): Route | undefined => {
    return routes.find((route) => {
      if (route.pathname.includes(':id')) {
        return matchPath(route.pathname, pathname);
      } else if (route.pathname === pathname) {
        return true;
      }
      return false;
    });
  };

  const navigate = (pathname: string) => {
    const route = getRoute(pathname);
    if (route) {
      const params = extractParams(route.pathname, pathname);
      history.pushState({}, '', pathname);
      renderComponent(route.component, params);
    } else {
      history.pushState({}, '', ROUTES.PAGE_404);
      renderComponent(routeList[ROUTES.PAGE_404], {});
    }
  };

  const matchPath = (routePath: string, currentPath: string): boolean => {
    const routeRegex = new RegExp(routePath.replace(/:id/, '(\\d+)'));
    return routeRegex.test(currentPath);
  };

  const extractParams = (routePath: string, currentPath: string): { id?: string } => {
    const match = currentPath.match(new RegExp(routePath.replace(/:id/, '(\\d+)')));
    if (!match) return {};
    return { id: match[1] };
  };

  const renderComponent = (
    component: (params: { id?: string }) => BlockInstance,
    params: { id?: string }
  ) => {
    const root = document.getElementById(rootId);
    if (root) {
      const componentInstance = component(params);
      root.replaceChildren(componentInstance.getContent());
      componentInstance.dispatchComponentDidMount();
    }
  };

  const onRoute = () => {
    const pathname = window.location.pathname;
    const route = getRoute(pathname);
    if (route) {
      const params = extractParams(route.pathname, pathname);
      renderComponent(route.component, params);
    } else {
      history.pushState({}, '', ROUTES.PAGE_404);
      renderComponent(routeList[ROUTES.PAGE_404], {});
    }
  };

  const start = () => {
    onRoute();

    window.addEventListener('popstate', onRoute);
  };

  return { use, navigate, start };
};

export const router = createRouter('app');
