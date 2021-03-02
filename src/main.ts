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

function onButtonClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.tagName !== 'BUTTON') {
    return;
  }
  const input = contentLabel.lastChild as HTMLElement;
  if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
    input.remove();
  }
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

function exitModal() {
  modal.classList.add('hidden');
  modalForm.reset();
  contentLabel.lastChild!.remove();
}

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

  if (text === undefined || content === undefined) {
    alert('내용을 입력해주세요');
    return;
  }
  const itemContents = getItemContents(clickedButton, text, content);
  const item = createItem(itemContents);
  list.appendChild(item);
  exitModal();
}

buttons.addEventListener('click', onButtonClick);
modalExit.addEventListener('click', (event: MouseEvent) => {
  event.preventDefault();
  exitModal();
});
modalAdd.addEventListener('click', addItem);
