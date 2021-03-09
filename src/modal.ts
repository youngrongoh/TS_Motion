type ItemKinds = 'video' | 'image' | 'task' | 'note';

type Item = {
  id: number;
  kind: ItemKinds;
  text: string;
  content: string;
};

type Items = {
  [K: number]: Item;
};

interface Modal {
  setItemAdd(addItem: Function): void;
  setItemsSave(saveItems: Function): void;
}

export default class ModalImpl implements Modal {
  private buttons: HTMLDivElement;
  private modal: HTMLElement;
  private contentLabel: HTMLLabelElement;
  private modalExit: HTMLElement;
  private modalAdd: HTMLButtonElement;
  private modalForm: HTMLFormElement;
  private clickedButton: ItemKinds = 'video';
  private items: Items;
  private addItem: Function = () => {};
  private saveItems: Function = () => {};

  constructor(items: Items) {
    this.items = items;
    this.buttons = <HTMLDivElement>document.querySelector('.adds');
    this.modal = <HTMLElement>document.querySelector('#modal');
    this.modalExit = <HTMLElement>document.querySelector('.exit');
    this.contentLabel = <HTMLLabelElement>(
      this.modal.querySelector('.label.content')
    );
    this.modalAdd = <HTMLButtonElement>this.modal.querySelector('.add');
    this.modalForm = <HTMLFormElement>this.modal.querySelector('.form-box');

    this.buttons.addEventListener('click', this.showModal);

    this.modalExit.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      this.hideModal();
    });

    this.modalAdd.addEventListener('click', this.onModalAddClick);
  }

  setItemAdd = (addItem: Function) => {
    this.addItem = addItem;
  };

  setItemsSave = (saveItems: Function) => {
    this.saveItems = saveItems;
  };

  private showModal = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    console.log(target);
    if (target.tagName !== 'BUTTON') {
      return;
    }
    // 모달이 표시된 상태에서 다시 헤더에 있는 버튼을 클릭할 때, 그에 맞는 입력기 추가하기 위해 이미 추가됐던 입력기 삭제
    const input = this.contentLabel.lastChild as HTMLElement;
    if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
      this.modalForm.reset();
      input.remove();
    }
    // 추가할 아이템의 종류에 따라 입력기의 종류와 제목 변경
    const contentTitle = <HTMLSpanElement>(
      this.contentLabel.querySelector('.name')
    );
    const text = target.textContent?.toLowerCase() as ItemKinds;
    this.clickedButton = text;
    switch (text) {
      case 'video':
      case 'image':
        contentTitle.textContent = 'URL';
        this.contentLabel.appendChild(this.createContentInput('input'));
        break;
      case 'note':
      case 'task':
        contentTitle.textContent = 'Body';
        this.contentLabel.appendChild(this.createContentInput('textarea'));
        break;
      default:
        throw new Error(`invalid text: ${text}`);
    }
    this.modal.classList.remove('hidden');
  };

  private hideModal() {
    this.modal.classList.add('hidden');
    this.modalForm.reset();
    this.contentLabel.lastChild!.remove();
  }

  private checkURL = async (url: string) => {
    const res = await fetch(url);
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  };

  private onModalAddClick = async (event: MouseEvent) => {
    event.preventDefault();

    const text = (this.modalForm[0] as HTMLInputElement).value;
    const content = (this.modalForm[1] as
      | HTMLInputElement
      | HTMLTextAreaElement).value;

    // 입력 내용 유효성 검사
    if (text === '' || content === '') {
      alert('내용을 입력해주세요');
      return;
    }
    if (
      (this.clickedButton === 'video' || this.clickedButton === 'image') &&
      !(await this.checkURL(content))
    ) {
      alert('URL을 다시 입력해주세요');
      return;
    }

    const item: Item = {
      id: Date.now(),
      kind: this.clickedButton,
      text,
      content,
    };
    this.addItem(item);
    this.hideModal();
    this.items[item.id] = item;
    this.saveItems(this.items);
  };

  private createContentInput(kind: 'input' | 'textarea'): HTMLElement {
    let input: HTMLElement;
    if (kind === 'input') {
      input = document.createElement('input');
      input.setAttribute('class', 'input');
      input.setAttribute('id', 'content');
      input.setAttribute('type', 'text');
    } else {
      input = document.createElement('textarea');
      input.setAttribute('class', 'input');
      input.setAttribute('id', 'content');
    }
    return input;
  }
}
