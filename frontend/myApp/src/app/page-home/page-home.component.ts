import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AlbumsService } from '../albums.service';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrl: './page-home.component.css',
})
export class PageHomeComponent {
  albums: string[] = [];
  nvlAlbum: string = '';

  constructor(private albumsService: AlbumsService) {}

  initAlbums() {
    this.albums = ['all', 'favorites'];
    this.albumsService.getAllAlbum().subscribe((albums: Observable<any>) => {
      albums.forEach((unAlbum) => this.albums.push(unAlbum.nom));
    });
  }

  ngOnInit() {
    this.initAlbums();
  }

  addAlbum() {
    if (this.nvlAlbum !== '') {
      this.albumsService.addAlbum(this.nvlAlbum);
      this.nvlAlbum = '';
      this.initAlbums();
    }
  }
}
