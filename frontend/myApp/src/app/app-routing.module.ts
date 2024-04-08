import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageVisualierComponent } from './page-visualier/page-visualier.component';
import { PhototequeComponent } from './phototeque/phototeque.component';

const routes: Routes = [
  { path: 'home', component: PhototequeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'visualiser/:name', component: PageVisualierComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
