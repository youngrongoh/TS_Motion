import { TextSectionInput } from './components/dialog/input/text-input.js';
import { MediaSectionInput } from './components/dialog/input/media-input.js';
import { InputDialog, MediaData, TextData } from './components/dialog/dialog.js';
import { Component } from './components/component.js';
import { ImageComponent } from './components/page/item/image.js';
import { NoteComponent } from './components/page/item/note.js';
import { TodoComponent } from './components/page/item/todo.js';
import { VideoComponent } from './components/page/item/video.js';
import { Composable, PageComponent, PageItemComponent } from './components/page/page.js';

type InputComponentConstructor<T extends (MediaData | TextData) & Component> = {
  new (): T;
};

class App {
  private readonly page: Component & Composable;
  constructor(appRoot: HTMLElement, private dialogRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent);
    this.page.attachTo(appRoot);

    this.bindElementToDialog(
      '#add-video',
      MediaSectionInput,
      (input: MediaSectionInput) => new VideoComponent(input.title, input.url)
    );
    this.bindElementToDialog(
      '#add-image',
      MediaSectionInput,
      (input: MediaSectionInput) => new ImageComponent(input.title, input.url)
    );
    this.bindElementToDialog(
      '#add-note',
      TextSectionInput,
      (input: TextSectionInput) => new NoteComponent(input.title, input.body)
    );
    this.bindElementToDialog(
      '#add-todo',
      TextSectionInput,
      (input: TextSectionInput) => new TodoComponent(input.title, input.body)
    );
  }

  bindElementToDialog = <T extends (MediaData | TextData) & Component>(
    selector: string,
    InputComponent: InputComponentConstructor<T>,
    makeSection: (input: T) => Component
  ) => {
    const element = document.querySelector(selector) as HTMLButtonElement;
    element.addEventListener('click', () => {
      const dialog = new InputDialog();
      const inputSection = new InputComponent();
      dialog.addChild(inputSection);
      dialog.attachTo(this.dialogRoot);

      dialog.setOnCloseListener(() => dialog.removeFrom(this.dialogRoot));

      dialog.setOnSubmitListener(() => {
        // 섹션을 만들어 페이지에 추가
        const section = makeSection(inputSection);
        this.page.addChild(section);
        dialog.removeFrom(this.dialogRoot);
      });
    });
  };
}

new App(document.querySelector('#notes')! as HTMLElement, document.body);
