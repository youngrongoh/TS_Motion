import { BaseComponent } from './component.js';

export class PageComponent extends BaseComponent<HTMLUListElement> {
  constructor() {
    super('<ul class="page">페이지 컴포넌트가 추가되었습니다.</ul>');
  }
}
