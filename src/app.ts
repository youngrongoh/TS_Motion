import { ImageComponent } from './components/page/item/image.js';
import { NoteComponent } from './components/page/item/note.js';
import { TodoComponent } from './components/page/item/todo.js';
import { VideoComponent } from './components/page/item/video.js';
import { PageComponent } from './components/page/page.js';

class App {
  private readonly page: PageComponent;
  constructor(appRoot: HTMLElement) {
    this.page = new PageComponent();
    this.page.attachTo(appRoot);

    const image = new ImageComponent('My Image', 'https://picsum.photos/500/300');
    image.attachTo(appRoot, 'beforeend');

    const video = new VideoComponent('My Video', 'https://www.youtube.com/embed/M7lc1UVf-VE');
    video.attachTo(appRoot, 'beforeend');

    const todo = new TodoComponent('title', 'task');
    todo.attachTo(appRoot, 'beforeend');

    const note = new NoteComponent('title', 'this is note');
    note.attachTo(appRoot, 'beforeend');
  }
}

new App(document.querySelector('#notes')! as HTMLElement);
