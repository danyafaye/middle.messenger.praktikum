import { createBlock } from '@framework';
import { BlockInstance } from '@models';

import './Button.scss';

type ButtonColorType = 'blue' | 'red' | 'transparent' | 'standard';
type ButtonSizes = 'small' | 'medium' | 'big' | 'icon';

type ButtonProps = {
  id: string;
  type?: string;
  text?: string;
  element?: string;
  size?: ButtonSizes;
  colorType?: ButtonColorType;
  onClick?: (e: Event) => void;
};

//language=hbs
const buttonTemplate: string = `
<button type="{{type}}" id="{{id}}" class="button button-{{size}} button-{{colorType}}">
  {{#if text}}{{text}}{{/if}}{{#if element}}{{{ element }}}{{/if}}
</button>
`;

export function createButton(props: ButtonProps): BlockInstance {
  return createBlock({
    ...props,
    colorType: props.colorType ? props.colorType : 'standard',
    size: props.size ? props.size : 'medium',
    events: {
      click: (e: Event) => {
        if (props.onClick) {
          props.onClick(e);
        }
      },
    },
    render: () => buttonTemplate,
  });
}
