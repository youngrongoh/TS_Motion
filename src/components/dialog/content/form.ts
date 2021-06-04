import { BaseComponent } from '../../page/component.js';

export class DialogForm extends BaseComponent<HTMLFormElement> {
  constructor(type: 'media' | 'text') {
    super(`<form class="form">
            <label for="input-title" class="form__label">Title</label>
            <input name="title" type="text" id="input-title">
            <label for="input-content" id="label-content" class="form__label"></label>
            <textarea name="content" id="input-content"></textarea>
          </form>`);

    
    const content = this.element.querySelector('#label-content') as HTMLLabelElement;
    content.textContent = type === 'media' ? 'URL' : 'Body';
  }

  getData(): string[] {
    const form = new FormData(this.element);
    const [title, content] = [form.get('title'), form.get('content')];

    return [String(title)!, String(content)!];
  }
}