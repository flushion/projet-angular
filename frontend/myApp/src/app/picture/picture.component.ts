import { Component, Input } from '@angular/core';
import { IPhoto } from '../IPhoto';
import { PhotosService } from '../photos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css'],
})
export class PictureComponent implements IPhoto {
  @Input() name: string = '';
  @Input() createdAt: string = '';
  @Input() liked: boolean = false;
  private _path: string = 'http://localhost:3000/photos/';

  constructor(private photosService: PhotosService, private router: Router) {}

  get path(): string {
    return this._path;
  }

  like() {
    if (this.liked === true) {
      this.photosService.delFavorie(this.name);
      this.liked = false;
    } else {
      this.photosService.addFavorie(this.name);
      this.liked = true;
    }
  }

  ouvertureImage() {
    this.router.navigate(['/visualiser', this.name]);
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
