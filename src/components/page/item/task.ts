import { BaseComponent } from '../component.js';

export class TaskComponent extends BaseComponent<HTMLElement> {
  constructor(title: string, content: string) {
    super(`<section class="task">
            <p class="task__title"></p>
            <input type="checkbox" class="task__check">
            <label class="task__content"></label>
          </section>`);

    const titleElement = this.element.querySelector('.task__title') as HTMLParagraphElement;
    titleElement.textContent = title;

    const checkboxElement = this.element.querySelector('.task__check') as HTMLInputElement;
    checkboxElement.id = `check__${content}`;

    const contentElement = this.element.querySelector('.task__content') as HTMLLabelElement;
    contentElement.textContent = content;
    contentElement.htmlFor = checkboxElement.id;
  }
}
