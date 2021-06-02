import { BaseComponent, Component } from './component.js';
import { Composable, OnClickListener } from './page.js';

export class Dialog extends BaseComponent<HTMLElement> implements Composable {
  private onClickListener?: OnClickListener;

  constructor() {
    super(`<section id="modal">
            <button class="modal__add">add</button>
            <button class="modal__close">&times;</button>
          </section>`);

    const closeBtn = this.element.querySelector('.modal__close') as HTMLButtonElement;
    closeBtn.addEventListener('click', () => this.onClickListener && this.onClickListener());
  }

  addChild(child: Component) {
    child.attachTo(this.element);
  }

  setOnClickListener(listener: OnClickListener) {
    this.onClickListener = listener;
  }
}
