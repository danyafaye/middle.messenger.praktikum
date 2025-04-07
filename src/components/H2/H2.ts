import './H2.scss';
import { BlockInstance } from '@models';
import { createBlock } from '@framework';

type H2Props = {
  text: string;
};

//language=hbs
const template: string = `<h2 class="heading-second">{{text}}</h2>`;

export function createH2(props: H2Props): BlockInstance {
  return createBlock({
    ...props,
    render: () => template,
  });
}
