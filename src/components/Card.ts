import { Component } from './base/Component';
import { CategoryMapping, CategoryType } from '../types';
import { ensureElement, handlePrice } from '../utils/utils';

const categoryMapping: CategoryMapping = {
  другое: 'card__category_other',
  'софт-скил': 'card__category_soft',
  дополнительное: 'card__category_additional',
  кнопка: 'card__category_button',
  'хард-скил': 'card__category_hard',
};

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICard {
  id: string;
  title: string;
  category: string;
  image: string;
  price: number | null;
}

export class Card extends Component<ICard> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: ICardActions
  ) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._image = ensureElement<HTMLImageElement>(
      `.${blockName}__image`,
      container
    );
    this._button = container.querySelector(`.${blockName}__button`);
    this._category = container.querySelector(`.${blockName}__category`);
    this._price = container.querySelector(`.${blockName}__price`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  get title(): string {
    return this._title.textContent || '';
  }

  set image(value: string) {
    this._image.src =
      'https://larek-api.nomoreparties.co/content/weblarek' + value;
  }

  set price(value: number | null) {
    this._price.textContent = value
      ? handlePrice(value) + ' синапсов'
      : 'Бесценно';
  }

  set category(value: CategoryType) {
    this._category.textContent = value;
    this._category.classList.add(categoryMapping[value]);
  }
}

export class StoreItem extends Card {
  protected _status: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);
  }
}
