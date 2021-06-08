import { BaseComponent } from '../../component.js';

export class VideoComponent extends BaseComponent<HTMLElement> {
  constructor(title: string, url: string) {
    super(`<section class="video">
            <div class="video__player">
              <iframe class="video__iframe" allowfullscreen></iframe>
            </div>
            <h2 class="page-item__title video__title"></h2>
          </section>`);

    const iframe = this.element.querySelector('.video__iframe') as HTMLIFrameElement;
    iframe.src = this.convertToEmbededURL(url);

    const videoTitle = this.element.querySelector('.video__title') as HTMLParagraphElement;
    videoTitle.textContent = title;
  }

  convertToEmbededURL(url: string): string {
    const regExp =
      /(?:https?:\/\/)(?:www.?)?(?:(?:youtube.com|youtu.be)\/(?:(?:[a-zA-Z-_?]+)(?:\/|\?|=)?))([a-zA-Z0-9-_]+)/;
    const match = url.match(regExp);

    const videoId = match ? match[1] : undefined;

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  }
}
