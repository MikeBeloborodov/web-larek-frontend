import { Page } from './components/Page';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { Card, StoreItem } from './components/Card';
import { AppState, StoreChangeEvent } from './components/AppData';
import { ensureElement, cloneTemplate } from './utils/utils';
import './scss/styles.scss';
import { ApiResponse, IProduct } from './types';

const api = new Api('https://larek-api.nomoreparties.co/api/weblarek');
const events = new EventEmitter();

// Все шаблоны
const storeProductTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Получаем лоты с сервера
api
	.get('/product')
	.then((res: ApiResponse) => {
		appData.setBasket();
		appData.setStore(res.items as IProduct[]);
	})
	.catch((err) => {
		console.error(err);
	});

// Изменились элементы каталога
events.on<StoreChangeEvent>('items:changed', () => {
	page.store = appData.store.map((item) => {
		const product = new StoreItem(cloneTemplate(storeProductTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		console.log(item.image);
		return product.render({
			title: item.title,
			image: item.image,
			category: item.category,
		});
	});

	page.counter = appData.getBasketCount();
});
