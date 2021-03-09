import ItemDragger from './dragger.js';
import Modal from './modal.js';
import LocalSaver from './local_saver.js';
const items = {};
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
//# sourceMappingURL=main.js.map