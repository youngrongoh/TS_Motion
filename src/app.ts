import { PageComponent } from './components/page.js';

class App {
  private readonly page: PageComponent;
  constructor(appRoot: HTMLElement) {
    this.page = new PageComponent();
    this.page.attachTo(appRoot);
  }
}

new App(document.querySelector('.document')! as HTMLElement); // 동적으로 추가하는 것이 아니기 때문에 타입을 확실히 알 수 있음. 따라서, Type Assertion 사용.
