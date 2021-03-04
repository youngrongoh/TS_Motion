type ItemKinds = 'video' | 'image' | 'task' | 'note';

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

type Items = {
  [K: number]: Item;
};

const buttons = <HTMLDivElement>document.querySelector('.adds');
const modal = <HTMLElement>document.querySelector('#modal');
const contentLabel = <HTMLLabelElement>modal.querySelector('.label.content');
const modalExit = <HTMLElement>document.querySelector('.exit');
const modalAdd = <HTMLButtonElement>modal.querySelector('.add');
const list = <HTMLUListElement>document.querySelector('.list');
const modalForm = <HTMLFormElement>modal.querySelector('.form-box');

const items: Items = {};

let clickedButton: ItemKinds;

type Positions = {
  [K: number]: { top: number; bottom: number };
};
const positions: Positions = {};
let moving: HTMLDivElement | null;
let timer: number;
let movable: boolean = false;
let prevX: number;
let prevY: number;
let movedX: number = 0;
let movedY: number = 0;

function createContentInput(kind: 'input' | 'textarea'): HTMLElement {
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

function showModal(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.tagName !== 'BUTTON') {
    return;
  }
  // 모달이 표시된 상태에서 다시 헤더에 있는 버튼을 클릭할 때, 그에 맞는 입력기 추가하기 위해 이미 추가됐던 입력기 삭제
  const input = contentLabel.lastChild as HTMLElement;
  if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
    modalForm.reset();
    input.remove();
  }
  // 추가할 아이템의 종류에 따라 입력기의 종류와 제목 변경
  const contentTitle = <HTMLSpanElement>contentLabel.querySelector('.name');
  const text = target.textContent?.toLowerCase() as ItemKinds;
  clickedButton = text;
  switch (text) {
    case 'video':
    case 'image':
      contentTitle.textContent = 'URL';
      contentLabel.appendChild(createContentInput('input'));
      break;
    case 'note':
    case 'task':
      contentTitle.textContent = 'Body';
      contentLabel.appendChild(createContentInput('textarea'));
      break;
    default:
      throw new Error(`invalid text: ${text}`);
  }
  modal.classList.remove('hidden');
}

function hideModal() {
  modal.classList.add('hidden');
  modalForm.reset();
  contentLabel.lastChild!.remove();
}

async function checkURL(url: string) {
  const res = await fetch(url);
  if (res.status === 200) {
    return true;
  } else {
    return false;
  }
}

// 아이템 종류에 맞는 innerHTML 반환
function getItemContents(item: Item): ItemContents {
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
}

function createItem(itemContents: ItemContents): HTMLElement {
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

function addItem(itemObj: Item) {
  const itemContents = getItemContents(itemObj);
  const item = createItem(itemContents);
  list.appendChild(item);
  const top = item.getBoundingClientRect().top;
  const bottom = item.getBoundingClientRect().bottom;
  positions[Object.keys(positions).length] = { top, bottom };
  console.log(positions);
}

async function onModalAddClick(event: MouseEvent) {
  event.preventDefault();

  const text = (modalForm[0] as HTMLInputElement).value;
  const content = (modalForm[1] as HTMLInputElement | HTMLTextAreaElement)
    .value;

  if (text === '' || content === '') {
    alert('내용을 입력해주세요');
    return;
  }
  if (
    (clickedButton === 'video' || clickedButton === 'image') &&
    !(await checkURL(content))
  ) {
    alert('URL을 다시 입력해주세요');
    return;
  }

  const item: Item = {
    id: Date.now(),
    kind: clickedButton,
    text,
    content,
  };
  addItem(item);
  hideModal();
  items[item.id] = item;
  saveItems(items);
}

function saveItems(items: Items) {
  localStorage.setItem('items', JSON.stringify(items));
}

function createSpaceBox(): HTMLDivElement {
  const box = document.createElement('div');
  box.classList.add('box');
  return box;
}

buttons.addEventListener('click', showModal);

modalExit.addEventListener('click', (event: MouseEvent) => {
  event.preventDefault();
  hideModal();
});

modalAdd.addEventListener('click', onModalAddClick);

window.addEventListener('load', () => {
  const stored = localStorage.getItem('items');
  if (!stored) {
    return;
  }
  const parsed = JSON.parse(stored);
  Object.keys(parsed).forEach((key) => {
    addItem(parsed[key]);
  });
  Object.assign(items, parsed);
});

list.addEventListener('click', (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.matches('.delete')) {
    return;
  }
  const item = target.parentElement!;
  const id = Number(item.dataset.id);
  item.remove();
  delete items[id];
  saveItems(items);
});

list.addEventListener('mousedown', (event: MouseEvent) => {
  const target = (event.target as HTMLElement).closest('div.container');
  if (!target) {
    return;
  }
  let t = 0;
  timer = setInterval(() => {
    if (t > 3) {
      const li = target.parentNode as HTMLLIElement;
      li.appendChild(createSpaceBox());
      li.classList.add('move');
      target.classList.add('move');
      prevX = event.clientX;
      prevY = event.clientY;
      moving = target as HTMLDivElement;
      movable = true;
      clearInterval(timer);
    }
    t += 1;
  }, 100);
});

list.addEventListener('mousemove', (event: MouseEvent) => {
  if (!movable) return;
  const currX = event.clientX;
  const currY = event.clientY;
  const moveX = currX - prevX;
  const moveY = currY - prevY;
  prevX = currX;
  prevY = currY;
  requestAnimationFrame(() => {
    if (!moving) return;
    movedX += moveX;
    movedY += moveY;
    moving.style.transform = `
    translate(${movedX}px, ${movedY}px)`;
  });
});

window.addEventListener('mouseup', () => {
  clearInterval(timer);
  movable = false;
  if (moving) {
    const li = moving.parentNode as HTMLLIElement;
    li.lastChild!.remove();
    li.classList.remove('move');
    moving.classList.remove('move');
    moving.style.transform = '';
    movedX = 0;
    movedY = 0;
    moving = null;
  }
});
