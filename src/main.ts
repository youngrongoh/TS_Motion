type ItemKinds = 'video' | 'image' | 'task' | 'note';

type ItemStructure = 'lr' | 'tb';

type ItemContents = {
  text: string;
  content: string;
  structure: ItemStructure;
};

const buttons = <HTMLDivElement>document.querySelector('.adds');
const modal = <HTMLElement>document.querySelector('#modal');
const contentLabel = <HTMLLabelElement>modal.querySelector('.label.content');
const modalExit = <HTMLElement>document.querySelector('.exit');
const modalAdd = <HTMLButtonElement>modal.querySelector('.add');
const list = <HTMLUListElement>document.querySelector('.list');
const modalForm = <HTMLFormElement>modal.querySelector('.form-box');

let clickedButton: ItemKinds;

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

// 아이템 종류에 맞는 innerHTML 반환
function getItemContents(
  kind: ItemKinds,
  text: string,
  content: string
): ItemContents {
  let structure: ItemStructure;
  switch (kind) {
    case 'video':
      content = `
        <iframe class="media" src="${content}" frameborder="0"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>`;
      structure = 'lr';
      break;
    case 'image':
      content = `<img class="media" src="${content}">`;
      structure = 'lr';
      break;
    case 'task':
      content = `
        <label class="todo" for="todo">
          <input type="checkbox" id="todo">
          <span class="text">${content}</span>
        </label>`;
      structure = 'tb';
      break;
    case 'note':
      content = `<p class="text">${content}</p>`;
      structure = 'tb';
      break;
    default:
      throw new Error(`invalid kind of item: ${kind}`);
  }
  return {
    text,
    content,
    structure,
  };
}

function createItem(itemContents: ItemContents): HTMLElement {
  const item = document.createElement('li');
  // 아이템 종류에 따라 구조 변경 및 입력 받은 내용 삽입
  item.setAttribute('class', `item ${itemContents.structure}`);
  if (itemContents.structure === 'lr') {
    item.innerHTML = `
    <div class="content">
    ${itemContents.content}
    </div>
    <p class="text">${itemContents.text}</p>
    <button class="delete">❌</button>`;
  } else {
    item.innerHTML = `
      <h2 class="title">${itemContents.text}</h2>
      <div class="content">
        ${itemContents.content}
      </div>`;
  }
  return item;
}

function addItem(event: MouseEvent) {
  event.preventDefault();

  const text = (modalForm[0] as HTMLInputElement).value;
  const content = (modalForm[1] as HTMLInputElement | HTMLTextAreaElement)
    .value;

  if (text === '' || content === '') {
    alert('내용을 입력해주세요');
    return;
  }
  const itemContents = getItemContents(clickedButton, text, content);
  const item = createItem(itemContents);
  list.appendChild(item);
  hideModal();
}

buttons.addEventListener('click', showModal);
modalExit.addEventListener('click', (event: MouseEvent) => {
  event.preventDefault();
  hideModal();
});
modalAdd.addEventListener('click', addItem);
