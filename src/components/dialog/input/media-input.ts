import { BaseComponent } from '../../page/component.js';

export class MediaSectionInput extends BaseComponent<HTMLElement> {
  constructor() {
    super(`<div>
            <div class="form__container">
              <label for="title" class="form__label">Title</label>
              <input type="text" id="title">
            </div>
            <div class="form__container">
              <label for="url" id="label-content" class="form__label">URL</label>
              <input type="text" id="url">
            </div>
          </div>`);
  }
  get title(): string {
    const element = this.element.querySelector('#title') as HTMLInputElement;
    return element.value;
  }

  get url(): string {
    const element = this.element.querySelector('#url') as HTMLInputElement;
    return element.value;
  } 
}