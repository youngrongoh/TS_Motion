import { BaseComponent } from './base.js';

export class PageComponent extends BaseComponent {
  constructor() {
    const stringTeamplate = `<ul class="page">페이지 컴포넌트가 추가되었습니다.</ul>`;

    super(stringTeamplate);
  }
}
