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
  constructor(appRoot: HTMLElement, private dialogRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent);
    this.page.attachTo(appRoot);

    this.addButtonEvent('video');
    this.addButtonEvent('image');
    this.addButtonEvent('note');
    this.addButtonEvent('todo');
  }

  addButtonEvent = (type: string) => {
    const button = document.querySelector(`#add-${type}`) as HTMLButtonElement;
    button.addEventListener('click', () => {
      const dialog = new InputDialog();
      let sectionInput: MediaSectionInput | TextSectionInput;
      if (type === 'video' || type === 'image') {
        sectionInput = new MediaSectionInput();
      } else {
        sectionInput = new TextSectionInput();
      }
      dialog.addChild(sectionInput);
      dialog.attachTo(this.dialogRoot);

      dialog.setOnCloseListener(() => dialog.removeFrom(this.dialogRoot));

      dialog.setOnSubmitListener(() => {
        // 섹션을 만들어 페이지에 추가
        const title = sectionInput.title;
        const content = sectionInput instanceof MediaSectionInput ?
          (<MediaSectionInput>sectionInput).url :
          (<TextSectionInput>sectionInput).body;

        let element: Component;
        switch (type) {
          case 'video':
            element = new VideoComponent(title, content);
            break;
          case 'image':
            element = new ImageComponent(title, content);
            break;
          case 'todo':
            element = new TodoComponent(title, content);
            break;
          case 'note':
            element = new NoteComponent(title, content);
            break;
          default:
            throw new Error('invalid type');
        } 
        this.page.addChild(element);
        dialog.removeFrom(this.dialogRoot);
      });
    });
  }
}

new App(document.querySelector('#notes')! as HTMLElement, document.body);
