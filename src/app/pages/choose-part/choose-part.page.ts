import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {ModalController,} from '@ionic/angular';
import {GlobalData} from '../../providers/GlobalData';
import {Router} from '@angular/router';
@Component({
    selector: 'app-choose-part',
    templateUrl: './choose-part.page.html',
    styleUrls: ['./choose-part.page.scss'],
})
export class ChoosePartPage {
    companyid;
    partArray: Array<any>;
    archs;
    keyword: any;
    @Input('item') item;
    manager;
    canmulti: boolean = false;
    Array = [];
    @ViewChild('child') child;

    constructor() {
    }
}
