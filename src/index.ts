import { Page } from './components/Page';
import { Api, ApiListResponse } from './components/base/api';
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
import { Success } from './components/Success';

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
const successTemplate = ensureElement<HTMLTemplateElement>('#success')

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
    onClick: () => {
      events.emit('basket:order')
    },
  });
  const basketItems = appData.basket.map((item, index) => {
    const storeItem = new StoreItemBasket(
      'card',
      cloneTemplate(cardBasketTemplate),
      {
        onClick: () => { },
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
      if (order.isFilled) {
        appData.order.total = appData.getTotalBasketPrice()
        appData.setItems();
        events.emit('order:contacts');
      }
    },
    onClickCash: () => {
      order.toggleCashButton();
      appData.order.payment = 'cash'
      checkForm();
    },
    onClickCard: () => {
      order.toggleCardButton();
      appData.order.payment = 'card'
      checkForm();
    },
    onInput: () => {
      appData.order.address = order.address;
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
      appData.order.phone = contacts.phone;
      checkForm();
    },
    onEmailInput: () => {
      appData.order.email = contacts.email;
      checkForm();
    },
    onClickNext: () => {
      api.post('/order', appData.order).then((res) => {
        events.emit('order:success', res)
        appData.clearBasket()
        page.counter = 0;
      }).catch((err) => {
        console.error(err);
      });
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

events.on('order:success', (res: ApiListResponse<string>) => {
  const success = new Success('order-success', cloneTemplate(successTemplate), {
    onClick: () => {
      events.emit('modal:close')
      modal.close()
    }
  })
  modal.render({
    content: success.render({
      description: res.total
    })
  })
})
