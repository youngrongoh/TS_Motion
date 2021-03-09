type ItemStructure = 'lr' | 'tb';

type ItemContents = {
  id: number;
  text: string;
  content: string;
  structure: ItemStructure;
};

type Item = {
  id: number;
  kind: ItemKinds;
  text: string;
  content: string;
};

type ItemKinds = 'video' | 'image' | 'task' | 'note';

type Items = {
  [K: number]: Item;
};

type Positions = number[];

interface ItemDragger {
  setItemsSave(saveItems: Function): void;
}

export default class ItemDraggerImpl implements ItemDragger {
  private list: HTMLUListElement;
  private box: HTMLDivElement;
  private moving: HTMLDivElement | null = null;

  private items: Items;
  private positions: Positions = [];

  private timer: number = 0;
  private movable: boolean = false;
  private looper: boolean = false;

  private prevX: number = 0;
  private prevY: number = 0;
  private positionX: number = 0;
  private positionY: number = 0;

  private saveItems: Function = () => {};

  constructor(items: Items) {
    this.items = items;
    this.list = <HTMLUListElement>document.querySelector('.list');
    this.box = this.createSpaceBox();

    this.list.addEventListener('click', this.onDeleteClick);

    this.list.addEventListener('mousedown', this.onMouseDown);

    this.list.addEventListener('mousemove', this.onMouseMove);

    window.addEventListener('mouseup', this.onMouseUp);
  }

  setItemsSave = (saveItems: Function) => {
    this.saveItems = saveItems;
  };

  onDeleteClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.matches('.delete')) {
      return;
    }
    const item = target.closest('li')!;
    const id = Number(item.dataset.id);
    item.remove();
    delete this.items[id];
    this.saveItems(this.items);
  };

  addItem = (itemObj: Item) => {
    const itemContents = this.getItemContents(itemObj);
    const item = this.createItem(itemContents);
    this.list.appendChild(item);
  };

  private createSpaceBox(): HTMLDivElement {
    const box = document.createElement('div');
    box.classList.add('box');
    return box;
  }

  private onMouseDown = (event: MouseEvent) => {
    const target = (event.target as HTMLElement).closest('div.container');
    if (!target) {
      return;
    }
    let t = 0;
    // 300ms 이상 아이템을 누르고 있으면 아이템 드래그 활성화
    this.timer = setInterval(() => {
      if (t > 3) {
        const li = target.closest('li') as HTMLLIElement;
        li.appendChild(this.box);
        li.classList.add('shrink');
        target.classList.add('move');
        this.moving = target as HTMLDivElement;
        this.prevX = event.clientX;
        this.prevY = event.clientY;
        this.movable = true;
        this.looper = true;
        clearInterval(this.timer);
      }
      t += 1;
    }, 100);
  };

  private onMouseMove = (event: MouseEvent) => {
    if (!this.movable) return;
    // 아이템의 트랜지션 시간(500ms) 동안 position 업데이트
    if (this.looper) {
      this.updatePositions();
      setTimeout(() => (this.looper = false), 500);
    }
    // 마우스 위치에 따라 아이템 위치 변경
    const currX = event.clientX;
    const currY = event.clientY;
    requestAnimationFrame(() => {
      if (!this.moving) return;
      const moveX = currX - this.prevX;
      const moveY = currY - this.prevY;
      this.positionX += moveX;
      this.positionY += moveY;
      this.moving.style.transform = `
      translate(${this.positionX}px, ${this.positionY}px)`;
      this.prevX = currX;
      this.prevY = currY;
    });
  };

  private onMouseUp = (event: MouseEvent) => {
    clearInterval(this.timer);
    this.movable = false;
    if (this.moving) {
      const li = this.moving.closest('li') as HTMLLIElement;
      const order = this.getOrderNum(event.clientY);
      this.changeItemPos(li, order);
      li.classList.remove('shrink');
      this.moving.classList.remove('move');
      this.moving.style.transform = '';
      this.positionX = 0;
      this.positionY = 0;
      this.moving = null;
    }
  };

  // 종류에 따라 아이템의 DOM 엘리먼트 생성에 필요한 정보 반환
  private getItemContents = (item: Item): ItemContents => {
    let structure: ItemStructure;
    let content: string;
    switch (item.kind) {
      case 'video':
        content = `
        <iframe class="media" src="${item.content}" frameborder="0"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>`;
        structure = 'lr';
        break;
      case 'image':
        content = `<img class="media" src="${item.content}">`;
        structure = 'lr';
        break;
      case 'task':
        content = `
        <label class="todo" for="todo">
          <input type="checkbox" id="todo">
          <span class="text">${item.content}</span>
        </label>`;
        structure = 'tb';
        break;
      case 'note':
        content = `<p class="text">${item.content}</p>`;
        structure = 'tb';
        break;
      default:
        throw new Error(`invalid kind of item: ${item.kind}`);
    }
    return {
      id: item.id,
      text: item.text,
      content,
      structure,
    };
  };

  private createItem(itemContents: ItemContents): HTMLLIElement {
    const item = document.createElement('li');
    // 아이템 종류에 따라 구조 변경 및 입력 받은 내용 삽입
    item.setAttribute('class', `item ${itemContents.structure}`);
    item.setAttribute('data-id', `${itemContents.id}`);
    if (itemContents.structure === 'lr') {
      item.innerHTML = `
      <div class="container">
        <div class="content">
        ${itemContents.content}
        </div>
        <p class="text">${itemContents.text}</p>
        <button class="delete">❌</button>
      </div>`;
    } else {
      item.innerHTML = `
      <div class="container">
        <h2 class="title">${itemContents.text}</h2>
        <div class="content">
          ${itemContents.content}
        </div>
        <button class="delete">❌</button>
      </div>`;
    }
    return item;
  }

  private updatePositions() {
    const lis = Array.from(this.list.querySelectorAll('li'));
    lis.forEach((li: HTMLLIElement, i) => {
      const top = li.getBoundingClientRect().top;
      this.positions[i] = top;
    });
  }

  private changeItemPos(item: HTMLElement, index: number) {
    const lis = this.list.children;
    const itemIdx: number = Array.from(lis).findIndex(
      (child) => child === item
    );
    const target = lis[index];
    if (index === itemIdx) {
      return;
    }
    this.list.removeChild(item);
    if (itemIdx < index) {
      target?.after(item);
    } else {
      target?.before(item);
    }
  }

  private getOrderNum(y: number): number {
    let result: string;
    this.positions.forEach((pos, i, arr) => {
      if (result) {
        return;
      }
      if (y < pos) {
        result = i.toString();
        return;
      } else if (i === arr.length - 1 && y >= pos) {
        result = i.toString();
        return;
      } else if (y < arr[i + 1]!) {
        result = i.toString();
        return;
      }
    });
    return Number(result!);
  }
}
