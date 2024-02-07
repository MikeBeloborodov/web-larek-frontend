/**
 * Базовый компонент
 */
export abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) { }

  // Переключить класс
  toggleClass(element: HTMLElement, className: string, force?: boolean): void {
    element.classList.toggle(className, force);
  }

  // Установить текстовое содержимое
  protected setText(element: HTMLElement, value: string): void {
    element.textContent = String(value);
  }

  // Сменить статус блокировки
  setDisabled(element: HTMLElement, state: boolean): void {
    if (state) element.setAttribute('disabled', 'disabled');
    else element.removeAttribute('disabled');
  }

  // Скрыть
  protected setHidden(element: HTMLElement): void {
    element.style.display = 'none';
  }

  // Показать
  protected setVisible(element: HTMLElement): void {
    element.style.removeProperty('display');
  }

  // Установить изображение с алтернативным текстом
  protected setImage(el: HTMLImageElement, src: string, alt?: string): void {
    el.src = src;
    if (alt) {
      el.alt = alt;
    }
  }

  // Вернуть корневой DOM-элемент
  render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data ?? {});
    return this.container;
  }
}
