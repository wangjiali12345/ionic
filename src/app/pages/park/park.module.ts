import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ParkPage } from './park.page';
import { ComponentsModule } from '../../components/components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
      IonicModule,
      ComponentsModule,
    RouterModule.forChild([
      {
        path: '',
            component: ParkPage
      }
    ])
  ],
    declarations: [ParkPage]
})
export class ParkPageModule {}
