import { IOrder, IProduct, FormErrors } from '../types';
import { Model } from './base/Model';
import { IAppState } from '../types';

export class Product extends Model<IProduct> {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export class AppState extends Model<IAppState> {
  basket: Product[];
  store: Product[];
  loading: boolean;
  order: IOrder = {
    items: [],
    total: null,
    address: '',
    email: '',
    phone: '',
  };
  formErrors: FormErrors = {};

  addToBasket(value: Product) {
    this.basket.push(value);
  }

  deleteFromBasket(id: string) {
    this.basket = this.basket.filter(item => item.id !== id)
  }

  clearBasket() {
    this.basket.length = 0;
  }

  setBasket() {
    this.basket = [];
  }

  getTotal() {
    return this.basket.length;
  }

  setItems() {
    this.order.items = this.basket.map(item => item.id)
  }

  getTotalBasketPrice() {
    return this.basket.reduce((sum, next) => sum + next.price, 0);
  }

  setStore(items: IProduct[]) {
    this.store = items.map((item) => new Product(item, this.events));
    this.emitChanges('items:changed', { store: this.store });
  }
}
