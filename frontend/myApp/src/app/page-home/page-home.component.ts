import { Component, OnInit } from '@angular/core';
import { PhotosService } from '../photos.service';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrl: './page-home.component.css',
})
export class PageHomeComponent {
  albums: string[] = [];

  constructor() {}

  ngOnInit() {
    this.albums = ['all', 'favorites'];
  }
}
