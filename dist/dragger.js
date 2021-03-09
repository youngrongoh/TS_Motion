export default class ItemDraggerImpl {
    constructor(items) {
        this.moving = null;
        this.positions = [];
        this.timer = 0;
        this.movable = false;
        this.looper = false;
        this.prevX = 0;
        this.prevY = 0;
        this.positionX = 0;
        this.positionY = 0;
        this.saveItems = () => { };
        this.setItemsSave = (saveItems) => {
            this.saveItems = saveItems;
        };
        this.onDeleteClick = (event) => {
            const target = event.target;
            if (!target.matches('.delete')) {
                return;
            }
            const item = target.closest('li');
            const id = Number(item.dataset.id);
            item.remove();
            delete this.items[id];
            this.saveItems(this.items);
        };
        this.addItem = (itemObj) => {
            const itemContents = this.getItemContents(itemObj);
            const item = this.createItem(itemContents);
            this.list.appendChild(item);
        };
        this.onMouseDown = (event) => {
            const target = event.target.closest('div.container');
            if (!target) {
                return;
            }
            let t = 0;
            this.timer = setInterval(() => {
                if (t > 3) {
                    const li = target.closest('li');
                    li.appendChild(this.box);
                    li.classList.add('shrink');
                    target.classList.add('move');
                    this.moving = target;
                    this.prevX = event.clientX;
                    this.prevY = event.clientY;
                    this.movable = true;
                    this.looper = true;
                    clearInterval(this.timer);
                }
                t += 1;
            }, 100);
        };
        this.onMouseMove = (event) => {
            if (!this.movable)
                return;
            if (this.looper) {
                this.updatePositions();
                setTimeout(() => (this.looper = false), 500);
            }
            const currX = event.clientX;
            const currY = event.clientY;
            requestAnimationFrame(() => {
                if (!this.moving)
                    return;
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
        this.onMouseUp = (event) => {
            clearInterval(this.timer);
            this.movable = false;
            if (this.moving) {
                const li = this.moving.closest('li');
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
        this.getItemContents = (item) => {
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
        };
        this.items = items;
        this.list = document.querySelector('.list');
        this.box = this.createSpaceBox();
        this.list.addEventListener('click', this.onDeleteClick);
        this.list.addEventListener('mousedown', this.onMouseDown);
        this.list.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
    }
    createSpaceBox() {
        const box = document.createElement('div');
        box.classList.add('box');
        return box;
    }
    createItem(itemContents) {
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
    updatePositions() {
        const lis = Array.from(this.list.querySelectorAll('li'));
        lis.forEach((li, i) => {
            const top = li.getBoundingClientRect().top;
            this.positions[i] = top;
        });
    }
    changeItemPos(item, index) {
        const lis = this.list.children;
        const itemIdx = Array.from(lis).findIndex((child) => child === item);
        const target = lis[index];
        if (index === itemIdx) {
            return;
        }
        this.list.removeChild(item);
        if (itemIdx < index) {
            target === null || target === void 0 ? void 0 : target.after(item);
        }
        else {
            target === null || target === void 0 ? void 0 : target.before(item);
        }
    }
    getOrderNum(y) {
        let result;
        this.positions.forEach((pos, i, arr) => {
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
}
//# sourceMappingURL=dragger.js.map