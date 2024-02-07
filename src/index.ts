import { Page } from './components/Page';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { StoreItem, StoreItemPreview } from './components/Card';
import { AppState, Product } from './components/AppData';
import { ensureElement, cloneTemplate } from './utils/utils';
import { ApiResponse, IProduct } from './types';
import { API_URL } from './utils/constants';
import './scss/styles.scss';
import { Basket, StoreItemBasket } from './components/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';

const api = new Api(API_URL);
const events = new EventEmitter();

// Все шаблоны
const storeProductTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

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
events.on('items:changed', () => {
	page.store = appData.store.map((item) => {
		const product = new StoreItem(cloneTemplate(storeProductTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

// Открытие карточки
events.on('card:select', (item: Product) => {
	page.locked = true;
	const product = new StoreItemPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			appData.addToBasket(item);
			page.counter = appData.getTotal();
			modal.close();
		},
	});
	modal.render({
		content: product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			description: item.description,
			price: item.price,
		}),
	});
});

// Закрытие карточки
events.on('modal:close', () => {
	page.locked = false;
});

// Открытие корзины
events.on('basket:open', () => {
	const basket = new Basket('basket', cloneTemplate(basketTemplate), {
		onClick: () => events.emit('basket:order'),
	});
	const basketItems = appData.basket.map((item, index) => {
		const storeItem = new StoreItemBasket(
			'card',
			cloneTemplate(cardBasketTemplate),
			{
				onClick: () => {},
			}
		);
		return storeItem.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	modal.render({
		content: basket.render({
			list: basketItems,
			price: appData.getTotalBasketPrice(),
		}),
	});
});

// Оформить заказ
events.on('basket:order', () => {
	const checkForm = () => {
		if (order.isFilled) {
			order.setDisabled(
				ensureElement<HTMLButtonElement>('.order__button'),
				false
			);
		} else {
			order.setDisabled(
				ensureElement<HTMLButtonElement>('.order__button'),
				true
			);
		}
	};
	const order = new Order('order', cloneTemplate(orderTemplate), {
		onClickNext: () => {
			events.emit('order:contacts');
		},
		onClickCash: () => {
			order.toggleCashButton();
			checkForm();
		},
		onClickCard: () => {
			order.toggleCardButton();
			checkForm();
		},
		onInput: () => {
			checkForm();
		},
	});
	modal.render({
		content: order.render(),
	});
});

// Заполнить телефон и почту
events.on('order:contacts', () => {
	const contacts = new Contacts('contacts', cloneTemplate(contactsTemplate), {
		onPhoneInput: () => {
			checkForm();
		},
		onEmailInput: () => {
			checkForm();
		},
		onClickNext: () => {
			console.log('complete!');
		},
	});
	const checkForm = () => {
		if (contacts.isFilled) {
			contacts.setDisabled(
				ensureElement<HTMLButtonElement>('form[name="contacts"] .button'),
				false
			);
		} else {
			contacts.setDisabled(
				ensureElement<HTMLButtonElement>('form[name="contacts"] .button'),
				true
			);
		}
	};
	modal.render({
		content: contacts.render(),
	});
});
