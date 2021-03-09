import ItemDragger from './dragger.js';
import Modal from './modal.js';
import LocalSaver from './local_saver.js';

type ItemKinds = 'video' | 'image' | 'task' | 'note';

type Item = {
  id: number;
  kind: ItemKinds;
  text: string;
  content: string;
};

type Items = {
  [K: number]: Item;
};

const items: Items = {};

const ItemChanger = new ItemDragger(items);
const modal = new Modal(items);
const storage = new LocalSaver(items);

ItemChanger.setItemsSave(storage.saveItems);
modal.setItemsSave(storage.saveItems);
modal.setItemAdd(ItemChanger.addItem);

window.addEventListener('load', () => {
  storage.setItemAdd(ItemChanger.addItem);
  storage.onLoad();
});
