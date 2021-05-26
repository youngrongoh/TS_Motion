import { ImageComponent } from './components/image.js';
import { PageComponent } from './page.js';

class App {
  private readonly page: PageComponent;
  constructor(appRoot: HTMLElement) {
    this.page = new PageComponent();
    this.page.attachTo(appRoot);

    const image = new ImageComponent('My Image', 'https://picsum.photos/500/300');
    image.attachTo(appRoot);
  }
}

new App(document.querySelector('#notes')! as HTMLElement);
