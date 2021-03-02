const buttons = <HTMLDivElement>document.querySelector('.adds');
const modal = <HTMLElement>document.querySelector('#modal');
const contentLabel = <HTMLLabelElement>modal.querySelector('.label.content');
const modalExit = <HTMLElement>document.querySelector('.exit');

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
  const contentTitle = <HTMLSpanElement>contentLabel.querySelector('.name');
  const text = target.textContent?.toLowerCase();
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

buttons.addEventListener('click', onButtonClick);
modalExit.addEventListener('click', (event: MouseEvent) => {
  event.preventDefault();
  modal.classList.add('hidden');
  contentLabel.lastChild!.remove();
});
