import { Component } from './base/Component';

interface IOrderActions {
  onClickNext: (event: MouseEvent) => void;
  onClickCash: (event: MouseEvent) => void;
  onClickCard: (event: MouseEvent) => void;
  onInput: (event: InputEvent) => void;
}

export interface IOrder {
  isFilled: boolean;
}

export class Order extends Component<IOrder> {
  protected _nextButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;
  protected _cardButton: HTMLButtonElement;
  protected _input: HTMLInputElement;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: IOrderActions
  ) {
    super(container);

    this._nextButton = container.querySelector(`.${blockName}__button`);
    this._cashButton = container.querySelector('button[name="cash"]');
    this._cardButton = container.querySelector('button[name="card"]');
    this._input = container.querySelector('input');

    if (actions?.onClickNext) {
      if (this._nextButton) {
        this._nextButton.addEventListener('click', (evt) => {
          evt.preventDefault();
          actions.onClickNext(evt);
        });
      }
    }

    if (actions?.onClickCard) {
      if (this._cardButton) {
        this._cardButton.addEventListener('click', actions.onClickCard);
      }
    }

    if (actions?.onClickCash) {
      if (this._cashButton) {
        this._cashButton.addEventListener('click', actions.onClickCash);
      }
    }

    if (actions?.onInput) {
      if (this._input) {
        this._input.addEventListener('input', actions.onInput);
      }
    }
  }

  get isFilled() {
    return (
      this._input.value.length &&
      (this._cardButton.classList.contains('button_alt-active') ||
        this._cashButton.classList.contains('button_alt-active'))
    );
  }

  toggleCashButton() {
    this._cardButton.classList.remove('button_alt-active');
    this._cashButton.classList.add('button_alt-active');
  }

  toggleCardButton() {
    this._cardButton.classList.add('button_alt-active');
    this._cashButton.classList.remove('button_alt-active');
  }
}
