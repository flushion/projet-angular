import { Component } from '@angular/core';
import { IPhoto } from '../IPhoto';
import { OnInit } from '@angular/core';
import { PhotosService } from '../photos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IDimension } from '../IDimension';
import { PopUpInfosComponent } from '../pop-up-infos/pop-up-infos.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-page-visualier',
  templateUrl: './page-visualier.component.html',
  styleUrl: './page-visualier.component.css',
})
export class PageVisualierComponent implements IPhoto {
  name: string = '';
  createdAt: string = '';
  liked: boolean = false;
  size: number = 0;
  dimensions: IDimension = { width: 0, height: 0 };
  path: string = 'http://localhost:3000/photos/';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private photosService: PhotosService,
    private dialogRef: MatDialog
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
      if (infos != undefined) {
        this.name = nom;
        this.createdAt = infos.createdAt;
        this.liked = infos.liked;
        this.size = infos.size;
        this.dimensions = infos.dimensions;
      }
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

  openInfos() {
    this.dialogRef.open(PopUpInfosComponent, {
      data: {
        name: this.name,
        date: this.createdAt,
        size: this.size,
        dimensions: this.dimensions,
      },
    });
  }
}
