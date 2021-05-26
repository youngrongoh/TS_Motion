export class PageComponent {
  private readonly element: HTMLUListElement;
  constructor() {
    this.element = document.createElement('ul');
    this.element.setAttribute('class', 'page');
    this.element.textContent = '페이지 컴포넌트가 추가되었습니다.';
  }

  attachTo(target: HTMLElement, position: InsertPosition = 'afterbegin') {
    target.insertAdjacentElement(position, this.element);
  }
}
