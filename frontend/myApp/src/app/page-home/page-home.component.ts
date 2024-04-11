import { Component, OnInit } from '@angular/core';
import { PhotosService } from '../photos.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrl: './page-home.component.css',
})
export class PageHomeComponent {
  albums: string[] = [];
  nvlAlbum: string = '';

  constructor(private photosService: PhotosService) {}

  initAlbums() {
    this.albums = ['all', 'favorites'];
    this.photosService.getAllAlbum().subscribe((albums: Observable<any>) => {
      albums.forEach((unAlbum) => this.albums.push(unAlbum.nom));
    });
  }

  ngOnInit() {
    this.initAlbums();
  }

  addAlbum() {
    if (this.nvlAlbum !== '') {
      this.photosService.addAlbum(this.nvlAlbum);
      this.nvlAlbum = '';
      this.initAlbums();
    }
  }
}
