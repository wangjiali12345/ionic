import {Component, Input, ElementRef} from '@angular/core';
import {Router} from '@angular/router';

/**
 * Generated class for the BuildingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'house-building',
    templateUrl: './housebuilding.html',
    styleUrls: ['./housebuilding.scss'],
})
export class HousebuildingComponent {
    @Input() building: any = {};
    @Input() usethumbnail: boolean = true;

    constructor(private router: Router) {
    }

    foward() {
        this.router.navigate(['/folder']);
    }
}
