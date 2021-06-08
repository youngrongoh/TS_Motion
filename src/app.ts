import { TextSectionInput } from './components/dialog/input/text-input.js';
import { InputDialog, MediaData, TextData } from './components/dialog/dialog.js';
import { MediaSectionInput } from './components/dialog/input/media-input.js';
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

    this.bindElementToDialog<MediaSectionInput>(
      '#new-image',
      MediaSectionInput,
      (input: MediaSectionInput) => new ImageComponent(input.title, input.url)
    );

    this.bindElementToDialog<MediaSectionInput>(
      '#new-video',
      MediaSectionInput,
      (input: MediaSectionInput) => new VideoComponent(input.title, input.url)
    );

    this.bindElementToDialog<TextSectionInput>(
      '#new-note',
      TextSectionInput,
      (input: TextSectionInput) => new NoteComponent(input.title, input.body)
    );

    this.bindElementToDialog<TextSectionInput>(
      '#new-todo',
      TextSectionInput,
      (input: TextSectionInput) => new TodoComponent(input.title, input.body)
    );

    this.page.addChild(new ImageComponent('Image 1', 'https://picsum.photos/600/300'));
    this.page.addChild(new TodoComponent('Todo 2', 'Duis non ipsum interdum'));
    this.page.addChild(new VideoComponent('Video 1', 'https://youtu.be/M7lc1UVf-VE'));
    this.page.addChild(new NoteComponent('Note 2', 'Duis mollis ultricies'));
    this.page.addChild(new TodoComponent('Todo 1', 'Curae imperdiet sodales'));
    this.page.addChild(new ImageComponent('Image 2', 'https://picsum.photos/600/300'));
    this.page.addChild(new NoteComponent('Note 1', 'Laoreet cras dis convallis'));
    this.page.addChild(new VideoComponent('Video 2', 'https://youtu.be/M7lc1UVf-VE'));
  }

  private bindElementToDialog<T extends (MediaData | TextData) & Component>(
    selector: string,
    InputComponent: InputComponentConstructor<T>,
    makeSection: (input: T) => Component
  ) {
    const element = document.querySelector(selector) as HTMLButtonElement;
    element.addEventListener('click', () => {
      const dialog = new InputDialog();
      const input = new InputComponent();
      dialog.addChild(input);
      dialog.attachTo(this.dialogRoot);

      dialog.setOnCloseListener(() => dialog.removeFrom(this.dialogRoot));

      dialog.setOnSubmitListener(() => {
        // 섹션을 만들고 페이지에 추가
        const image = makeSection(input);
        this.page.addChild(image);
        dialog.removeFrom(this.dialogRoot);
      });
    });
  }
}

new App(document.querySelector('.document')! as HTMLElement, document.body);
