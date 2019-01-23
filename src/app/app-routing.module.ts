import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'picedit', loadChildren: './pages/pic-edit/pic-edit.module#PiceditPageModule'},
  { path: '', loadChildren: './pages/park/park.module#ParkPageModule'},
  { path: 'choosepart', loadChildren: './pages/choose-part/choose-part.module#ChoosepartPageModule'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
