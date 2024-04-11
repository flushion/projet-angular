import { Component } from '@angular/core';
import { IPhoto } from '../IPhoto';
import { OnInit } from '@angular/core';
import { PhotosService } from '../photos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IDimension } from '../IDimension';
import { PopUpInfosComponent } from '../pop-up-infos/pop-up-infos.component';
import { MatDialog } from '@angular/material/dialog';
import { AlbumsService } from '../albums.service';

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
  allAlbums: string[] = [];
  albums: string[] = [];
  selectionPrecedente: string[] = [];
  path: string = 'http://localhost:3000/photos/';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private photosService: PhotosService,
    private dialogRef: MatDialog,
    private albumsService: AlbumsService
  ) {}

  ngOnInit(): void {
    const nom: string = this.route.snapshot.paramMap.get('name')!;
    this.photosService.getAll().subscribe((photos: IPhoto[]) => {
      let infos = photos.find((photo) => photo.name === nom);
      if (infos != undefined) {
        this.name = nom;
        this.createdAt = infos.createdAt;
        this.liked = infos.liked;
        this.size = infos.size;
        this.dimensions = infos.dimensions;
        this.albums = infos.albums;
        this.selectionPrecedente = infos.albums;
      }
    });
    this.albumsService
      .getAllAlbum()
      .subscribe((albums: { nom: string; photos: string[] }[]) => {
        albums.forEach((album: { nom: string; photos: string[] }) => {
          this.allAlbums.push(album.nom);
        });
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

  changementAlbum() {
    //on cherche si une modificationa eu lieu entre albums et la selection precedente
    const selectionAdded = this.albums.filter(
      (elt) => !this.selectionPrecedente.includes(elt)
    );
    const selectionRemoved = this.selectionPrecedente.filter(
      (elt) => !this.albums.includes(elt)
    );

    //on traite ce changement en fonction de si c'est un ajoue ou une suppression
    if (selectionAdded.length > 0) {
      this.albumsService.ajouterPhotoInAlbum(selectionAdded[0], this.name);
      console.log('Élément sélectionné : ', selectionAdded[0]);
      this.selectionPrecedente.push(selectionAdded[0]);
    } else if (selectionRemoved.length > 0) {
      this.albumsService.deletePhotoInAlbum(selectionRemoved[0], this.name);
      console.log('Élément désélectionné : ', selectionRemoved[0]);
      this.selectionPrecedente.filter((elt, index) => {
        if (elt == selectionRemoved[0]) {
          this.selectionPrecedente.splice(index, 1);
        }
      });
    }
  }
}
