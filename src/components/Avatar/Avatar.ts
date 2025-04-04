import { BlockInstance } from '@models';
import { createBlock } from '@framework';

import './Avatar.scss';

type AvatarSizes = 'big';

type AvatarProps = {
  avatarImgLink?: string;
  name: string;
  message?: string;
  avatarSize?: AvatarSizes;
};

//language=hbs
const avatarTemplate: string = `
  <figure class="avatar-wrapper">
    {{#if avatarImgLink}}
      <img src="{{avatarImgLink}}" alt="avatarImage" class="avatar-image {{#if avatarSize}}avatar-image-{{avatarSize}}{{/if}}"> 
    {{else}}
      <div class="avatar-image avatar-image-plug {{#if avatarSize}}avatar-image-{{avatarSize}}{{/if}}"></div> 
    {{/if}}
    <figcaption class="avatar-info">
      <p class="avatar-name">
        {{name}}
      </p>
      {{#if message}}
        <p class="avatar-message">
          {{message}}
        </p>
      {{/if}}
    </figcaption>
  </figure>
`;

export function createAvatar(props: AvatarProps): BlockInstance {
  return createBlock({
    ...props,
    render: () => avatarTemplate,
  });
}
