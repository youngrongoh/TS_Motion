import { BaseComponent, Component } from '../page/component.js';
import { Composable } from '../page/page.js';

type OnCloseListener = () => void;
type OnSubmitListener = () => void;

export class InputDialog extends BaseComponent<HTMLElement> implements Composable {
  private closeListener?: OnCloseListener;
  private submitListener?: OnSubmitListener;

  constructor() {
    super(`<dialog id="dialog" open>
            <div class="dialog__container">
              <button class="close">&times;</button>
              <div id="dialog__body"></div>
              <button class="dialog__submit">ADD</button>
            </div>
          </dialog>`);

    const closeBtn = this.element.querySelector('.close') as HTMLButtonElement;
    const submitBtn = this.element.querySelector('.dialog__submit') as HTMLButtonElement;

    closeBtn.addEventListener('click', () => this.closeListener && this.closeListener());
    submitBtn.addEventListener('click', () => this.submitListener && this.submitListener());
  }

  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
  }

  setOnSubmitListener(listener: OnSubmitListener) {
    this.submitListener = listener;
  }

  addChild(child: Component) {
    const body = this.element.querySelector('#dialog__body') as HTMLElement;
    child.attachTo(body);
  }
}
