import { BlockInstance } from '@models';
import { createBlock } from '@framework';

import './Input.scss';

type InputProps = {
  title?: string;
  id: string;
  name: string;
  placeholder: string;
  type?: string;
};

//language=hbs
const inputTemplate: string = `
<div class="input-wrapper">
  {{#if title}}
    <label for="{{id}}" class="input-label">{{title}}</label>
  {{/if}}
  <input type="{{type}}" id="{{id}}" class="input" name="{{name}}" placeholder="{{placeholder}}"/>
  <span class="input-error"></span>
</div>
`;

export function createInput(props: InputProps): BlockInstance {
  return createBlock({
    ...props,
    render: () => inputTemplate,
  });
}
