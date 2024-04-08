import { Component } from '@angular/core';
import { IPhoto } from '../IPhoto';
import { OnInit } from '@angular/core';
import { PhotosService } from '../photos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-page-visualier',
  templateUrl: './page-visualier.component.html',
  styleUrl: './page-visualier.component.css',
})
export class PageVisualierComponent implements IPhoto {
  name: string = '';
  createdAt: string = '';
  liked: boolean = false;
  path: string = 'http://localhost:3000/photos/';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private photosService: PhotosService
  ) {}

  ngOnInit(): void {
    const nom: string = this.route.snapshot.paramMap.get('name')!;
    /*
    const infos = this.photosService
      .getByName(nom)
      .subscribe((info: IPhoto) => {
        this.name = nom;
        this.createdAt = info.createdAt;
        this.liked = info.liked;
      });
      */

    this.photosService.getAll().subscribe((photos: IPhoto[]) => {
      let infos = photos.find((photo) => photo.name === nom);
      this.name = nom;
      this.createdAt = infos!.createdAt;
      this.liked = infos!.liked;
    });
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

  delete() {
    this.photosService.deletePicture(this.name);
    this.router.navigate(['/']);
  }
}
