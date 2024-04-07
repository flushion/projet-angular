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

  /*[
    'https://www.zooplus.fr/magazine/wp-content/uploads/2019/06/comprendre-le-langage-des-chats.jpg',
    'https://cdn.shopify.com/s/files/1/0490/8384/2713/files/2.-Le-chat-Bengal-le-leopard_600x600.jpg?v=1672839840',
    'https://www.zoomalia.com/blogz/274/african-grey-parrot-4377951_640.jpg',
    'https://www.planetloisirs.com/wp-content/uploads/2017/01/cameleon.jpg',
    'https://www.planetloisirs.com/wp-content/uploads/2017/01/cameleon.jpg',
    'https://www.planetloisirs.com/wp-content/uploads/2017/01/cameleon.jpg',
    'https://www.planetloisirs.com/wp-content/uploads/2017/01/cameleon.jpg',
  ];*/

  constructor(private photosService: PhotosService) {}

  ngOnInit(): void {
    this.photosService.getAll().subscribe((photos: IPhoto[]) => {
      this.mesPhotos = photos;
      console.log(this.mesPhotos);
    });
  }
}
