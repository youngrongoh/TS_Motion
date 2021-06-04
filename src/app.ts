import { TextSectionInput } from './components/dialog/input/text-input.js';
import { MediaSectionInput } from './components/dialog/input/media-input.js';
import { InputDialog } from './components/dialog/dialog.js';
import { Component } from './components/page/component.js';
import { ImageComponent } from './components/page/item/image.js';
import { NoteComponent } from './components/page/item/note.js';
import { TodoComponent } from './components/page/item/todo.js';
import { VideoComponent } from './components/page/item/video.js';
import { Composable, PageComponent, PageItemComponent } from './components/page/page.js';

class App {
  private readonly page: Component & Composable;
  constructor(appRoot: HTMLElement, dialogRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent);
    this.page.attachTo(appRoot);
    
    const imageBtn = document.querySelector('#add-image') as HTMLButtonElement;
    const videoBtn = document.querySelector('#add-video') as HTMLButtonElement;
    const noteBtn = document.querySelector('#add-note') as HTMLButtonElement;
    const todoBtn = document.querySelector('#add-todo') as HTMLButtonElement;

    imageBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const sectionInput = new MediaSectionInput();
      dialog.addChild(sectionInput);
      dialog.attachTo(dialogRoot);

      dialog.setOnCloseListener(() => dialog.removeFrom(dialogRoot));

      dialog.setOnSubmitListener(() => {
        // 섹션을 만들어 페이지에 추가
        const title = sectionInput.title;
        const url = sectionInput.url;
        const element = new ImageComponent(title, url);
        this.page.addChild(element);
        dialog.removeFrom(dialogRoot);
      });
    });

    videoBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const sectionInput = new MediaSectionInput();
      dialog.addChild(sectionInput);
      dialog.attachTo(dialogRoot);

      dialog.setOnCloseListener(() => dialog.removeFrom(dialogRoot));

      dialog.setOnSubmitListener(() => {
        // 섹션을 만들어 페이지에 추가
        const title = sectionInput.title;
        const url = sectionInput.url;
        const element = new VideoComponent(title, url);
        this.page.addChild(element);
        dialog.removeFrom(dialogRoot);
      });
    });

    noteBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const sectionInput = new TextSectionInput();
      dialog.addChild(sectionInput);
      dialog.attachTo(dialogRoot);

      dialog.setOnCloseListener(() => dialog.removeFrom(dialogRoot));

      dialog.setOnSubmitListener(() => {
        // 섹션을 만들어 페이지에 추가
        const title = sectionInput.title;
        const body = sectionInput.body;
        const element = new NoteComponent(title, body);
        this.page.addChild(element);
        dialog.removeFrom(dialogRoot);
      });
    });

    todoBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const sectionInput = new TextSectionInput();
      dialog.addChild(sectionInput);
      dialog.attachTo(dialogRoot);

      dialog.setOnCloseListener(() => dialog.removeFrom(dialogRoot));

      dialog.setOnSubmitListener(() => {
        // 섹션을 만들어 페이지에 추가
        const title = sectionInput.title;
        const body = sectionInput.body;
        const element = new TodoComponent(title, body);
        this.page.addChild(element);
        dialog.removeFrom(dialogRoot);
      });
    });
  }
}

new App(document.querySelector('#notes')! as HTMLElement, document.body);
