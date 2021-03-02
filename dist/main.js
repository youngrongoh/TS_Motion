"use strict";
const buttons = document.querySelector('.adds');
const modal = document.querySelector('#modal');
const contentLabel = modal.querySelector('.label.content');
const contentTitle = contentLabel.querySelector('.name');
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
function onButtonClick(event) {
    var _a;
    const target = event.target;
    if (target.tagName === 'BUTTON') {
        const text = (_a = target.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase();
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
}
buttons.addEventListener('click', onButtonClick);
