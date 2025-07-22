import Handlebars from 'handlebars';

import { fullCompare, hasItems, isEmpty } from '@utils';
import { routeList, router } from '@router';
import { authService } from '@services';

export const render = () => {
  Object.entries(routeList).forEach(([pathname, component]) => {
    router.use(pathname, component);
  });

  Handlebars.registerHelper('fullCompare', fullCompare);
  Handlebars.registerHelper('hasItems', hasItems);
  Handlebars.registerHelper('isEmpty', isEmpty);
  router.start();

  authService.startUserPolling();
};
