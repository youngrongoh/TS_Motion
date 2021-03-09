export default class LocalSaver {
    constructor(items) {
        this.addItem = () => { };
        this.setItemAdd = (addItem) => {
            this.addItem = addItem;
        };
        this.items = items;
    }
    saveItems(items) {
        localStorage.setItem('items', JSON.stringify(items));
    }
    onLoad() {
        const stored = localStorage.getItem('items');
        if (!stored) {
            return;
        }
        const parsed = JSON.parse(stored);
        Object.keys(parsed).forEach((key) => {
            this.addItem(parsed[key]);
        });
        Object.assign(this.items, parsed);
    }
}
//# sourceMappingURL=local_saver.js.map