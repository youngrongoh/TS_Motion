type Item = {
  id: number;
  kind: ItemKinds;
  text: string;
  content: string;
};

type ItemKinds = 'video' | 'image' | 'task' | 'note';

type Items = {
  [K: number]: Item;
};

export default class LocalSaver {
  private items: Items;
  private addItem: Function = () => {};

  constructor(items: Items) {
    this.items = items;
  }

  setItemAdd = (addItem: Function) => {
    this.addItem = addItem;
  };

  saveItems(items: Items) {
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
