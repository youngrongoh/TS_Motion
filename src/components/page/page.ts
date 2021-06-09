import { BaseComponent, Component } from '../component.js';

export interface Composable {
  addChild(child: Component): void;
}

export type OnClickListener = () => void;
export type DragState = 'start' | 'end' | 'enter' | 'leave';
export type OnDragStateListener<T extends Component> = (target: T, state: DragState) => void;

interface SectionContainer extends Component, Composable {
  setOnClickListener(listener: OnClickListener): void;
  setOnDragStateListener(listener: OnDragStateListener<SectionContainer>): void;
  muteChildren(state: 'mute' | 'unmute'): void;
  getBoundingRect(): DOMRect;
  onDropped(): void;
}

type SectionContainerConstructor = {
  new (): SectionContainer;
};

export class PageItemComponent
  extends BaseComponent<HTMLLIElement>
  implements SectionContainer
{
  private clickListener?: OnClickListener;
  private dragStateListener?: OnDragStateListener<PageItemComponent>;

  constructor() {
    super(`<li draggable="true" class="page-item">
            <section class="page-item__body"></section>
            <div class="page-item__controls">
              <button class="close">&times;</button>
            </div>
          </li>`);

    const closeBtn = this.element.querySelector('.close') as HTMLButtonElement;
    closeBtn.addEventListener('click', () => this.clickListener && this.clickListener());
    this.element.addEventListener('dragstart', (event: DragEvent) => this.onDragStart(event));
    this.element.addEventListener('dragend', (event: DragEvent) => this.onDragEnd(event));
    this.element.addEventListener('dragenter', (event: DragEvent) => this.onDragEnter(event));
    this.element.addEventListener('dragleave', (event: DragEvent) => this.onDragLeave(event));
  }

  private onDragStart(_: DragEvent) {
    this.notifyDragObservers('start');
    this.element.classList.add('lifted');
  }

  private onDragEnd(_: DragEvent) {
    this.notifyDragObservers('end');
    this.element.classList.remove('lifted');
  }

  private onDragEnter(_: DragEvent) {
    this.notifyDragObservers('enter');
    this.element.classList.add('drop-area');
  }

  private onDragLeave(_: DragEvent) {
    this.notifyDragObservers('leave');
    this.element.classList.remove('drop-area');
  }

  onDropped() {
    this.element.classList.remove('drop-area');
  }

  private notifyDragObservers(state: DragState) {
    this.dragStateListener && this.dragStateListener(this, state);
  }

  addChild(child: Component) {
    const container = this.element.querySelector('.page-item__body') as HTMLElement;
    child.attachTo(container);
  }

  setOnClickListener(listener: OnClickListener) {
    this.clickListener = listener;
  }

  setOnDragStateListener(listener: OnDragStateListener<PageItemComponent>) {
    this.dragStateListener = listener;
  }

  muteChildren(state: 'mute' | 'unmute') {
    if (state === 'mute') {
      this.element.classList.add('mute-children');
    } else {
      this.element.classList.remove('mute-children');
    }
  }

  getBoundingRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }
}

export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
  private children = new Set<SectionContainer>();
  private dragTarget?: SectionContainer;
  private dropTarget?: SectionContainer;

  constructor(private pageItemConstructor: SectionContainerConstructor) {
    super('<ul class="page"></ul>');

    this.element.addEventListener('drop', (event: DragEvent) => this.onDrop(event));
    this.element.addEventListener('dragover', (event: DragEvent) => this.onDragOver(event));
  }

  private onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  private onDrop(event: DragEvent) {
    event.preventDefault();
    if (!this.dropTarget) return;

    if (this.dragTarget && this.dragTarget !== this.dropTarget) {
      const dropY = event.clientY;
      const srcElement = this.dragTarget.getBoundingRect();
      this.dragTarget.removeFrom(this.element);
      this.dropTarget.attach(
        this.dragTarget,
        dropY > srcElement.y ? 'afterend' : 'beforebegin'
      );
    }

    this.dropTarget.onDropped();
  }

  addChild(section: Component) {
    const item = new this.pageItemConstructor();
    this.children.add(item);
    item.addChild(section);
    item.attachTo(this.element, 'beforeend');
    item.setOnClickListener(() => {
      item.removeFrom(this.element);
      this.children.delete(item);
    });

    item.setOnDragStateListener((target: SectionContainer, state: DragState) => {
      switch (state) {
        case 'start':
          this.dragTarget = target;
          this.updateSections('mute');
          break;
        case 'end':
          this.dragTarget = undefined;
          this.updateSections('unmute');
          break;
        case 'enter':
          this.dropTarget = target;
          break;
        case 'leave':
          this.dropTarget = undefined;
          break;
        default:
          throw new Error(`unknown state: ${state}`);
      }
    });
  }

  private updateSections(state: 'mute' | 'unmute') {
    this.children.forEach((section: SectionContainer) => {
      section.muteChildren(state);
    });
  }
}
