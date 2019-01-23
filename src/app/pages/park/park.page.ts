import {Component, ViewChild} from '@angular/core';
import {NavController, AlertController} from '@ionic/angular';
import {GlobalData} from '../../providers/GlobalData';
import {Router} from '../../../../node_modules/@angular/router';
import {GridAreaComponent} from '../../components/grid-area/grid-area.page';
import {FixedToolbarComponent} from '../../components/fixed-toolbar/fixed-toolbar';


@Component({
    selector: 'app-park',
    templateUrl: './park.page.html',
    styleUrls: ['./park.page.scss'],
})
export class ParkPage {
    ispic: boolean = false;
    canmove: boolean = false;
    usebackground: boolean = false;
    usethumbnail: boolean = false;
    rowNum = 20;
    buildingList = [];
    pagename: string;
    inputPlaceHolder: string;
    showSetList: boolean = false;
    @ViewChild(GridAreaComponent) gridAreaComponent: GridAreaComponent;
    @ViewChild(FixedToolbarComponent) fixedtoolbarComponent: FixedToolbarComponent;

    constructor(
        private navCtrl: NavController,
        private globalData: GlobalData,
        private alertCtrl: AlertController,
        private router: Router
    ) {
        this.globalData.buildingList.forEach((item) => {
            console.log('页面', item.pagename);
            if (item.pagename == '主页') {
                this.pagename = item.pagename;
                this.inputPlaceHolder = '虚拟办公室、' + item.pagename;
                this.buildingList = item.buildingList;
                this.globalData.Gobuilding(item);
                console.log(this.globalData.buildingListstack);
            }
        });

    }

    goIndex() {
        this.navCtrl.navigateBack('home');
    }

    async newBuilding() {
        const prompt = await this.alertCtrl.create({
            header: '新建',
            inputs: [
                {
                    name: 'name',
                    type: 'text',
                    placeholder: '名称'
                },
                {
                    name: 'width',
                    type: 'text',
                    placeholder: '宽'
                },
                {
                    name: 'height',
                    type: 'text',
                    placeholder: '高'
                }
            ],
            buttons: [
                {
                    text: '取消',
                    handler: data => {

                    }
                },
                {
                    text: '确定',
                    handler: data => {
                        this.buildingList.push({
                            name: data.name || '未命名',
                            width: data.width - 0 || 1,
                            height: data.height - 0 || 1,
                            left: 0,
                            top: 0,
                            isblock: false
                        });
                    }
                }
            ]
        });
        await prompt.present();
    }

    changestack(e) {
        console.log('111111111' + this.globalData.currentpos);
        console.log(e);
        this.buildingList = e.buildingList;
        this.inputPlaceHolder = '虚拟办公室、' + e.pagename;
        this.pagename = e.pagename;
    }

    parkbuilding() {
        this.router.navigate(['parkbuilding'], {
            queryParams: {
                pagename: this.pagename
            }
        });
        this.fixedtoolbarComponent.showSetList = false;
    }

    toConnectedOffice(e) {
        this.router.navigate(['connected-office']);
    }

    showgrid() {
        this.usebackground = !this.usebackground;
        console.log(this.gridAreaComponent);
        this.gridAreaComponent.setgrid(this.usebackground);
    }

    showlist() {
        this.fixedtoolbarComponent.showSetList = false;
    }

}
