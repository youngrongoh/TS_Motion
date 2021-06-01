import { BaseComponent, Component } from './component.js';

export interface Composable {
  addChild(child: Component): void;
}

export class PageItemComponent extends BaseComponent<HTMLElement> implements Composable {
  constructor() {
    super(`<li class="page-item">
            <section class="page-tem__body">
              <div class="page-item__controls">
                <button class="close">&times;</button>
              </div>
            </section>
          </li>`);
  }

  addChild(child: Component) {
    const container = this.element.querySelector('.page-item__controls') as HTMLElement;
    child.attachTo(container);
  }
}
export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
  constructor() {
    super(`<ul class="page">This is PageComponent</ul>`);
  }

  addChild(section: Component) {
    const item = new PageItemComponent();
    item.addChild(section);
    item.attachTo(this.element, 'beforeend');
  }
}
