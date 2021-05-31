export class BaseComponent {
  public element: HTMLElement;

  constructor(stringTeamplate: string) {
    const template = document.createElement('template');
    template.innerHTML = stringTeamplate;

    this.element = template.content.firstElementChild as HTMLElement;
  }

  attachTo = (target: HTMLElement, position: InsertPosition = 'afterbegin') => {
    target.insertAdjacentElement(position, this.element);
  };
}
