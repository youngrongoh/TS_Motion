import ItemDragger from './dragger';
import ModalImpl from './modal';
import LocalSaver from './local_saver';

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

const changer = new ItemDragger(items);
const modal = new ModalImpl(items);
const storage = new LocalSaver(items);

changer.setItemsSave(storage.saveItems);
modal.setItemsSave(storage.saveItems);
modal.setItemAdd(storage.saveItems);
