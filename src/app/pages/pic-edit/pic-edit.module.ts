import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

//import { ComponentsModule } from '../../components/components';
import { PiceditPage } from './pic-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
      IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: PiceditPage
      }
    ])
  ],
    declarations: [PiceditPage]
})
export class PiceditPageModule {}
