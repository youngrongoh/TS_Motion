"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const buttons = document.querySelector('.adds');
const modal = document.querySelector('#modal');
const contentLabel = modal.querySelector('.label.content');
const modalExit = document.querySelector('.exit');
const modalAdd = modal.querySelector('.add');
const list = document.querySelector('.list');
const modalForm = modal.querySelector('.form-box');
const items = {};
let clickedButton;
const positions = [];
let moving;
let timer;
let movable = false;
let looper = false;
let prevX;
let prevY;
let positionX = 0;
let positionY = 0;
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
        modalForm.reset();
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
function checkURL(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(url);
        if (res.status === 200) {
            return true;
        }
        else {
            return false;
        }
    });
}
function getItemContents(item) {
    let structure;
    let content;
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
function createItem(itemContents) {
    const item = document.createElement('li');
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
    }
    else {
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
function addItem(itemObj) {
    const itemContents = getItemContents(itemObj);
    const item = createItem(itemContents);
    list.appendChild(item);
}
function onModalAddClick(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const text = modalForm[0].value;
        const content = modalForm[1]
            .value;
        if (text === '' || content === '') {
            alert('내용을 입력해주세요');
            return;
        }
        if ((clickedButton === 'video' || clickedButton === 'image') &&
            !(yield checkURL(content))) {
            alert('URL을 다시 입력해주세요');
            return;
        }
        const item = {
            id: Date.now(),
            kind: clickedButton,
            text,
            content,
        };
        addItem(item);
        hideModal();
        items[item.id] = item;
        saveItems(items);
    });
}
function saveItems(items) {
    localStorage.setItem('items', JSON.stringify(items));
}
function createSpaceBox() {
    const box = document.createElement('div');
    box.classList.add('box');
    return box;
}
buttons.addEventListener('click', showModal);
modalExit.addEventListener('click', (event) => {
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
list.addEventListener('click', (event) => {
    const target = event.target;
    if (!target.matches('.delete')) {
        return;
    }
    const item = target.closest('li');
    const id = Number(item.dataset.id);
    item.remove();
    delete items[id];
    saveItems(items);
});
list.addEventListener('mousedown', (event) => {
    const target = event.target.closest('div.container');
    if (!target) {
        return;
    }
    let t = 0;
    timer = setInterval(() => {
        if (t > 3) {
            const li = target.parentNode;
            li.appendChild(createSpaceBox());
            li.classList.add('move');
            target.classList.add('move');
            prevX = event.clientX;
            prevY = event.clientY;
            moving = target;
            movable = true;
            looper = true;
            clearInterval(timer);
        }
        t += 1;
    }, 100);
});
function getOrderNum(y) {
    let result;
    positions.forEach((pos, i, arr) => {
        if (result) {
            return;
        }
        if (y < pos) {
            result = i.toString();
            return;
        }
        else if (i === arr.length - 1 && y >= pos) {
            result = i.toString();
            return;
        }
        else if (y < arr[i + 1]) {
            result = i.toString();
            return;
        }
    });
    return Number(result);
}
function updatePositions() {
    const lis = Array.from(list.querySelectorAll('li'));
    lis.forEach((li, i) => {
        const top = li.getBoundingClientRect().top;
        positions[i] = top;
    });
}
list.addEventListener('mousemove', (event) => {
    if (!movable)
        return;
    const currX = event.clientX;
    const currY = event.clientY;
    if (looper) {
        updatePositions();
        setTimeout(() => (looper = false), 500);
    }
    requestAnimationFrame(() => {
        if (!moving)
            return;
        const moveX = currX - prevX;
        const moveY = currY - prevY;
        positionX += moveX;
        positionY += moveY;
        moving.style.transform = `
    translate(${positionX}px, ${positionY}px)`;
        prevX = currX;
        prevY = currY;
    });
});
window.addEventListener('mouseup', (event) => {
    clearInterval(timer);
    movable = false;
    if (moving) {
        const li = moving.parentNode;
        console.log(getOrderNum(event.clientY));
        li.lastChild.remove();
        li.classList.remove('move');
        moving.classList.remove('move');
        moving.style.transform = '';
        positionX = 0;
        positionY = 0;
        moving = null;
    }
});
