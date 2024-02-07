import { handlePrice } from '../utils/utils';
import { Component } from './base/Component';

interface ISuccessActions {
  onClick: (event: MouseEvent) => void;
}

export interface ISuccess {
  description: number;
}

export class Success extends Component<ISuccess> {
  protected _button: HTMLButtonElement;
  protected _description: HTMLElement;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: ISuccessActions
  ) {
    super(container);

    this._button = container.querySelector(`.${blockName}__close`);
    this._description = container.querySelector(`.${blockName}__description`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick)
      }
    }
  }

  set description(value: number) {
    this._description.textContent = 'Списано ' + handlePrice(value) + ' синапсов'
  }
}
