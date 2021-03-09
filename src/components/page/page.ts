import { BaseComponent } from './../component.js';

export class PageComponent extends BaseComponent<HTMLUListElement> {
  constructor() {
    super('<ul class="page">this is PageComponent</ul>');
  }
}
