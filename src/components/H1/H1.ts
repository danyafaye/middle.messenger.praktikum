import { BlockInstance } from '@models';
import { createBlock } from '@framework';

import './H1.scss';

type H1Props = {
  text: string;
};

const template = `<h1 class="heading-first">{{text}}</h1>`;

export function createH1(props: H1Props): BlockInstance {
  return createBlock({
    ...props,
    render: () => template,
  });
}
