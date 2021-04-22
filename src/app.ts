import { PageComponent } from './page.js';

const notes = document.querySelector('#notes')! as HTMLElement;

const page = new PageComponent();

page.attachTo(notes);