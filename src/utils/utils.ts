import { Contacts } from "../components/Contacts";
import { Order } from "../components/Order";

export type SelectorCollection<T> = string | NodeListOf<Element> | T[];
export type SelectorElement<T> = T | string;

export function isSelector(x: any): x is string {
  return typeof x === 'string' && x.length > 1;
}

export function ensureAllElements<T extends HTMLElement>(
  selectorElement: SelectorCollection<T>,
  context: HTMLElement = document as unknown as HTMLElement
): T[] {
  if (isSelector(selectorElement)) {
    return Array.from(context.querySelectorAll(selectorElement)) as T[];
  }
  if (selectorElement instanceof NodeList) {
    return Array.from(selectorElement) as T[];
  }
  if (Array.isArray(selectorElement)) {
    return selectorElement;
  }
  throw new Error(`Unknown selector element`);
}

export function ensureElement<T extends HTMLElement>(
  selectorElement: SelectorElement<T>,
  context?: HTMLElement
): T {
  if (isSelector(selectorElement)) {
    const elements = ensureAllElements<T>(selectorElement, context);
    if (elements.length > 1) {
      console.warn(`selector ${selectorElement} return more then one element`);
    }
    if (elements.length === 0) {
      throw new Error(`selector ${selectorElement} return nothing`);
    }
    return elements.pop() as T;
  }
  if (selectorElement instanceof HTMLElement) {
    return selectorElement as T;
  }
  throw new Error('Unknown selector element');
}

export function cloneTemplate<T extends HTMLElement>(
  query: string | HTMLTemplateElement
): T {
  const template = ensureElement(query) as HTMLTemplateElement;
  return template.content.firstElementChild.cloneNode(true) as T;
}

export function handlePrice(price: number): string {
  const priceStr = price.toString();
  return priceStr.length < 5
    ? priceStr
    : priceStr
      .split('')
      .reverse()
      .map((s, i) => ((i + 1) % 3 === 0 ? ' ' + s : s))
      .reverse()
      .join('');
}
