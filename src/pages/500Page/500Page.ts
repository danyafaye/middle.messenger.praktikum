import { BlockInstance } from '@models';
import { createBlock } from '@framework';
import { createH1, createH2, createLink, createTitle } from '@components';

//language=hbs
const template: string = `<main class="content-wrapper">
    <section class="error-page">
        <article class="error-page-heading">
            {{{ H1 }}}
            {{{ H2 }}}
        </article>
        {{{ Title }}}
        {{{ Link }}}
    </section>
</main>`;

export const create500Page = (): BlockInstance => {
  const h1 = createH1({
    text: '500',
  });
  const h2 = createH2({
    text: 'Внутренняя ошибка сервера',
  });
  const title = createTitle({
    text: 'Мы уже фиксим!',
    isSubTitle: true,
  });
  const link = createLink({
    link: '/',
    id: 'link-refresh',
    element: '<img src="/assets/refresh.svg" alt="refreshIcon"/>',
    variant: 'primary',
    size: 'big',
    text: 'Обновить страницу',
    onClick: () => {
      location.reload();
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
