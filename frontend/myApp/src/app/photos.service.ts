import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotosService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/photos`);
  }

  getFavories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/photos/favorites`);
  }

  getByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/photos/${name}`);
  }

  addFavorie(name: string) {
    this.http
      .post(`${this.apiUrl}/photos/${name}/favorite`, null)
      .subscribe((error) => console.log('une erreur est survenue : ' + error));
  }

  delFavorie(name: string): void {
    this.http
      .delete(`${this.apiUrl}/photos/${name}/favorite`)
      .subscribe((error) => console.log('une erreur est survenue : ' + error));
  }

  deletePicture(name: string): void {
    this.http
      .delete(`${this.apiUrl}/photos/${name}`)
      .subscribe((error) => console.log('une erreur est survenue : ' + error));
  }

  getPhotosByAlbum(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/albums/${name}`);
  }
}
