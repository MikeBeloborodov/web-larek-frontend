import { IOrder, IProduct, FormErrors, ProductModel } from '../types';
import { Model } from './base/Model';
import { IAppState } from '../types';

export type StoreChangeEvent = {
	store: Product[];
};

export class Product extends Model<IProduct> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;

	addProduct(product: IProduct): void {}
	deleteProduct(productId: string): void {}
}

export class AppState extends Model<IAppState> {
	basket: Product[];
	store: Product[];
	loading: boolean;
	order: IOrder = {
		products: [],
		amount: null,
		address: '',
		email: '',
		phone: '',
	};
	preview: string | null;
	formErrors: FormErrors = {};

	clearBasket() {}

	getTotal() {}

	getBasketCount() {
		return this.basket.length;
	}

	setBasket() {
		this.basket = [];
	}

	setStore(items: IProduct[]) {
		this.store = items.map((item) => new Product(item, this.events));
		this.emitChanges('items:changed', { store: this.store });
	}
}
