import { IProduct } from '../types';
import { handlePrice } from '../utils/utils';
import { Component } from './base/Component';

interface IBasketActions {
  onClick: (event: MouseEvent) => void;
}

export interface IBasket {
  list: HTMLElement[];
  price: number;
}

export class Basket extends Component<IBasket> {
  protected _list: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: IBasketActions
  ) {
    super(container);

    this._button = container.querySelector(`.${blockName}__button`);
    this._price = container.querySelector(`.${blockName}__price`);
    this._list = container.querySelector(`.${blockName}__list`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  set price(price: number) {
    this._price.textContent = handlePrice(price) + ' синапсов';
  }

  set list(items: HTMLElement[]) {
    this._list.replaceChildren(...items);
    if (!items.length) {
      this._button.disabled = true;
    }
  }

  refreshIndices() {
    Array.from(this._list.children).forEach(
      (item, index) =>
      (item.querySelector(`.basket__item-index`)!.textContent = (
        index + 1
      ).toString())
    );
  }
}

export interface IProductBasket extends IProduct {
  id: string;
  index: number;
}

export interface IStoreItemBasketActions {
  onDelete: (event: MouseEvent) => void;
}

export class StoreItemBasket extends Component<IProductBasket> {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: IStoreItemBasketActions
  ) {
    super(container);

    this._title = container.querySelector(`.${blockName}__title`);
    this._index = container.querySelector(`.basket__item-index`);
    this._price = container.querySelector(`.${blockName}__price`);
    this._button = container.querySelector(`.${blockName}__button`);

    if (this._button) {
      this._button.addEventListener('click', (evt) => {
        this.container.remove();
        actions?.onDelete(evt);
      });
    }
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set index(value: number) {
    this._index.textContent = value.toString();
  }

  set price(value: number) {
    this._price.textContent = handlePrice(value) + ' синапсов';
  }
}
