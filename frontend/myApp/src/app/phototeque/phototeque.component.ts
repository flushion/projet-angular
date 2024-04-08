import { Component, OnInit } from '@angular/core';
import { PhotosService } from '../photos.service';
import { IPhoto } from '../IPhoto';

@Component({
  selector: 'app-phototeque',
  templateUrl: './phototeque.component.html',
  styleUrls: ['./phototeque.component.css'],
})
export class PhototequeComponent implements OnInit {
  mesPhotos!: IPhoto[];

  constructor(private photosService: PhotosService) {}

  ngOnInit(): void {
    this.photosService.getAll().subscribe((photos: IPhoto[]) => {
      this.mesPhotos = photos;
    });
  }
}
