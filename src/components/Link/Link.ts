import { BlockInstance } from '@models';
import { createBlock } from '@framework';

import './Link.scss';

type LinkVariants = 'primary' | 'secondary';
type LinkSizes = 'big' | 'standard-bold';

type LinkProps = {
  link: string;
  id: string;
  text: string;
  variant?: LinkVariants;
  size?: LinkSizes;
  element?: string;
  rightElement?: string;
  onClick?: (e: Event) => void;
};

//language=hbs
const linkTemplate: string = `
<a href="{{link}}" id="{{id}}" class="link link-{{variant}} link-{{size}}">
  {{{element}}}{{text}}{{{rightElement}}}
</a>
`;

export function createLink(props: LinkProps): BlockInstance {
  return createBlock({
    ...props,
    events: {
      click: (e: Event) => {
        if (props.onClick) {
          props.onClick(e);
        }
      },
    },
    render: () => linkTemplate,
  });
}
