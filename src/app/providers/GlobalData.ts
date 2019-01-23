/**
 * Created by yanxiaojun on 2017/4/13.
 */
import {Injectable} from '@angular/core';
import {Events} from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})

export class GlobalData {

    constructor(public events: Events) {
    }

    private _buildingList: Array<any> = [{
        pagename: '主页',
        buildingList: [{
            name: '上班',
            width: 2,
            height: 2,
            left: 1,
            top: 1,
            type: 1,
            svgNum: 6,
            isblock: false
        }, {
            name: '创业',
            width: 2,
            height: 2,
            left: 4,
            top: 1,
            type: 1,
            svgNum: 8,
            isblock: false
        }, {
            name: '创新',
            width: 2,
            height: 2,
            left: 1,
            top: 4,
            type: 1,
            svgNum: 3,
            isblock: false
        }, {
            name: '应聘',
            width: 2,
            height: 2,
            left: 4,
            top: 4,
            type: 1,
            svgNum: 10,
            isblock: false
        }, {
            name: '社交',
            width: 2,
            height: 2,
            left: 1,
            top: 7,
            type: 1,
            svgNum: 7,
            isblock: false
        }, {
            name: '公民',
            width: 2,
            height: 2,
            left: 4,
            top: 7,
            type: 1,
            svgNum: 5,
            isblock: false
        }]
    }, {
        pagename: '创业',
        buildingList: [{
            name: '公司',
            width: 2,
            height: 2,
            left: 1,
            top: 1,
            type: 1,
            svgNum: 11,
            isblock: false,
            bgc: true
        }, {
            name: '市场',
            width: 2,
            height: 2,
            left: 4,
            top: 1,
            type: 1,
            svgNum: 12,
            isblock: false,
            bgc: true
        }, {
            name: '业务',
            width: 2,
            height: 2,
            left: 1,
            top: 4,
            type: 1,
            svgNum: 13,
            isblock: false,
            bgc: true
        }, {
            name: '人事',
            width: 2,
            height: 2,
            left: 4,
            top: 4,
            type: 1,
            svgNum: 14,
            isblock: false,
            bgc: true
        }, {
            name: '行政',
            width: 2,
            height: 2,
            left: 1,
            top: 7,
            type: 1,
            svgNum: 15,
            isblock: false,
            bgc: true
        }, {
            name: '经营',
            width: 2,
            height: 2,
            left: 4,
            top: 7,
            type: 1,
            svgNum: 16,
            isblock: false,
            bgc: true
        }, {
            name: '决策',
            width: 2,
            height: 2,
            left: 1,
            top: 10,
            type: 1,
            svgNum: 17,
            isblock: false,
            bgc: true
        }]
    }, {
        pagename: '王Y个人办公室',
        buildingList: [{
            //衣柜clothing
            width: 2,
            height: 2,
            left: 5.5,
            top: 4,
            type: 2,
            svgNum: 1,
            isblock: false
        }, {
            //书柜filecabinet
            width: 2,
            height: 2,
            left: 3.8,
            top: 4,
            type: 2,
            svgNum: 2,
            isblock: false
        }, {
            width: 5,//desttop
            height: 2.5,
            left: 0.4,
            top: 7.2,
            type: 2,
            svgNum: 3,
            isblock: false
        }, {
            //日历
            width: 2,
            height: 2,
            left: 1.5,
            top: 3,
            type: 2,
            svgNum: 4,
            isblock: false
        }, {
            width: 3,//书架
            height: 1.5,
            left: 0.6,
            top: 4.5,
            type: 2,
            svgNum: 5,
            isblock: false
        }, {
            //buildbox
            width: 1.2,
            height: 0.8,
            left: 0.3,
            top: 6.5,
            type: 2,
            svgNum: 6,
            isblock: false
        },
        {
            //workingbox
            width: 1.2,
            height: 0.8,
            left: 1.5,
            top: 6.5,
            type: 2,
            svgNum: 7,
            isblock: false
        },
        {
            //visitbox
            width: 1.2,
            height: 0.8,
            left: 2.7,
            top: 6.5,
            type: 2,
            svgNum: 8,
            isblock: false
        }, {//email
            width: 1,
            height: 1,
            left: 0.2,
            top: 8,
            type: 2,
            svgNum: 9,
            isblock: false
        }, {
            width: 1,//clock
            height: 1,
            left: 4,
            top: 3,
            type: 2,
            svgNum: 10,
            isblock: false
        }]
    }, {
        pagename: '办公室',
        buildingList: [{
            name: '桌子',
            width: 6,
            height: 6,
            left: 1,
            top: 6,
            type: 2,
            svgNum: 3,
            isblock: false
        }, {
            name: '日历',
            width: 2,
            height: 2,
            left: 1,
            top: 3,
            type: 2,
            svgNum: 4,
            isblock: false
        }, {
            name: '衣帽架',
            width: 1,
            height: 1,
            left: 0,
            top: 7,
            type: 2,
            svgNum: 7,
            isblock: false
        }]
    }];
    private _buildingListstack: Array<any> = [];


    // public isSetDutyAlertShow = true;
    get buildingList(): Array<any> {
        return this._buildingList;
    }

    set buildingList(bl: Array<any>) {
        this._buildingList = bl;
    }

    get buildingListstack(): Array<any> {
        return this._buildingListstack;
    }

    set buildingListstack(bl: Array<any>) {
        this._buildingListstack = bl;
    }

    currentpos = 0;

    goback() {

        if (this.IsCanGoBack()) {
            this.currentpos = this.currentpos - 1;
            return this._buildingListstack[this.currentpos];
        }
        else {
            return null;
        }

    }

    goForward() {
        if (this.IsCanForward()) {
            this.currentpos = this.currentpos + 1;
            return this._buildingListstack[this.currentpos];
        }
        else
            return null;
    }

    Gobuilding(building) {

        if (this._buildingListstack.length == 0) {
            this.currentpos = 0;
            this._buildingListstack.push(building);
        }
        else {
            console.log(this._buildingListstack);
            console.log(this.currentpos);
            this._buildingListstack.splice(this.currentpos + 1, this._buildingListstack.length - 1 - this.currentpos, building);
            this.currentpos = this.currentpos + 1;
            console.log(this._buildingListstack);
        }

    }

    IsCanGoBack() {
        if (this._buildingListstack.length == 0 || this.currentpos == 0)
            return false;
        else
            return true;
    }

    IsCanForward() {
        if (this._buildingListstack.length > 0 && this.currentpos < this._buildingListstack.length - 1)
            return true;
        else
            return false;
    }
}
