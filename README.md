# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Модели данных

```TypeScript
/*
 Класс модель для хранения и работы с товарами на сайте.
*/
class Product implements IProductModel {
	products: IProduct[]; // Для хранения массива товаров

	addProduct(product: IProduct): void {} // Метод для добавления товара
	deleteProduct(productId: string): void {} // Метод для удаления товара
	initializeModel(products: IProduct[]): void {} // Метод для инициализации массива товаров
}

/*
 Класс модель для хранения и работы с товарами в корзине.
*/
class BasketModel implements IBasketModel {
	products: IProduct[]; // Для хранения массива товаров

	addProduct(product: IProduct): void {} // Метод для добавления товара
	deleteProduct(productId: string): void {} // Метод для удаления товара
}
```

## Компоненты представления

```TypeScript
/*
 Родительский класс компонентов
*/
export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	// Переключить класс
	toggleClass(element: HTMLElement, className: string, force?: boolean) {}

	// Установить текстовое содержимое
	protected setText(element: HTMLElement, value: unknown) {}

	// Сменить статус блокировки
	setDisabled(element: HTMLElement, state: boolean) {}

	// Скрыть
	protected setHidden(element: HTMLElement) {}

	// Показать
	protected setVisible(element: HTMLElement) {}

	// Установить изображение с алтернативным текстом
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {}

	// Вернуть корневой DOM-элемент
	render(data?: Partial<T>): HTMLElement {}
}

/*
 Класс для отображения карточки
*/
export class Card<T> extends Component<T> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _price: HTMLButtonElement;

	constructor(protected blockName: string, container: HTMLElement) {
		super(container);
	}

	set id(value: string) {}

	get id(): string {}

	set title(value: string) {}

	get title(): string {}

	set image(value: string) {}

	set category(value: string) {}
}

/*
 Класс для отображения корзины в шапке
*/
export class BasketHeader<T> extends Component<T> {
	protected _counter: HTMLButtonElement;

	constructor(protected blockName: string, container: HTMLElement) {
		super(container);
	}

	set counter(value: number) {}

	get counter(): number {}
}
```
