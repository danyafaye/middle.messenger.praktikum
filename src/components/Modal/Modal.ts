import { BlockInstance, ModalInstance } from '@models';
import { createBlock } from '@framework';
import { createButton } from '@components';

import './Modal.scss';

type ModalProps = {
  isOpen?: boolean;
  title: string;
  content: BlockInstance;
  id: string;
  buttonText: string;
  buttonAction: () => void;
};

//language=hbs
const closeIconTemplate = `<div class="close-wrapper">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.47 13.53L13 14.06L14.06 13L13.53 12.47L9.06 8L13.53 3.53L14.06 3L13 1.94L12.47 2.47L8 6.94L3.53 2.47L3 1.94L1.94 3L2.47 3.53L6.94 8L2.47 12.47L1.94 13L3 14.06L3.53 13.53L8 9.06L12.47 13.53Z" fill="white"/>
    </svg>
</div>`;

//language=hbs
const modalTemplate: string = `<dialog id="{{id}}" class="modal-wrapper">
    {{{CloseIcon}}}
    <p class="modal-header">{{title}}</p>
    <section class="modal-content">{{{content}}}</section>
    {{{FooterButton}}}
</dialog>`;

export const createModal = (props: ModalProps): ModalInstance => {
  const FooterButton = createButton({
    id: 'modal-footer-button',
    type: 'standard',
    size: 'medium',
    text: props.buttonText,
    onClick: () => {
      props.buttonAction();
      closeModal();
    },
  });

  const CloseIcon = createBlock({
    events: {
      click: () => closeModal(),
    },
    render: () => closeIconTemplate,
  });

  const instance = createBlock({
    ...props,
    FooterButton,
    CloseIcon: CloseIcon,
    render: () => modalTemplate,
  });

  const originalGetContent = instance.getContent;

  const showModal = () => {
    const dialog = originalGetContent() as HTMLDialogElement;
    if (dialog && typeof dialog.showModal === 'function') {
      dialog.showModal();
    }
  };

  const closeModal = () => {
    const dialog = originalGetContent() as HTMLDialogElement;
    if (dialog && typeof dialog.close === 'function') {
      dialog.close();
    }
  };

  return {
    ...instance,
    showModal,
    closeModal,
    getContent: originalGetContent,
  };
};
