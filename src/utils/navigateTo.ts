import { render } from '@/App';

export const navigateTo = (e: Event, url: string) => {
  e.preventDefault();
  history.pushState(null, '', url);
  render();
};
