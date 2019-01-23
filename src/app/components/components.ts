import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {GridAreaComponent} from './grid-area/grid-area.page';
import {FixedToolbarComponent} from './fixed-toolbar/fixed-toolbar';
import {TreeviewComponent} from './treeview/treeview';
import { BuildingComponent } from './building/building.page';
import { HousebuildingComponent } from './housebuilding/housebuilding';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule.forRoot()
    ],
    declarations: [
        TreeviewComponent,
        GridAreaComponent,
        FixedToolbarComponent,
        BuildingComponent,
        HousebuildingComponent
    ],
    exports: [
        TreeviewComponent,
        GridAreaComponent,
        FixedToolbarComponent,
        BuildingComponent,
        HousebuildingComponent
    ],
})
export class ComponentsModule {
}
