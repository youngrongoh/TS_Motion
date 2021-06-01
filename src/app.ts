import { ImageComponent } from './components/page/item/image.js';
import { PageItemComponent } from './components/page/item.js';
import { NoteComponent } from './components/page/item/note.js';
import { TodoComponent } from './components/page/item/todo.js';
import { VideoComponent } from './components/page/item/video.js';
import { PageComponent } from './components/page/page.js';

class App {
  private readonly page: PageComponent;
  constructor(appRoot: HTMLElement) {
    this.page = new PageComponent();
    this.page.attachTo(appRoot);

    const imageItem = new PageItemComponent();
    const image = new ImageComponent('My Image', 'https://picsum.photos/500/300');
    imageItem.append(image).attachTo(appRoot, 'beforeend');

    const videoItem = new PageItemComponent();
    const video = new VideoComponent('My Video', 'https://www.youtube.com/embed/M7lc1UVf-VE');
    videoItem.append(video).attachTo(appRoot, 'beforeend');

    const todoItem = new PageItemComponent();
    const todo = new TodoComponent('title', 'task');
    todoItem.append(todo).attachTo(appRoot, 'beforeend');

    const noteItem = new PageItemComponent();
    const note = new NoteComponent('title', 'this is note');
    noteItem.append(note).attachTo(appRoot, 'beforeend');
  }
}

new App(document.querySelector('#notes')! as HTMLElement);
