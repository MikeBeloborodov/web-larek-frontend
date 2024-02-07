import { Product } from '../components/AppData';
import { Model } from '../components/base/Model';

export type CategoryType =
  | 'другое'
  | 'софт-скил'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скил';
export type CategoryMapping = {
  [Key in CategoryType]: string;
};
export type PaymentType = 'card' | 'cash';
export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface ApiResponse {
  items: IProduct[];
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: CategoryType;
  price: number | null;
}

interface IProductModel {
  products: IProduct[];
  addProduct(product: IProduct): void;
  deleteProduct(productId: string): void;
}

export interface IAppState {
  basket: string[];
  store: Product[];
  order: IOrder | null;
  loading: boolean;
}

interface IBasketModel {
  products: IProduct[];
  addProduct(product: IProduct): void;
  deleteProduct(productId: string): void;
}

export interface IOrder {
  items: string[];
  payment?: PaymentType;
  total: number | null;
  address: string;
  email: string;
  phone: string;
}

export class ProductModel extends Model<IProduct> {
  products: IProduct[];

  addProduct(product: IProduct): void { }
  deleteProduct(productId: string): void { }
}

class BasketModel implements IBasketModel {
  products: IProduct[];

  addProduct(product: IProduct): void { }
  deleteProduct(productId: string): void { }
}
