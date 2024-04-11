import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PictureComponent } from './picture/picture.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PhototequeComponent } from './phototeque/phototeque.component';

import { PhotosService } from './photos.service';
import { HttpClientModule } from '@angular/common/http';
import { PageVisualierComponent } from './page-visualier/page-visualier.component';
import { PageHomeComponent } from './page-home/page-home.component';

import { MatDialogModule } from '@angular/material/dialog';
import { AlbumComponent } from './album/album.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { MatToolbar } from '@angular/material/toolbar';

@NgModule({
  declarations: [
    AppComponent,
    PhototequeComponent,
    PictureComponent,
    PageVisualierComponent,
    PageHomeComponent,
    AlbumComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    HttpClientModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatToolbar,
  ],
  providers: [provideAnimationsAsync(), PhotosService],
  bootstrap: [AppComponent],
})
export class AppModule {}
