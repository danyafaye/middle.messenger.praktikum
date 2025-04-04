import { BlockInstance } from '@models';
import { createBlock } from '@framework';

import './Title.scss';

type TitleProps = {
  text: string;
  isSubTitle?: boolean;
};

//language=hbs
const titleTemplate: string = `<h4 class="title {{#if isSubTitle}} title-sub {{/if}}">{{text}}</h4>`;

export function createTitle(props: TitleProps): BlockInstance {
  return createBlock({
    ...props,
    render: () => titleTemplate,
  });
}
