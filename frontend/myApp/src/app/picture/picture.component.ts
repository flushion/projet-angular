import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css'],
})
export class PictureComponent {
  @Input() url: string = '';

  constructor() {}

  like() {
    alert("vous avez liké l'image dont l'url est : " + this.url);
  }

  ouvertureImage() {
    window.location.href = this.url;
  }

  //délégation d'evenement car sinon la redirection se fait au clique sur le like (car le bouton est sur la div)
  delegationEvenements(event: MouseEvent) {
    const elementClique = event.target as HTMLElement;
    if (elementClique.className === 'mat-mdc-button-touch-target') {
      this.like();
    } else {
      this.ouvertureImage();
    }
  }
}
