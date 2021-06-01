import { BaseComponent, Component } from './component.js';

export interface Composable {
  addChild(child: Component): void;
}
export class PageItemComponent extends BaseComponent<HTMLLIElement> implements Composable {
  constructor() {
    super(`<li class="page-item">
            <section class="page-item__container"></section>
            <button class="page-item__close">&times;</button>
          </li>`);
  }

  addChild(child: Component) {
    const container = this.element.querySelector('.page-item__container') as HTMLElement;
    child.attachTo(container);
  }
}

export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
  constructor() {
    super('<ul class="page">페이지 컴포넌트가 추가되었습니다.</ul>');
  }

  addChild(section: Component) {
    const container = new PageItemComponent();
    container.addChild(section);
    container.attachTo(this.element, 'beforeend');
  }
}
