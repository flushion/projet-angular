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
import { BarreNavigationComponent } from './barre-navigation/barre-navigation.component';

import { PhotosService } from './photos.service';
import { HttpClientModule } from '@angular/common/http';
import { PageVisualierComponent } from './page-visualier/page-visualier.component';

@NgModule({
  declarations: [
    AppComponent,
    PhototequeComponent,
    PictureComponent,
    BarreNavigationComponent,
    PageVisualierComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    HttpClientModule,
  ],
  providers: [provideAnimationsAsync(), PhotosService],
  bootstrap: [AppComponent],
})
export class AppModule {}
