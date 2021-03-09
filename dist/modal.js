var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class ModalImpl {
    constructor(items) {
        this.clickedButton = 'video';
        this.addItem = () => { };
        this.saveItems = () => { };
        this.setItemAdd = (addItem) => {
            this.addItem = addItem;
        };
        this.setItemsSave = (saveItems) => {
            this.saveItems = saveItems;
        };
        this.showModal = (event) => {
            var _a;
            const target = event.target;
            console.log(target);
            if (target.tagName !== 'BUTTON') {
                return;
            }
            const input = this.contentLabel.lastChild;
            if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
                this.modalForm.reset();
                input.remove();
            }
            const contentTitle = (this.contentLabel.querySelector('.name'));
            const text = (_a = target.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase();
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
        this.checkURL = (url) => __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(url);
            if (res.status === 200) {
                return true;
            }
            else {
                return false;
            }
        });
        this.onModalAddClick = (event) => __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const text = this.modalForm[0].value;
            const content = this.modalForm[1].value;
            if (text === '' || content === '') {
                alert('내용을 입력해주세요');
                return;
            }
            if ((this.clickedButton === 'video' || this.clickedButton === 'image') &&
                !(yield this.checkURL(content))) {
                alert('URL을 다시 입력해주세요');
                return;
            }
            const item = {
                id: Date.now(),
                kind: this.clickedButton,
                text,
                content,
            };
            this.addItem(item);
            this.hideModal();
            this.items[item.id] = item;
            this.saveItems(this.items);
        });
        this.items = items;
        this.buttons = document.querySelector('.adds');
        this.modal = document.querySelector('#modal');
        this.modalExit = document.querySelector('.exit');
        this.contentLabel = (this.modal.querySelector('.label.content'));
        this.modalAdd = this.modal.querySelector('.add');
        this.modalForm = this.modal.querySelector('.form-box');
        this.buttons.addEventListener('click', this.showModal);
        this.modalExit.addEventListener('click', (event) => {
            event.preventDefault();
            this.hideModal();
        });
        this.modalAdd.addEventListener('click', this.onModalAddClick);
    }
    hideModal() {
        this.modal.classList.add('hidden');
        this.modalForm.reset();
        this.contentLabel.lastChild.remove();
    }
    createContentInput(kind) {
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
}
//# sourceMappingURL=modal.js.map