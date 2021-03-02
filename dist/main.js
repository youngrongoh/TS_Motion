"use strict";
const buttons = document.querySelector('.adds');
const modal = document.querySelector('#modal');
const contentLabel = modal.querySelector('.label.content');
const modalExit = document.querySelector('.exit');
const modalAdd = modal.querySelector('.add');
const list = document.querySelector('.list');
const modalForm = modal.querySelector('.form-box');
let clickedButton;
function createContentInput(kind) {
    let input;
    if (kind === 'input') {
        input = document.createElement('input');
        input.setAttribute('class', 'input');
        input.setAttribute('id', 'content');
        input.setAttribute('type', 'text');
    }
    else {
        input = document.createElement('textarea');
        input.setAttribute('class', 'input');
        input.setAttribute('id', 'content');
    }
    return input;
}
function showModal(event) {
    var _a;
    const target = event.target;
    if (target.tagName !== 'BUTTON') {
        return;
    }
    const input = contentLabel.lastChild;
    if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
        input.remove();
    }
    const contentTitle = contentLabel.querySelector('.name');
    const text = (_a = target.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase();
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
    contentLabel.lastChild.remove();
}
function getItemContents(kind, text, content) {
    let structure;
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
function createItem(itemContents) {
    const item = document.createElement('li');
    item.setAttribute('class', `item ${itemContents.structure}`);
    if (itemContents.structure === 'lr') {
        item.innerHTML = `
    <div class="content">
    ${itemContents.content}
    </div>
    <p class="text">${itemContents.text}</p>
    <button class="delete">❌</button>`;
    }
    else {
        item.innerHTML = `
      <h2 class="title">${itemContents.text}</h2>
      <div class="content">
        ${itemContents.content}
      </div>`;
    }
    return item;
}
function addItem(event) {
    event.preventDefault();
    const text = modalForm[0].value;
    const content = modalForm[1]
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
modalExit.addEventListener('click', (event) => {
    event.preventDefault();
    hideModal();
});
modalAdd.addEventListener('click', addItem);
