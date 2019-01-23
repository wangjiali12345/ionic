import {Component, Input, ElementRef, Output, EventEmitter} from '@angular/core';
import {trigger, transition, animate, style, keyframes} from '@angular/animations';
import {GlobalData} from '../../providers/GlobalData';
import {Router} from '../../../../node_modules/@angular/router';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'fixed-toolbar',
    templateUrl: './fixed-toolbar.html',
    styleUrls: ['./fixed-toolbar.scss'],
    animations: [
        trigger('switchSet', [
            transition(':enter', [animate(300, keyframes([
                style({transform: 'translateY(100%)', offset: 0}),
                style({transform: 'translateY(0)', offset: 1})
            ]))]),
            transition(':leave', [animate(300, style({transform: 'translateY(100%)'}))])
        ])
    ]
})
export class FixedToolbarComponent {
    @Input() isHome: boolean = true;
    @Input() inputPlaceHolder: string = '';
    showSetList: boolean = false;
    @Output() emitbuildingListstack = new EventEmitter();
    @Output() emitConnected = new EventEmitter();

    constructor(public globaldata: GlobalData, public eleRef: ElementRef, public globalData: GlobalData, public router: Router, public nav: NavController) {
    }

    stackBack() {
        console.log(this.globalData.buildingList);

        if (this.globalData.buildingListstack[1].pagename == '办公室') {
            this.router.navigate(['working-list']);
        } else {
            let stack = this.globalData.goback();
            if (stack != null) {

                this.emitbuildingListstack.emit(stack);
            }
        }
        //console.log(this.globalData.buildingListstack);

    }

    stackFoward() {
        let stack = this.globalData.goForward();

        if (stack != null) {

            this.emitbuildingListstack.emit(stack);
        }

    }

    showlist() {
        this.showSetList = !this.showSetList;
    }

    toConnectedOffice(agree: boolean) {
        this.emitConnected.emit(agree);
    }
}
