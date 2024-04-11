import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlbumsService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAllAlbum(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/albums`);
  }

  addAlbum(name: string): void {
    this.http
      .post(`${this.apiUrl}/albums/${name}`, null)
      .subscribe((error) => console.log('une erreur est survenue : ' + error));
  }

  deletePhotoInAlbum(album: string, photo: string) {
    this.http
      .delete(`${this.apiUrl}/albums/${album}/photos/${photo}`)
      .subscribe((error) => console.log('une erreur est survenue : ' + error));
  }

  ajouterPhotoInAlbum(album: string, photo: string) {
    this.http
      .post(`${this.apiUrl}/albums/${album}/photos/${photo}`, null)
      .subscribe((error) => console.log('une erreur est survenue : ' + error));
  }
}
