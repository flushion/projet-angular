import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageVisualierComponent } from './page-visualier/page-visualier.component';
import { PhototequeComponent } from './phototeque/phototeque.component';
import { PageHomeComponent } from './page-home/page-home.component';

const routes: Routes = [
  { path: 'home', component: PageHomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'album/:album', component: PhototequeComponent },
  { path: 'visualiser/:name', component: PageVisualierComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
