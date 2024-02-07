import { Component } from './base/Component';

interface IContactsActions {
  onEmailInput: (event: InputEvent) => void;
  onPhoneInput: (event: InputEvent) => void;
  onClickNext: (event: MouseEvent) => void;
}

export interface IContacts {
  isFilled: boolean;
}

export class Contacts extends Component<IContacts> {
  protected _nextButton: HTMLButtonElement;
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: IContactsActions
  ) {
    super(container);

    this._nextButton = container.querySelector('form[name="contacts"] .button');
    this._emailInput = container.querySelector('input[name="email"]');
    this._phoneInput = container.querySelector('input[name="phone"]');

    if (actions?.onClickNext) {
      if (this._nextButton) {
        this._nextButton.addEventListener('click', (evt) => {
          evt.preventDefault();
          actions.onClickNext(evt);
        });
      }
    }

    if (actions?.onEmailInput) {
      if (this._emailInput) {
        this._emailInput.addEventListener('input', actions.onEmailInput);
      }
    }

    if (actions?.onPhoneInput) {
      if (this._phoneInput) {
        this._phoneInput.addEventListener('input', actions.onPhoneInput);
      }
    }
  }

  get isFilled() {
    return this._phoneInput.value.length && this._emailInput.value.length;
  }
}
