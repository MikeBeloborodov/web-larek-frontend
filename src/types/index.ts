import { Product } from '../components/AppData';

export type CategoryType =
  | 'другое'
  | 'софт-скил'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скил';

export type CategoryMapping = {
  [Key in CategoryType]: string;
};

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

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
  selected: boolean;
}

export interface IAppState {
  basket: string[];
  store: Product[];
  order: IOrder | null;
  loading: boolean;
}

export interface IOrder {
  items: string[];
  payment?: string;
  total: number | null;
  address: string;
  email: string;
  phone: string;
}

export interface IOrderForm {
  payment?: string;
  address: string;
  email: string;
  phone: string;
}
