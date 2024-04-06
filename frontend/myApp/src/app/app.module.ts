import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PictureComponent } from './picture/picture.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PhototequeComponent } from './phototeque/phototeque.component';

@NgModule({
  declarations: [AppComponent, PhototequeComponent, PictureComponent],
  imports: [BrowserModule, AppRoutingModule, MatIconModule, MatButtonModule],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
