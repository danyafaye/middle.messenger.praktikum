import { BlockInstance } from '@models';
import { createH1, createLink, createTitle } from '@components';
import { createBlock } from '@framework';
import { navigateTo } from '@utils';

//language=hbs
const template: string = `
<main class="content-wrapper">
    <section class="error-page">
        <article class="error-page-heading">
            {{{ H1 }}}
            {{{ H2 }}}
        </article>
        {{{ Title }}}
        {{{ Link }}}
    </section>
</main>
`;

export const create404Page = (): BlockInstance => {
  const h1 = createH1({
    text: '404',
  });
  const h2 = createH1({
    text: 'Не найдено',
  });
  const title = createTitle({
    text: 'Упс! Не туда попали',
    isSubTitle: true,
  });
  const link = createLink({
    link: '/',
    id: 'link-to-sign-up',
    element: '<img src="/assets/backIcon.svg" alt="backIcon"/>',
    variant: 'primary',
    size: 'big',
    text: 'Назад на главную',
    onClick: (e) => {
      navigateTo(e, 'sign-up');
    },
  });
  return createBlock({
    H1: h1,
    H2: h2,
    Title: title,
    Link: link,
    render: () => template,
  });
};
