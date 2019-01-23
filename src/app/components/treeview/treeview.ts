import { Component, Input} from '@angular/core';
import { GlobalData } from '../../providers/GlobalData';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '../../../../node_modules/@ionic/angular';

@Component({
  selector: 'treeview',
  templateUrl: './treeview.html',
  styleUrls: ['./treeview.scss'],
})
export class TreeviewComponent {
    @Input() partArray = [];
    @Input() keyword: any;
    constructor(public popover: PopoverController, public modal: ModalController, public router: Router, public globaldata: GlobalData) {
        
    }
    
    //转化成树形结构，返回值，以便复用
    setData(item) {
        let node = this.transDate(item, 'id', 'parentid');
        return node;
    }
    //转换数据格式
    transDate(list, idstr, pidstr) {
        var result = [], temp = {};
        for (var i = 0; i < list.length; i++) {
            temp[list[i][idstr]] = list[i];//将nodes数组转成对象类型  
        }
        for (var j = 0; j < list.length; j++) {
            var tempVp = temp[list[j][pidstr]]; //获取每一个子对象的父对象  
            if (tempVp) {//判断父对象是否存在，如果不存在直接将对象放到第一层  
                if (!tempVp["nodes"]) tempVp["nodes"] = [];//如果父元素的nodes对象不存在，则创建数组  
                tempVp["nodes"].push(list[j]);//将本对象压入父对象的nodes数组  
                list[j].parent = tempVp;
                list[j].self = this;  //将self指向始终保持指向第一个模块
            } else {
                result.push(list[j]);//将不存在父对象的对象直接放入一级目录  
                list[j].parent = null;
                list[j].self = this;
            }
        }
        return result;
    }

    getboxnum(item) {
        let boxArray = [];
        if (item.parentid != null && item.level != 1) {
           
            for (var i = 1; i < item.level; i++) {

                boxArray.push(i);
            }
        }
        
        return boxArray;
    }
}
