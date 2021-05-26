export class ImageComponent {
  private element: HTMLDivElement;
  constructor(title: string, imageURL: string) {
    this.element = document.createElement('div');
    this.element.setAttribute('class', 'image');
    this.element.innerHTML = `
      <img class="image__image" src="${imageURL}" alt="${title}">
      </img>
      <p class="image__title">${title}<p>
    `;
  }

  attachTo(target: HTMLElement, position: InsertPosition = 'afterbegin') {
    target.insertAdjacentElement(position, this.element);
  }
}
