import { BaseComponent } from '../component.js';

export class VideoComponent extends BaseComponent<HTMLElement> {
  constructor(title: string, url: string) {
    super(`<section class="video">
            <div class="video__holder">
            <iframe
              id="ytplayer"
              type="text/html"
              width="720"
              height="405"
              frameborder="0"
              allowfullscreen
            ></iframe>
            </div>
            <p class="video__title"></p>
          </section>`);
    const video = this.element.querySelector('#ytplayer') as HTMLIFrameElement;
    const pattern =
      /(?:https?:\/\/)(?:www.?)?(?:(?:youtube.com|youtu.be)\/(?:(?:[a-zA-Z-_?]+)(?:\/|\?|=)?))([a-zA-Z0-9-_]+)/;
    const videoId = url.match(pattern)![1];
    const src = `https://www.youtube.com/embed/${videoId}`;
    video.src = src;

    const videoTitle = this.element.querySelector('.video__title') as HTMLParagraphElement;
    videoTitle.textContent = title;
  }
}
