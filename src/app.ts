import { DialogForm } from './components/dialog/content/form.js';
import { InputDialog } from './components/dialog/dialog.js';
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

    const imageBtn = document.querySelector('#add-image') as HTMLButtonElement;
    const videoBtn = document.querySelector('#add-video') as HTMLButtonElement;
    const noteBtn = document.querySelector('#add-note') as HTMLButtonElement;
    const todoBtn = document.querySelector('#add-todo') as HTMLButtonElement;

    imageBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const form = new DialogForm('media');
      dialog.addChild(form);

      dialog.setOnCloseListener(() => dialog.removeFrom(document.body));

      dialog.setOnSubmitListener(() => {
        // 섹션을 만들어 페이지에 추가
        const [title, content] = form.getData();
        const element = new ImageComponent(title!, content!);
        this.page.addChild(element);
        dialog.removeFrom(document.body);
      });

      dialog.attachTo(document.body);
    });

    videoBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const form = new DialogForm('media');
      dialog.addChild(form);

      dialog.setOnCloseListener(() => dialog.removeFrom(document.body));

      dialog.setOnSubmitListener(() => {
        // 섹션을 만들어 페이지에 추가
        const [title, content] = form.getData();
        const element = new VideoComponent(title!, content!);
        this.page.addChild(element);
        dialog.removeFrom(document.body);
      });

      dialog.attachTo(document.body);
    });

    noteBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const form = new DialogForm('text');
      dialog.addChild(form);

      dialog.setOnCloseListener(() => dialog.removeFrom(document.body));

      dialog.setOnSubmitListener(() => {
        // 섹션을 만들어 페이지에 추가
        const [title, content] = form.getData();
        const element = new NoteComponent(title!, content!);
        this.page.addChild(element);
        dialog.removeFrom(document.body);
      });

      dialog.attachTo(document.body);
    });

    todoBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const form = new DialogForm('text');
      dialog.addChild(form);

      dialog.setOnCloseListener(() => dialog.removeFrom(document.body));

      dialog.setOnSubmitListener(() => {
        // 섹션을 만들어 페이지에 추가
        const [title, content] = form.getData();
        const element = new TodoComponent(title!, content!);
        this.page.addChild(element);
        dialog.removeFrom(document.body);
      });

      dialog.attachTo(document.body);
    });
  }
}

new App(document.querySelector('#notes')! as HTMLElement);
