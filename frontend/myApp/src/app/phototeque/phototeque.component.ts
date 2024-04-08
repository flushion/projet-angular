import { Component, OnInit } from '@angular/core';
import { PhotosService } from '../photos.service';
import { IPhoto } from '../IPhoto';
import { ActivatedRoute, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-phototeque',
  templateUrl: './phototeque.component.html',
  styleUrls: ['./phototeque.component.css'],
})
export class PhototequeComponent implements OnInit {
  mesPhotos!: IPhoto[];

  constructor(
    private photosService: PhotosService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let album = this.route.snapshot.paramMap.get('album');
    if (album === 'favorites') {
      this.photosService
        .getFavories()
        .subscribe((photos: IPhoto[]) => (this.mesPhotos = photos));
    } else {
      this.photosService.getAll().subscribe((photos: IPhoto[]) => {
        this.mesPhotos = photos;
      });
    }
  }
}
