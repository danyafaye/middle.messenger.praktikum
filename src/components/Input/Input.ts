import { BlockInstance } from '@models';
import { createBlock } from '@framework';
import Handlebars from 'handlebars';
import { fullCompare } from '@utils';
import './Input.scss';

type InputProps = {
  title?: string;
  id: string;
  name: string;
  placeholder: string;
  type?: string;
  value?: string;
  accept?: string;
  onBlur?: (e: FocusEvent) => void;
};

Handlebars.registerHelper('fullCompare', fullCompare);

//language=hbs
const inputTemplate: string = `
  <div class="input-wrapper">
      {{#if title}}
          <label for="{{id}}" class="input-label {{#if (fullCompare type 'file')}} input-label-file {{/if}}">
              {{#if (fullCompare type 'file')}}
                  <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M2.177 6.5L4.427 2H12.573L14.823 6.5H9.75V7.25C9.75 7.58152 9.6183 7.89946 9.38388 8.13388C9.14946 8.3683 8.83152 8.5 8.5 8.5C8.16848 8.5 7.85054 8.3683 7.61612 8.13388C7.3817 7.89946 7.25 7.58152 7.25 7.25V6.5H2.177ZM2 8V11C2 11.2652 2.10536 11.5196 2.29289 11.7071C2.48043 11.8946 2.73478 12 3 12H14C14.2652 12 14.5196 11.8946 14.7071 11.7071C14.8946 11.5196 15 11.2652 15 11V8H11.146C10.9823 8.57551 10.6354 9.08195 10.1579 9.44254C9.68038 9.80313 9.09835 9.99821 8.5 9.99821C7.90165 9.99821 7.31962 9.80313 6.84213 9.44254C6.36464 9.08195 6.01773 8.57551 5.854 8H2ZM3.5 0.5H13.5L16.394 6.289C16.4635 6.42775 16.4998 6.58079 16.5 6.736V11C16.5 11.663 16.2366 12.2989 15.7678 12.7678C15.2989 13.2366 14.663 13.5 14 13.5H3C2.33696 13.5 1.70107 13.2366 1.23223 12.7678C0.763392 12.2989 0.5 11.663 0.5 11L0.5 6.736C0.500166 6.58079 0.536457 6.42775 0.606 6.289L3.5 0.5Z" fill="#47A8FF"/>
                  </svg>
              {{/if}}
              {{title}}
          </label>
      {{/if}}
    <input type="{{type}}" id="{{id}}" class="input" name="{{name}}" value="{{value}}" placeholder="{{placeholder}}" {{#if accept}}accept="{{accept}}"{{/if}}/>
    <span class="input-error"></span>
  </div>
`;

export const createInput = (props: InputProps): BlockInstance => {
  const defaultTitle = props.title || '';

  return createBlock({
    ...props,
    events: {
      blur: {
        selector: 'input',
        handler: (e: FocusEvent) => {
          if (props.onBlur) {
            props.onBlur(e);
          }
        },
      },
      change: {
        selector: 'input',
        handler: (e: Event) => {
          if (props.type === 'file') {
            const input = e.target as HTMLInputElement;
            const label = document.querySelector(`label[for="${props.id}"]`);

            if (label) {
              if (input.files && input.files.length > 0) {
                label.textContent = input.files[0].name;
              } else {
                label.textContent = defaultTitle;
              }
            }
          }
        },
      },
    },
    render: () => inputTemplate,
    afterRender: () => {
      const inputElement = document.getElementById(props.id) as HTMLInputElement;
      if (inputElement && props.value !== undefined) {
        inputElement.value = props.value;
      }
    },
  });
};
