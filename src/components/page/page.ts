import { BaseComponent, Component } from './component.js';

export interface Composable {
  addChild(child: Component): void;
}

type OnClickListener = () => void;
export class PageItemComponent extends BaseComponent<HTMLLIElement> implements Composable {
  private onClickListener?: OnClickListener;

  constructor() {
    super(`<li class="page-item">
            <section class="page-item__container"></section>
            <button class="page-item__close">&times;</button>
          </li>`);

    const closeBtn = this.element.querySelector('.page-item__close') as HTMLButtonElement;
    closeBtn.addEventListener('click', () => this.onClickListener && this.onClickListener());
  }

  addChild(child: Component) {
    const container = this.element.querySelector('.page-item__container') as HTMLElement;
    child.attachTo(container);
  }

  setOnClickListener(listener: OnClickListener) {
    this.onClickListener = listener;
  }
}

export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
  constructor() {
    super('<ul class="page">페이지 컴포넌트가 추가되었습니다.</ul>');
  }

  addChild(section: Component) {
    const item = new PageItemComponent();
    item.addChild(section);
    item.attachTo(this.element, 'beforeend');
    item.setOnClickListener(() => item.removeFrom(this.element));
  }
}
