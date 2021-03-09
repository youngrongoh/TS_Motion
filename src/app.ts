import { ImageComponent } from './components/page/item/image.js';
import { PageComponent } from './components/page/page.js';
class App {
  private readonly page: PageComponent;
  private image: ImageComponent;
  constructor(appRoot: HTMLElement) {
    this.page = new PageComponent();
    this.image = new ImageComponent(
      'Image Title',
      'https://picsum.photos/600/300'
    );
    this.page.attachTo(appRoot);
    this.image.attachTo(appRoot, 'beforeend');
  }
}

new App(document.querySelector('.document')! as HTMLElement); // 동적으로 추가하는 것이 아니기 때문에 타입을 확실히 알 수 있음. 따라서, Type Assertion 사용.
