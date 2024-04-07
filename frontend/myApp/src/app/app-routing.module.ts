import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageVisualierComponent } from './page-visualier/page-visualier.component';
import { PagePrincipaleComponent } from './page-principale/page-principale.component';

const routes: Routes = [
  { path: 'home', component: PagePrincipaleComponent },
  { path: 'visualiser', component: PageVisualierComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
