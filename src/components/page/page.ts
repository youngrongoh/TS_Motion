import { BaseComponent, Component } from '../component.js';

export interface Composable {
  addChild(child: Component): void;
}

export type OnClickListener = () => void;

interface SectionContainer extends Component, Composable {
  setOnClickListener(listener: OnClickListener): void;
}

type SectionContainerConstructor = {
  new (): SectionContainer;
};
export class PageItemComponent
  extends BaseComponent<HTMLLIElement>
  implements SectionContainer
{
  private onClickListener?: OnClickListener;

  constructor() {
    super(`<li class="page-item">
            <section class="page-item__body"></section>
            <div class="page-item__controls">
              <button class="close">&times;</button>
            </div>
          </li>`);

    const closeBtn = this.element.querySelector('.close') as HTMLButtonElement;
    closeBtn.addEventListener('click', () => this.onClickListener && this.onClickListener());
  }

  addChild(child: Component) {
    const container = this.element.querySelector('.page-item__body') as HTMLElement;
    child.attachTo(container);
  }

  setOnClickListener(listener: OnClickListener) {
    this.onClickListener = listener;
  }
}

export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
  constructor(private pageItemConstructor: SectionContainerConstructor) {
    super('<ul class="page"></ul>');
  }

  addChild(section: Component) {
    const item = new this.pageItemConstructor();
    item.addChild(section);
    item.attachTo(this.element, 'beforeend');
    item.setOnClickListener(() => item.removeFrom(this.element));
  }
}
