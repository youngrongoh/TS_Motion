import { BaseComponent } from '../component.js';

export class NoteComponent extends BaseComponent<HTMLElement> {
  constructor(title: string, content: string) {
    super(`<section class="note">
            <p class="note__title"></p>
            <p class="note__content"></p>
          </section>`);

    const titleElement = this.element.querySelector('.note__title') as HTMLParagraphElement;
    titleElement.textContent = title;

    const contentElement = this.element.querySelector(
      '.note__content'
    ) as HTMLParagraphElement;
    contentElement.textContent = content;
  }
}
