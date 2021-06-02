import { Dialog } from './components/page/dialog.js';
import { Component } from './components/page/component.js';
import { ImageComponent } from './components/page/item/image.js';
import { NoteComponent } from './components/page/item/note.js';
import { TodoComponent } from './components/page/item/todo.js';
import { VideoComponent } from './components/page/item/video.js';
import { Composable, PageComponent, PageItemComponent } from './components/page/page.js';

class App {
  private readonly page: Component & Composable;
  constructor(appRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent);
    this.page.attachTo(appRoot);

    const image = new ImageComponent('My Image', 'https://picsum.photos/500/300');
    this.page.addChild(image);

    const video = new VideoComponent('My Video', 'https://www.youtube.com/embed/M7lc1UVf-VE');
    this.page.addChild(video);

    const todo = new TodoComponent('title', 'task');
    this.page.addChild(todo);

    const note = new NoteComponent('title', 'this is note');
    this.page.addChild(note);

    const dialog = new Dialog();
    dialog.setOnClickListener(() => dialog.removeFrom(appRoot));

    const btns = document.querySelector('.header__buttons') as HTMLDivElement;
    const imageBtn = btns.querySelector('.image') as HTMLButtonElement;

    imageBtn.addEventListener('click', () => {
      dialog.attachTo(appRoot);
    });
  }
}

new App(document.querySelector('#notes')! as HTMLElement);
