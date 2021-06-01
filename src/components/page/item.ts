import { BaseComponent } from './component.js';

export class PageItemComponent extends BaseComponent<HTMLLIElement> {
  constructor() {
    super(`<li class="item">
            <div class="item__container"></div>
            <button class=""item__close">❌</button>
          </li>`);
  }

  append<T extends BaseComponent<HTMLElement>>(component: T) {
    const container = this.element.querySelector('.item__container') as HTMLDivElement;
    component.attachTo(container);
    return this;
  }
}
