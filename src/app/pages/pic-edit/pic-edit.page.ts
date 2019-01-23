import {Component,OnInit, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-pic-edit',
    templateUrl: './pic-edit.html',
    styleUrls: ['./pic-edit.scss'],
})
export class PiceditPage implements OnInit {
    type = "single";
    showsplit = false;
    showmerge = false;
    hascut = false;
    rownum = 2;
    colnum = 2;
    canvas;
    ctx;
    rowlines = [];
    collines = [];
    selectlines = [];
    currentdirection;
    selectnode1;
    selectnode2;
    multiselectnode1;
    multiselectnode2;
    startpoint = undefined;//储存生成lines的起点
    height;
    width;
    oW;
    oH;
    fields = [];//如果名字有重复的，则可以根据这个数组寻找。
    deviceWidth;
    deviceHeight;
    canvasleft = 0;
    canvastop = 0;
    item = "grid";

    constructor(public eleRef: ElementRef, public router: Router, public route: ActivatedRoute) {
        this.width = 1000;
        this.height = 1000;
        this.deviceWidth = window.innerWidth;
        this.deviceHeight = window.innerHeight;
    }
    ngOnInit() {
        //**排序**//
        this.rowlines.push({ pos: 0, lines: [{ startindex: 0, endindex: 1 }] });
        this.rowlines.push({ pos: this.height, lines: [{ startindex: 0, endindex: 1 }] });

        this.collines.push({ pos: 0, lines: [{ startindex: 0, endindex: 1 }] });;
        this.collines.push({ pos: this.width, lines: [{ startindex: 0, endindex: 1 }] });

        this.insertrowlines(200, [{ startindex: 0, endindex: 1 }]);
        this.insertcollines(200, [{ startindex: 0, endindex: 2 }]);

        this.drawlines();
    }
    drawlines() {
        this.canvas = this.eleRef.nativeElement.querySelector('#drawline');//初始化img面积
        this.canvas.height = this.height;
        this.canvas.width = this.width;
        this.ctx = this.canvas.getContext("2d");

        for (let i = 0; i < this.collines.length; i++) {//画列
            for (let j = 0; j < this.collines[i].lines.length; j++) {
                this.ctx.moveTo(this.collines[i].pos, this.rowlines[this.collines[i].lines[j].startindex].pos);
                this.ctx.lineTo(this.collines[i].pos, this.rowlines[this.collines[i].lines[j].endindex].pos);
            }
        }
        for (let i = 0; i < this.rowlines.length; i++) {//画行
            for (let j = 0; j < this.rowlines[i].lines.length; j++) {
                this.ctx.moveTo(this.collines[this.rowlines[i].lines[j].startindex].pos, this.rowlines[i].pos);
                this.ctx.lineTo(this.collines[this.rowlines[i].lines[j].endindex].pos, this.rowlines[i].pos);
            }
        }
        this.ctx.strokeStyle = "#666";
        this.ctx.stroke();
    }

    insertrowlines(pos, lines) {
        //console.log(lines);
        for (let i = 0; i < this.rowlines.length; i++) {
            if (this.rowlines[i].pos > pos) {
                //更改原有线大于当前插入线的index
                for (let m = 0; m < this.collines.length; m++) {
                    for (let k = 0; k < this.collines[m].lines.length; k++) {
                        if (this.collines[m].lines[k].startindex >= i) {
                            this.collines[m].lines[k].startindex = this.collines[m].lines[k].startindex + 1;
                        }
                        if (this.collines[m].lines[k].endindex >= i) {
                            this.collines[m].lines[k].endindex = this.collines[m].lines[k].endindex + 1;
                        }
                    }
                }
                let rowline = { pos: pos, lines: [] };
                //console.log(this.collines);
                //console.log(this.rowlines);
                //console.log(i);
                this.rowlines.splice(i, 0, rowline);
                //准备插入线段
                for (let m = 0; m < lines.length; m++) {
                    let startindex = lines[m].startindex;
                    for (let k = lines[m].startindex; k <= lines[m].endindex; k++) {
                        for (let n = 0; n < this.collines[k].lines.length; n++) {
                            if (this.collines[k].lines[n].startindex < i && this.collines[k].lines[n].endindex > i) {
                                //
                                let line = { startindex: i, endindex: this.collines[k].lines[n].endindex };//拆解线段-->
                                this.collines[k].lines.splice(n + 1, 0, line);
                                this.collines[k].lines[n].endindex = i;
                                //插入线段
                                if (k != startindex) {
                                    this.rowlines[i].lines.push({ startindex: startindex, endindex: k })
                                    startindex = k;
                                }
                                break;
                            }
                        }
                    }
                }

                break;
            }//插入部分线段
            else if (this.rowlines[i].pos == pos) {
                for (let m = 0; m < lines.length; m++) {
                    let startindex = lines[m].startindex;
                    for (let k = lines[m].startindex; k <= lines[m].endindex; k++) {
                        console.log(k);
                        for (let n = 0; n < this.collines[k].lines.length; n++) {
                            if (this.collines[k].lines[n].startindex < i && this.collines[k].lines[n].endindex > i) {
                                let line = { startindex: i, endindex: this.collines[k].lines[n].endindex };//拆解线段
                                this.collines[k].lines.splice(n + 1, 0, line);
                                this.collines[k].lines[n].endindex = i;
                                console.log('拆解')
                                //插入线段
                                console.log(k, startindex)
                                if (k != startindex) {
                                    //这里push位置待定
                                    //**//
                                    console.log('push');
                                    this.rowlines[i].lines.push({ startindex: startindex, endindex: k })
                                    console.log(this.rowlines[i].lines);
                                    startindex = k;
                                }
                                break;
                            } else if (this.collines[k].lines[n].startindex == i) {//确定在线上,且不用拆线,然后push
                                if (k != startindex) {
                                    //这里push位置待定
                                    //**//
                                    //console.log('push');
                                    //this.rowlines[i].lines.push({ startindex: startindex, endindex: k });

                                    this.rowlines[i].lines.splice(startindex, 0, { startindex: startindex, endindex: k });
                                    startindex = k;
                                }
                                break;
                            }
                        }
                    }
                }
                //this.collines[i] = this.sortlines(this.collines[i].lines);
                //let array = [];
                //for (let m = 0; m < this.rowlines[i].lines.length; m++) {
                //    for (let k = 0; k < this.rowlines[i].lines.length; k++) {

                //        if (this.rowlines[i].lines[k].startindex == m) {
                //            array.push(this.rowlines[i].lines[k]);
                //        }
                //    }
                //}
                //console.log(array);
                //this.rowlines[i].lines = array;
                break;
            }
        }
    }

    insertcollines(pos, lines) {
        for (let i = 0; i < this.collines.length; i++) {
            if (this.collines[i].pos > pos) {
                //更改原有线大于当前插入线的index
                for (let m = 0; m < this.rowlines.length; m++) {
                    for (let k = 0; k < this.rowlines[m].lines.length; k++) {
                        if (this.rowlines[m].lines[k].startindex >= i) {
                            this.rowlines[m].lines[k].startindex = this.rowlines[m].lines[k].startindex + 1;
                        }
                        if (this.rowlines[m].lines[k].endindex >= i) {
                            this.rowlines[m].lines[k].endindex = this.rowlines[m].lines[k].endindex + 1;
                        }
                    }
                }
                let colline = { pos: pos, lines: [] };
                //console.log(this.collines);
                //console.log(this.rowlines);
                //console.log(i);
                this.collines.splice(i, 0, colline);
                //准备插入线段
                for (let m = 0; m < lines.length; m++) {
                    let startindex = lines[m].startindex;
                    for (let k = lines[m].startindex; k <= lines[m].endindex; k++) {
                        for (let n = 0; n < this.rowlines[k].lines.length; n++) {
                            if (this.rowlines[k].lines[n].startindex < i && this.rowlines[k].lines[n].endindex > i) {
                                //
                                let line = { startindex: i, endindex: this.rowlines[k].lines[n].endindex };//拆解线段-->
                                this.rowlines[k].lines.splice(n + 1, 0, line);
                                this.rowlines[k].lines[n].endindex = i;
                                //插入线段
                                if (k != startindex) {
                                    this.collines[i].lines.push({ startindex: startindex, endindex: k })
                                    startindex = k;
                                }
                                break;
                            }
                        }
                    }
                }

                break;
            }//插入部分线段
            else if (this.collines[i].pos == pos) {

                for (let m = 0; m < lines.length; m++) {
                    let startindex = lines[m].startindex;
                    for (let k = lines[m].startindex; k <= lines[m].endindex; k++) {
                        for (let n = 0; n < this.rowlines[k].lines.length; n++) {
                            if (this.rowlines[k].lines[n].startindex < i && this.rowlines[k].lines[n].endindex > i) {
                                let line = { startindex: i, endindex: this.rowlines[k].lines[n].endindex };//拆解线段
                                this.rowlines[k].lines.splice(n + 1, 0, line);
                                this.rowlines[k].lines[n].endindex = i;
                                //插入线段
                                if (k != startindex) {
                                    //这里push位置待定
                                    //**//
                                    this.collines[i].lines.push({ startindex: startindex, endindex: k })
                                    startindex = k;
                                }
                                break;
                            } else if (this.rowlines[k].lines[n].startindex == i) {//确定在线上,且不用拆线,然后push
                                if (k != startindex) {
                                    //这里push位置待定
                                    //**//
                                    //console.log('push');
                                    //this.collines[i].lines.push({ startindex: startindex, endindex: k })
                                    this.collines[i].lines.splice(startindex, 0, { startindex: startindex, endindex: k });
                                    startindex = k;
                                }
                                break;
                            }
                        }
                    }
                }

                break;
            }
        }
    }

    removerowlines(pos, lines) {//删除线只能一根一根删除

        for (let i = 0; i < this.rowlines.length; i++) {
            if (this.rowlines[i].pos == pos) {
                for (let j = 0; j < lines.length; j++) {
                    let index = this.getlineindex(this.rowlines[i].lines, lines[j]);
                    if (index == -1) {
                        console.log('find err');
                        return;
                    }
                    let startcolline = this.collines[this.rowlines[i].lines[index].startindex];
                    let endcolline = this.collines[this.rowlines[i].lines[index].endindex];
                    for (let k = 0; k < startcolline.lines.length - 1; k++) {
                        //***//
                        if (!this.ctx.isPointInStroke(startcolline.pos - 1, pos)) {
                            if (startcolline.lines[k].endindex == i && startcolline.lines[k + 1].startindex == i) {
                                //拉升前面的线段；
                                startcolline.lines[k].endindex = startcolline.lines[k + 1].endindex;
                                //去掉后面的线段；
                                startcolline.lines.splice(k + 1, 1);
                                break;

                            };
                        }
                    }
                    for (let k = 0; k < endcolline.lines.length - 1; k++) {
                        //***//
                        if (!this.ctx.isPointInStroke(endcolline.pos + 1, pos)) {
                            if (endcolline.lines[k].endindex == i && endcolline.lines[k + 1].startindex == i) {
                                //拉升前面的线段；
                                endcolline.lines[k].endindex = endcolline.lines[k + 1].endindex;
                                //去掉后面的线段；
                                endcolline.lines.splice(k + 1, 1);
                                break;

                            };
                        }
                    }
                    this.rowlines[i].lines.splice(index, 1);
                }
                //当行线没有线段了，则移除整条行线
                if (this.rowlines[i].lines.length == 0) {
                    //查找列线中startindex以及endindex 大于i的全部减1
                    this.rowlines.splice(i, 1);
                    for (let m = 0; m < this.collines.length; m++) {
                        for (let k = 0; k < this.collines[m].lines.length; k++) {
                            if (this.collines[m].lines[k].startindex > i) {
                                this.collines[m].lines[k].startindex = this.collines[m].lines[k].startindex - 1;
                            }
                            if (this.collines[m].lines[k].endindex > i) {
                                this.collines[m].lines[k].endindex = this.collines[m].lines[k].endindex - 1;
                            }
                        }
                    }
                }
                break;
            }
        }
    }

    removecollines(pos, lines) {//删除线只能一根一根删除

        for (let i = 0; i < this.collines.length; i++) {
            //console.log(this.collines[i].pos,pos)
            if (this.collines[i].pos == pos) {
                for (let j = 0; j < lines.length; j++) {
                    let index = this.getlineindex(this.collines[i].lines, lines[j]);

                    let startrowline = this.rowlines[this.collines[i].lines[index].startindex];
                    let endrowline = this.rowlines[this.collines[i].lines[index].endindex];

                    console.log(index);
                    if (index == -1) {
                        console.log('find err');
                        return;
                    }

                    for (let k = 0; k < startrowline.lines.length - 1; k++) {//-1是为了如果删除最右竖线,则不需要任何操作。
                        //***//
                        console.log(this.ctx.isPointInStroke(pos, startrowline.pos - 1));
                        if (!this.ctx.isPointInStroke(pos, startrowline.pos - 1)) {//为了竖线最上端如果有线则不合并
                            //console.log(pos, endrowline.pos);
                            if (startrowline.lines[k].endindex == i && startrowline.lines[k + 1].startindex == i) {
                                //console.log(k);
                                //拉升前面的线段；
                                startrowline.lines[k].endindex = startrowline.lines[k + 1].endindex;
                                //去掉后面的线段；
                                startrowline.lines.splice(k + 1, 1);
                                break;

                            };
                        } else {
                            break;
                        }
                    }
                    for (let k = 0; k < endrowline.lines.length - 1; k++) {

                        //***//
                        console.log(this.ctx.isPointInStroke(pos, endrowline.pos + 1));
                        if (!this.ctx.isPointInStroke(pos, endrowline.pos + 1)) {
                            //console.log(pos, endrowline.pos);
                            if (endrowline.lines[k].endindex == i && endrowline.lines[k + 1].startindex == i) {
                                //拉升前面的线段；
                                //console.log(k);

                                endrowline.lines[k].endindex = endrowline.lines[k + 1].endindex;
                                //去掉后面的线段；
                                endrowline.lines.splice(k + 1, 1);
                                break;

                            };
                        } else {
                            break;
                        }

                    }
                    this.collines[i].lines.splice(index, 1);
                }
                //当列线没有线段了，则移除整条列线
                if (this.collines[i].lines.length == 0) {
                    //查找列线中startindex以及endindex 大于i的全部减1
                    console.log('没线了');
                    this.collines.splice(i, 1);
                    for (let m = 0; m < this.rowlines.length; m++) {
                        for (let k = 0; k < this.rowlines[m].lines.length; k++) {
                            if (this.rowlines[m].lines[k].startindex > i) {
                                this.rowlines[m].lines[k].startindex = this.rowlines[m].lines[k].startindex - 1;
                            }
                            if (this.rowlines[m].lines[k].endindex > i) {
                                this.rowlines[m].lines[k].endindex = this.rowlines[m].lines[k].endindex - 1;
                            }
                        }
                    }
                }
                break;
            }
        }
    }

    getlineindex(lines, line) {
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startindex == line.startindex && lines[i].endindex == line.endindex) {
                return i;
            }
        }
        return -1;
    }

    drawwithnum(node1, node2, rownum: number, colnum: number) {

        let widthsize = Math.floor((node2[0] - node1[0]) / colnum);
        let heightsize = Math.floor((node2[1] - node1[1]) / rownum);
        //console.log(widthsize, heightsize);
        for (let i = 1; i < rownum; i++) {//画行
            let rowlines = [];
            rowlines = [{ startindex: this.findindexwithpos('col', node1[0]), endindex: this.findindexwithpos('col', node2[0]) }];
            //console.log(node1[1] + heightsize * i, rowlines);
            this.insertrowlines(node1[1] + heightsize * i, rowlines);
        }
        for (let i = 1; i < colnum; i++) {//画列
            let collines = [];
            collines = [{ startindex: this.findindexwithpos('row', node1[1]), endindex: this.findindexwithpos('row', node2[1]) }];
            //console.log(node1[0] + widthsize * i, collines);
            this.insertcollines(node1[0] + widthsize * i, collines);
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawlines();
    }

    findindexwithpos(type, number): number {
        switch (type) {
            case 'row':
                for (let i = 0; i < this.rowlines.length; i++) {
                    if (this.rowlines[i].pos == number) {
                        return i;
                        break;
                    }
                }
                break
            case 'col':
                for (let i = 0; i < this.collines.length; i++) {
                    if (this.collines[i].pos == number) {
                        return i;
                        break;
                    }
                }
                break;
        }
    }

    select(e) {
        switch (this.type) {
            case 'single':
                let number = this.singleselect(e, "#ffd800");
                if (number == -1) {
                    break;
                }
                this.showsplit = true;
                this.showmerge = false;
                //为了方便合并操作
                this.multiselectnode1 = this.selectnode1;
                this.multiselectnode2 = this.selectnode2;
                break;
        }
    }

    singleselect(e,color) {
        //console.log(e)
        console.log(e.clientX, this.canvas.offsetLeft)
        let x1 = Math.ceil(e.clientX - this.canvas.offsetLeft);
        console.log(e.clientY, this.canvas.offsetTop)
        let y1 = Math.ceil(e.clientY - this.canvas.offsetTop);
        if (y1 < 0 || y1 > this.canvas.height) {
            return -1;
        }
        console.log('x,y', x1, y1);
        let x2 = x1;
        let y2 = y1;
        let x3 = x1;
        let y3 = y1;
        let x4 = x1;
        let y4 = y1;
        while (!this.ctx.isPointInStroke(x1, y1)) {//左
            x1--;
        }
        while (!this.ctx.isPointInStroke(x2, y2)) {//上
            y2--;
        }
        while (!this.ctx.isPointInStroke(x3, y3)) {//右
            x3++;
        }
        while (!this.ctx.isPointInStroke(x4, y4)) {//下
            y4++;
        }
        //console.log('左', x1, '上', y2, '右', x3, '下', y4);//这是选择的区域的左上右下。
        this.selectnode1 = [x1, y2];
        this.selectnode2 = [x3, y4];
        let canvas = this.eleRef.nativeElement.querySelector('#selectcanvas');//根据点击位置选择此块区域的正方形
        let ctx = canvas.getContext("2d");
        canvas.height = this.height;
        canvas.width = this.width;
        canvas.style.left = this.canvasleft + "px";
        canvas.style.top = this.canvastop + "px";
        ctx.beginPath();
        ctx.moveTo(x1, y2);
        ctx.lineTo(x3, y2); //上方边

        ctx.moveTo(x3, y2);
        ctx.lineTo(x3, y4);//右方边

        ctx.moveTo(x3, y4);
        ctx.lineTo(x1, y4);//下方边

        ctx.moveTo(x1, y4);
        ctx.lineTo(x1, y2);//左方边

        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    }

    touchStart(e,segment?,content?) {

        console.log('start');
        let touches = e.touches[0];
        switch (this.type) {
            case undefined:
                //console.log('type undifiend');
                //console.log( touches.clientX, this.canvas.offsetLeft);
                this.oW = touches.clientX - this.canvas.offsetLeft;
                //console.log(touches.clientY, this.canvas.offsetTop);
                this.oH = touches.clientY - this.canvas.offsetTop;
                //console.log('ow', this.oW, 'oh', this.oH);
                break;
            case 'multiple':
                let x1 = Math.ceil(touches.clientX - this.canvas.getBoundingClientRect().left);
                let y1 = Math.ceil(touches.clientY - this.canvas.getBoundingClientRect().top);
                let x2 = x1;
                let y2 = y1;
                if (x1 < 0 || y1 < 0) {
                    return
                }
                while (!this.ctx.isPointInStroke(x1, y1)) {//左
                    x1--;
                    if (x1 == -10) {
                        break;
                    }
                }
                while (!this.ctx.isPointInStroke(x2, y2)) {//上
                    y2--;
                    if (y2 == -10) {
                        break;
                    }
                }
                this.multiselectnode1 = [x1, y2];

                break;
            case 'line':

                let canvas = this.eleRef.nativeElement.querySelector('#selectcanvas');//根据点击位置选择此块区域的正方形
                let ctx = canvas.getContext("2d");
                canvas.height = this.height;
                canvas.width = this.width;
                canvas.style.left = this.canvasleft + "px";
                canvas.style.top = this.canvastop + "px";
                let m1 = Math.ceil(touches.clientX - this.canvas.getBoundingClientRect().left);
                let n1 = Math.ceil(touches.clientY - this.canvas.getBoundingClientRect().top);
                if (m1 < 0 || n1 < 0 || m1 > this.canvas.width || n1 > this.canvas.height) {
                    return
                }
                console.log('点击的点', m1, n1);
                let nearnode = this.findnearnode(m1, n1);//竖线优先
                console.log('nearnode', nearnode);
                if (nearnode != undefined && nearnode[0] != 0 && nearnode[0] != this.width && nearnode[1] != 0 && nearnode[1] != this.height) {                      //根据点 -》 线。
                    for (let i = 0; i < this.rowlines.length; i++) {
                        for (let j = 0; j < this.rowlines[i].lines.length; j++) {

                            if (this.findlinewithnode(i, j, nearnode, 'row')) {
                                //console.log('find it', this.rowlines[i][j], this.nearnodeend);
                                //每次压入时要判断 选择线段数组最外一个 是否与此数组相等
                                if (this.selectlines.length == 0) {
                                    this.selectlines.push([i, j]);
                                    this.currentdirection = 'row';
                                }
                            };
                        }
                    }
                    for (let i = 0; i < this.collines.length; i++) {
                        for (let j = 0; j < this.collines[i].lines.length; j++) {

                            if (this.findlinewithnode(i, j, nearnode, 'col')) {
                                //console.log('find it', this.collines[i][j], this.nearnodeend);
                                if (this.selectlines.length == 0) {
                                    this.selectlines.push([i, j]);
                                    this.currentdirection = 'col';
                                }
                            };
                        }
                    }
                    //很重要
                    //console.log(this.selectlines);
                    this.selectlines.forEach((value) => {
                        let i = value[0];
                        let j = value[1];//i,j代表第几行
                        switch (this.currentdirection) {
                            case 'row':
                                ctx.moveTo(this.collines[this.rowlines[i].lines[j].startindex].pos, this.rowlines[i].pos);
                                ctx.lineTo(this.collines[this.rowlines[i].lines[j].endindex].pos, this.rowlines[i].pos);
                                break;
                            case 'col':
                                ctx.moveTo(this.collines[i].pos, this.rowlines[this.collines[i].lines[j].startindex].pos);
                                ctx.lineTo(this.collines[i].pos, this.rowlines[this.collines[i].lines[j].endindex].pos);
                                break;
                        }

                    })
                    ctx.strokeStyle = "#ffd800";
                    ctx.lineWidth = 4;
                    ctx.stroke();
                }
                //初始化selectlines
                break;
        }
    }

    touchMove(e) {
        console.log('move');
        let touches = e.touches[0];
        switch (this.type) {
            case undefined:
                //console.log('type undifined')
                let o_Left = touches.clientX - this.oW;
                let o_Top = touches.clientY - this.oH;
                let width = this.deviceWidth > this.width ? 0 : this.deviceWidth - this.width;
                let height = this.deviceHeight > this.height ? 0 : this.deviceHeight - this.height;

                if (o_Left > 0) {
                    o_Left = 0;
                } else if (o_Left < width-10) {
                    o_Left = width-10;
                }
                if (o_Top > 0) {
                    o_Top = 0;
                } else if (o_Top < height-220) {
                    o_Top = height-220;
                }
                //console.log(o_Left, o_Top);
                this.canvas.style.left = o_Left + "px";
                this.canvas.style.top = o_Top + "px";
                this.canvasleft = o_Left;
                this.canvastop = o_Top;
                break;
            case 'multiple':
                //调整页面移动
                if (touches.clientX > this.deviceWidth - 50) {//左右
                    this.canvasleft = this.canvasleft - 5;
                    if (this.canvasleft < - this.width -10 + this.deviceWidth) {
                        this.canvasleft = -this.width - 10 + this.deviceWidth;
                    }
                    
                } else if (touches.clientX <50) {
                    this.canvasleft = this.canvasleft + 5;
                    if (this.canvasleft >0) {
                        this.canvasleft = 0;                 //拖动到端点有问题
                    }
                }

                if (touches.clientY > this.deviceHeight - 150) {//上下
                    this.canvastop = this.canvastop - 5;
                    if (this.canvastop < -this.height - 10 + 448) {
                        this.canvastop = -this.height - 10 + 448;
                    }
                } else if (touches.clientY < 80) {
                    this.canvastop = this.canvastop + 5;
                    if (this.canvastop > 0) {
                        this.canvastop = 0;
                    }
                }

                let mulcanvas = this.eleRef.nativeElement.querySelector('#selectcanvas');//根据点击位置选择此块区域的正方形
                let mulctx = mulcanvas.getContext("2d");
                mulcanvas.height = this.height;
                mulcanvas.width = this.width;
                this.canvas.style.left = mulcanvas.style.left = this.canvasleft + "px"; //多选和线框2种类型需要保持 2个canvas保持一致
                this.canvas.style.top = mulcanvas.style.top = this.canvastop + "px";
                

                let x3 = Math.ceil(touches.clientX - mulcanvas.getBoundingClientRect().left);
                let y3 = Math.ceil(touches.clientY - mulcanvas.getBoundingClientRect().top);
                let x4 = x3;
                let y4 = y3;
                if (x3 < 0 || y3 < 0) {
                    return
                }
                while (!this.ctx.isPointInStroke(x3, y3)) {//右
                    x3++;
                    if (x3 == 2000) {
                        break;
                    }
                }
                while (!this.ctx.isPointInStroke(x4, y4)) {//下
                    y4++;
                    if (y4 == 2000) {
                        break;
                    }
                }
                this.multiselectnode2 = [x3, y4];

                //this.multiselectnode1[0]-->x1,this.multiselectnode1[1]-->y2,
                //this.multiselectnode2[0]-- > x3, this.multiselectnode2[1] ==> y4
                mulctx.moveTo(this.multiselectnode1[0], this.multiselectnode1[1]);
                mulctx.lineTo(this.multiselectnode2[0], this.multiselectnode1[1]); //上方边

                mulctx.moveTo(this.multiselectnode2[0], this.multiselectnode1[1]);
                mulctx.lineTo(this.multiselectnode2[0], this.multiselectnode2[1]);//右方边

                mulctx.moveTo(this.multiselectnode2[0], this.multiselectnode2[1]);
                mulctx.lineTo(this.multiselectnode1[0], this.multiselectnode2[1]);//下方边

                mulctx.moveTo(this.multiselectnode1[0], this.multiselectnode2[1]);
                mulctx.lineTo(this.multiselectnode1[0], this.multiselectnode1[1]);//左方边
                mulctx.lineWidth = 4;
                mulctx.strokeStyle = "#ffd800";
                mulctx.stroke();
                break;
            case 'line':
                let canvas = this.eleRef.nativeElement.querySelector('#selectcanvas');//根据点击位置选择此块区域的正方形
                let ctx = canvas.getContext("2d");
                canvas.height = this.height;
                canvas.width = this.width;
                canvas.style.left = this.canvasleft + "px";
                canvas.style.top = this.canvastop + "px";
                let m1 = Math.ceil(touches.clientX - canvas.getBoundingClientRect().left);
                let n1 = Math.ceil(touches.clientY - canvas.getBoundingClientRect().top);
                if (m1 < 0 || n1 < 0) {
                    return
                }
                //console.log(m1, n1);
                let nearnode = this.findnearnode(m1, n1);//竖线优先
                //console.log(this.nearnodeend);
                if (nearnode != undefined && nearnode[0] != 0 && nearnode[0] != this.width && nearnode[1] != 0 && nearnode[1] != this.height) {                      //根据点 -》 线。
                    for (let i = 0; i < this.rowlines.length; i++) {
                        for (let j = 0; j < this.rowlines[i].lines.length; j++) {
                            if (this.findlinewithnode(i, j, nearnode, 'row')) {

                                if (this.selectlines[this.selectlines.length - 1].toString() != [i, j].toString()) {
                                    if (this.currentdirection == 'row') {
                                        this.selectlines.push([i, j]);
                                    }

                                }
                            };
                        }
                    }
                    for (let i = 0; i < this.collines.length; i++) {
                        for (let j = 0; j < this.collines[i].lines.length; j++) {
                            if (this.findlinewithnode(i, j, nearnode, 'col')) {

                                if (this.selectlines[this.selectlines.length - 1].toString() != [i, j].toString()) {

                                    if (this.currentdirection == 'col') {
                                        this.selectlines.push([i, j]);
                                    }
                                }
                            };
                        }
                    }
                    //很重要
                    this.selectlines.forEach((value) => {
                        let i = value[0];
                        let j = value[1];//i,j代表第几行
                        switch (this.currentdirection) {
                            case 'row':
                                ctx.moveTo(this.collines[this.rowlines[i].lines[j].startindex].pos, this.rowlines[i].pos);
                                ctx.lineTo(this.collines[this.rowlines[i].lines[j].endindex].pos, this.rowlines[i].pos);
                                break;
                            case 'col':
                                ctx.moveTo(this.collines[i].pos, this.rowlines[this.collines[i].lines[j].startindex].pos);
                                ctx.lineTo(this.collines[i].pos, this.rowlines[this.collines[i].lines[j].endindex].pos);
                                break;
                        }
                    })
                }
                ctx.strokeStyle = "#ffd800";
                ctx.lineWidth = 4;
                ctx.stroke();
                break;
            case 'moveline':
                let mlcanvas = this.eleRef.nativeElement.querySelector('#selectcanvas');//根据点击位置选择此块区域的正方形
                let mlctx = mlcanvas.getContext("2d");
                mlcanvas.height = this.height;
                mlcanvas.width = this.width;
                mlcanvas.style.left = this.canvasleft + "px";
                mlcanvas.style.top = this.canvastop + "px";
                let x = Math.ceil(touches.clientX - mlcanvas.getBoundingClientRect().left);
                let y = Math.ceil(touches.clientY - mlcanvas.getBoundingClientRect().top);
                if (this.selectlines.length != 0) {

                    let i = this.selectlines[0][0];
                    let j_first = this.selectlines[0][1];
                    let j_last = this.selectlines[this.selectlines.length - 1][1];

                    switch (this.currentdirection) {
                        case 'row':
                            //限制移动条件
                            mlctx.moveTo(this.collines[this.rowlines[i].lines[j_first].startindex].pos, y);
                            mlctx.lineTo(this.collines[this.rowlines[i].lines[j_last].endindex].pos, y);

                            break;
                        case 'col':
                            //限制移动条件
                            mlctx.moveTo(x, this.rowlines[this.collines[i].lines[j_first].startindex].pos);
                            mlctx.lineTo(x, this.rowlines[this.collines[i].lines[j_last].endindex].pos);

                            break;
                    }

                }
                mlctx.strokeStyle = "#ffd800";
                mlctx.lineWidth = 4;
                mlctx.stroke();
                break
        }
    }

    touchEnd(e) {
        let touches = e.changedTouches[0];
        let x = Math.ceil(touches.clientX - this.canvas.getBoundingClientRect().left);
        let y = Math.ceil(touches.clientY - this.canvas.getBoundingClientRect().top);
        console.log('end');
        switch (this.type) {
            case 'line':
                this.type = 'moveline';
                break;
            case 'moveline':
                if (this.selectlines.length != 0) {
                    console.log('xy', x, y);
                    let LR = this.canmove();//能移动返回 前后距离数组 ,否则返回-1
                    console.log(LR);
                    if (LR==-1) {//如果不可移动,则不做删除添加线
                        this.switchtype('line');
                        this.clearallcanvas();
                        break;
                    }
                    let i = this.selectlines[0][0];
                    let j_first = this.selectlines[0][1];
                    
                    let j_last = this.selectlines[this.selectlines.length - 1][1];
                    switch (this.currentdirection) {
                        case 'row':
                            if (y < this.rowlines[i].pos - LR[0] || this.rowlines[i].pos + LR[1] < y) {
                                break
                            }

                            if (this.rowlines[i].lines.length == this.selectlines.length) {//处理整列的问题
                                this.rowlines[i].pos = y;
                                break
                            }

                            let rowindexlines = [];
                            for (let m = 0; m < this.selectlines.length; m++) {
                                let startindex = this.rowlines[i].lines[this.selectlines[m][1]].startindex;
                                let endindex = this.rowlines[i].lines[this.selectlines[m][1]].endindex;
                                rowindexlines.push({startindex,endindex})
                            }

                            rowindexlines.forEach((value) => {
                                this.removerowlines(this.rowlines[i].pos, [{ startindex: value.startindex, endindex: value.endindex }]);
                                this.drawlines();
                            })

                            let startindex_row = rowindexlines[0].startindex;
                            let endindex_row = rowindexlines[rowindexlines.length-1].endindex;
                            this.insertrowlines(y, [{ startindex: startindex_row, endindex: endindex_row }]);
                            break;
                        case 'col':
                            if (x < this.collines[i].pos - LR[0] || this.collines[i].pos + LR[1] < x) {
                                break
                            }

                            if (this.collines[i].lines.length == this.selectlines.length) {//处理整列的问题
                                this.collines[i].pos = x;
                                break
                            }

                            let colindexlines = [];
                            for (let m = 0; m < this.selectlines.length; m++) {
                                let startindex = this.collines[i].lines[this.selectlines[m][1]].startindex;
                                let endindex = this.collines[i].lines[this.selectlines[m][1]].endindex;
                                colindexlines.push({startindex,endindex});
                            }
                            console.log(j_first, j_last);
                            //在改动线之前处理断开问题
                            let saveArray = [];
                            for (let m = this.collines[i].lines[j_first].startindex+1; m < this.collines[i].lines[j_last].endindex; m++) {
                                console.log(m);
                                let PointY = this.rowlines[m].pos;
                                let PointX = this.collines[i].pos;
                                if (!this.ctx.isPointInStroke(PointX - 1, PointY) && this.ctx.isPointInStroke(PointX + 1, PointY)) {
                                    let direction = 'R';
                                    for (let l = 0; l < this.rowlines[m].lines.length; l++) {
                                        if (this.rowlines[m].lines[l].startindex == i) {
                                            saveArray.push({ direction, m ,l });
                                            break
                                        }
                                    } 
                                }
                                if (this.ctx.isPointInStroke(PointX - 1, PointY) && !this.ctx.isPointInStroke(PointX + 1, PointY)) {
                                    let direction = 'L';
                                    for (let l = 0; l < this.rowlines[m].lines.length; l++) {
                                        if (this.rowlines[m].lines[l].endindex == i) {
                                            saveArray.push({ direction, m, l });
                                            break
                                        }
                                    }
                                }
                            }
                            colindexlines.forEach((value) => {
                                this.removecollines(this.collines[i].pos, [{ startindex: value.startindex, endindex: value.endindex }]);
                                this.drawlines();
                            })
                            let startindex_col = colindexlines[0].startindex;
                            let endindex_col = colindexlines[colindexlines.length-1].endindex;
                            this.insertcollines(x, [{ startindex: startindex_col, endindex: endindex_col }]);
                            this.drawlines();

                            //处理移动线段中间部分 断开 问题
                            saveArray.forEach((value) => {
                                for (let n = 0; n < this.collines.length; n++) {
                                    if (this.collines[n].pos == x) {
                                        let startindex = this.rowlines[value.m].lines[value.l].startindex;
                                        let endindex = this.rowlines[value.m].lines[value.l].endindex;
                                        console.log(this.rowlines[value.m].pos, 'startindex', startindex, 'endindex', endindex);
                                        this.removerowlines(this.rowlines[value.m].pos, [{ startindex: startindex, endindex: endindex }]);
                                        this.drawlines();
                                        console.log(this.rowlines[value.m].pos, 'n', n, 'endindex', endindex);
                                        if (value.direction == "L") {
                                            this.insertrowlines(this.rowlines[value.m].pos, [{ startindex: startindex, endindex: n }]);
                                        } else {
                                            this.insertrowlines(this.rowlines[value.m].pos, [{ startindex: n, endindex: endindex }]);
                                        }
                                       
                                        this.drawlines();
                                        break;
                                    }
                                }
                            })
                            break;
                    }
                    this.drawlines();
                }
                this.switchtype('line');
                this.clearallcanvas();
                break;
        }
    }

    Isrepetivewithname(name) {
        let number;
        for (let i = 0; i < this.fields.length; i++) {
            if (this.fields[i].name == name) {
                number = i;
                break
            }
        }
        if (number) {
            return number;
        } else {
            return -1;
        }
        
    }

    getdistance(i, j, type) {
        let i_move;
        let middle: number;
        i_move = i;
        switch (type) {
            case 'top':
                let startindex_top = this.rowlines[i].lines[j].startindex;
                let endindex_top = this.rowlines[i].lines[j].endindex;
                middle = (parseInt(this.collines[startindex_top].pos) + parseInt(this.collines[endindex_top].pos)) / 2;
                while (i_move != 0) {
                    i_move--;
                    //console.log('middle', middle, 'i_move', i_move);
                    //console.log(this.rowlines[i_move].pos);
                    if (this.ctx.isPointInStroke(middle, this.rowlines[i_move].pos)) {
                        return i_move;
                        break
                    }
                }
                break
            case 'bottom':
                let startindex_bottom = this.rowlines[i].lines[j].startindex;
                let endindex_bottom = this.rowlines[i].lines[j].endindex;
                middle = (parseInt(this.collines[startindex_bottom].pos) + parseInt(this.collines[endindex_bottom].pos)) / 2;
                while (i_move != 0) {
                    i_move++;
                    //console.log('middle', middle, 'i_move', i_move);
                    //console.log(this.rowlines[i_move].pos);
                    if (this.ctx.isPointInStroke(middle, this.rowlines[i_move].pos)) {
                        //return this.rowlines[i_move].pos - this.rowlines[i].pos;
                        return i_move;
                        break
                    }
                }
                break
            case 'left':
                let startindex_left = this.collines[i].lines[j].startindex;
                let endindex_left = this.collines[i].lines[j].endindex;
                middle = (parseInt(this.rowlines[startindex_left].pos) + parseInt(this.rowlines[endindex_left].pos)) / 2;
                while (i_move != 0) {
                    i_move--;
                    //console.log('middle', middle, 'i_move', i_move);
                    //console.log(this.rowlines[i_move].pos);
                    if (this.ctx.isPointInStroke(this.collines[i_move].pos,middle)) {
                        //return this.rowlines[i_move].pos - this.rowlines[i].pos;
                        return i_move;
                        break
                    }
                }
                break
            case 'right':
                let startindex_right = this.collines[i].lines[j].startindex;
                let endindex_right = this.collines[i].lines[j].endindex;
                middle = (parseInt(this.rowlines[startindex_right].pos) + parseInt(this.rowlines[endindex_right].pos)) / 2;
                while (i_move != 0) {
                    i_move++;
                    //console.log('middle', middle, 'i_move', i_move);
                    //console.log(this.rowlines[i_move].pos);
                    if (this.ctx.isPointInStroke(this.collines[i_move].pos, middle)) {
                        //return this.rowlines[i_move].pos - this.rowlines[i].pos;
                        return i_move;
                        break
                    }
                }
                break
        }
    }

    canmove() {//判断线是否可以移动
        let L_length;
        let R_length;
        let i_A, i_B;
        let i = this.selectlines[0][0];
        i_A = i_B = i;
        let j_first = this.selectlines[0][1];
        let j_last = this.selectlines[this.selectlines.length - 1][1];
        let topstartok = false;
        let topendok = false;
        let bottomstartok = false;
        let bottomendok = false;
        let leastfront = 2000;
        let leastend = 2000;
        switch (this.currentdirection) {
            case 'row':
                if (i == 0 || i == this.rowlines.length - 1) {
                    return -1;
                }
                ////前 //方法，1每段的方法找最短长度，2判断2个端点是否有index
                for (let m = 0; m < this.selectlines.length; m++) {
                    let j = this.selectlines[m][1];
                    let i_move_top = this.getdistance(i, j, 'top');
                    let i_move_bottom = this.getdistance(i, j, 'bottom');
                    let distance_top = Math.abs(this.rowlines[i_move_top].pos - this.rowlines[i].pos);
                    if (distance_top < leastfront) {
                        leastfront = distance_top;
                    }
                    let distance_bottom = Math.abs(this.rowlines[i_move_bottom].pos - this.rowlines[i].pos);
                    if (distance_bottom < leastend) {
                        leastend = distance_bottom;
                    }
                    if (m == 0) {
                        for (let k = 0; k < this.rowlines[i_move_top].lines.length; k++) {
                            if (this.rowlines[i_move_top].lines[k].startindex == this.rowlines[i].lines[j].startindex) {
                                topstartok = true;
                                break;
                            }
                        }
                        for (let k = 0; k < this.rowlines[i_move_bottom].lines.length; k++) {
                            if (this.rowlines[i_move_bottom].lines[k].startindex == this.rowlines[i].lines[j].startindex) {
                                bottomstartok = true;
                                break;
                            }
                        }
                    }
                    if (m == this.selectlines.length - 1) {
                        for (let k = 0; k < this.rowlines[i_move_top].lines.length; k++) {
                            if (this.rowlines[i_move_top].lines[k].endindex == this.rowlines[i].lines[j].endindex) {
                                topendok = true;
                                break;
                            }
                        }
                        for (let k = 0; k < this.rowlines[i_move_bottom].lines.length; k++) {
                            if (this.rowlines[i_move_bottom].lines[k].endindex == this.rowlines[i].lines[j].endindex) {
                                bottomendok = true;
                                break;
                            }
                        }
                    }
                }
                if (topstartok && bottomstartok && topendok && bottomendok) {
                    return [leastfront, leastend]
                } else {
                    return -1;
                }
                break;
            case 'col':
                if (i == 0 || i == this.collines.length - 1) {
                    return -1;
                }
                ////前 //方法，1每段的方法找最短长度，2判断2个端点是否有index
                for (let m = 0; m < this.selectlines.length; m++) {
                    let j = this.selectlines[m][1];
                    let i_move_left = this.getdistance(i, j, 'left');
                    let i_move_right = this.getdistance(i, j, 'right');
                    let distance_left = Math.abs(this.collines[i_move_left].pos - this.collines[i].pos);
                    if (distance_left < leastfront) {
                        leastfront = distance_left;
                    }
                    let distance_right = Math.abs(this.collines[i_move_right].pos - this.collines[i].pos);
                    if (distance_right < leastend) {
                        leastend = distance_right;
                    }
                    if (m == 0) {
                        for (let k = 0; k < this.collines[i_move_left].lines.length; k++) {
                            if (this.collines[i_move_left].lines[k].startindex == this.collines[i].lines[j].startindex) {
                                topstartok = true;
                                break;
                            }
                        }
                        for (let k = 0; k < this.collines[i_move_right].lines.length; k++) {
                            if (this.collines[i_move_right].lines[k].startindex == this.collines[i].lines[j].startindex) {
                                bottomstartok = true;
                                break;
                            }
                        }
                    }
                    if (m == this.selectlines.length - 1) {
                        for (let k = 0; k < this.collines[i_move_left].lines.length; k++) {
                            if (this.collines[i_move_left].lines[k].endindex == this.collines[i].lines[j].endindex) {
                                topendok = true;
                                break;
                            }
                        }
                        for (let k = 0; k < this.collines[i_move_right].lines.length; k++) {
                            if (this.collines[i_move_right].lines[k].endindex == this.collines[i].lines[j].endindex) {
                                bottomendok = true;
                                break;
                            }
                        }
                    }
                }
                if (topstartok && bottomstartok && topendok && bottomendok) {
                    return [leastfront, leastend]
                } else {
                    return -1;
                }
                break;
        }
    }

    findlinewithnode(i, j, nearnode, type): boolean {// i,j, [0,0]
        switch (type) {
            case 'row':
                let startindex_row = this.rowlines[i].lines[j].startindex;
                let endindx_row = this.rowlines[i].lines[j].endindex;
                if (this.rowlines[i].pos == nearnode[1] && this.collines[startindex_row].pos <= nearnode[0] && nearnode[0] <= this.collines[endindx_row].pos) {//判断行相同
                    return true;
                }
                break;
            case 'col':
                let startindex_col = this.collines[i].lines[j].startindex;
                let endindex_col = this.collines[i].lines[j].endindex;
                if (this.collines[i].pos == nearnode[0] && this.rowlines[startindex_col].pos <= nearnode[1] && nearnode[1] <= this.rowlines[endindex_col].pos) {//判断列相同
                    return true;
                }
                break;
        }
    }

    findnearnode(m1, n1) {
        let m2 = m1;
        let n2 = n1;
        let m3 = m1;
        let n3 = n1;
        let m4 = m1;
        let n4 = n1;
        let hasfind = false;
        let findednode;
        for (let i = 1; i <= 20; i++) { //向左筛选
            if (this.ctx.isPointInStroke(m1 - i, n1)) {
                hasfind = true;
                m1 = m1 - i;
                return [m1, n1];
                break;
            }
        }
        if (!hasfind) {
            for (let i = 1; i <= 20; i++) {  //向右筛选
                if (this.ctx.isPointInStroke(m2 + i, n2)) {
                    hasfind = true;
                    m2 = m2 + i;
                    return [m2, n2];
                    break;
                }
            }
        }
        if (!hasfind) {
            for (let i = 1; i <= 20; i++) {  //向上筛选
                if (this.ctx.isPointInStroke(m3, n3 - i)) {
                    hasfind = true;
                    n3 = n3 - i;
                    return [m3, n3];
                    break;
                }
            }
        }
        if (!hasfind) {
            for (let i = 1; i <= 20; i++) {  //向下筛选
                if (this.ctx.isPointInStroke(m4, n4 + i)) {
                    hasfind = true;
                    n4 = n4 + i;
                    return [m4, n4];
                    break;
                }
            }
        }
    }

    merge() {
        if (this.multiselectnode1 != undefined && this.multiselectnode2 != undefined) {
            //console.log(this.multiselectnode1, this.multiselectnode2);
            let left = this.multiselectnode1[0]; let top = this.multiselectnode1[1]; let right = this.multiselectnode2[0]; let bottom = this.multiselectnode2[1];
            //console.log(left, top, right, bottom);
            let startrow; let endrow; let startcol; let endcol;
            for (let i = 0; i < this.rowlines.length; i++) {
                if (this.rowlines[i].pos == top) {
                    startrow = i;
                }
                if (this.rowlines[i].pos == bottom) {
                    endrow = i;
                }
            }
            for (let i = 0; i < this.collines.length; i++) {
                if (this.collines[i].pos == left) {
                    startcol = i;
                }
                if (this.collines[i].pos == right) {
                    endcol = i;
                }
            }
            //console.log(startrow, endrow, startcol, endcol);
            //row
            if (startrow && endrow) {
                let rowpos = [];
                for (let i = startrow + 1; i < endrow; i++) {
                    const pos = this.rowlines[i].pos;
                    const lines = this.rowlines[i].lines;
                    rowpos.push({ pos, lines })
                }
                for (let i = 0; i < rowpos.length; i++) {
                    let rowindexlines = [];
                    for (let j = 0; j < rowpos[i].lines.length; j++) {
                        let startindex = rowpos[i].lines[j].startindex;
                        let endindex = rowpos[i].lines[j].endindex;
                        if (startcol <= startindex && endindex <= endcol) {
                            //console.log(this.rowlines[i].pos, startindex, endindex);
                            rowindexlines.push({ startindex, endindex });
                        }
                    }
                    rowindexlines.forEach((value) => {
                        this.removerowlines(rowpos[i].pos, [{ startindex: value.startindex, endindex: value.endindex }]);
                        this.drawlines();
                    })
                }
            }
            //col
            if (startcol && endcol) {
                let colpos = [];
                for (let i = startcol + 1; i < endcol; i++) {
                    const pos = this.collines[i].pos;
                    const lines = this.collines[i].lines;
                    colpos.push({ pos, lines });
                }
                //console.log(colpos);
                for (let i = 0; i < colpos.length; i++) {
                    //console.log(colpos[i]);
                    let colindexlines = [];
                    //console.log(this.rowlines[i].pos, startrow, endrow);
                    for (let j = 0; j < colpos[i].lines.length; j++) {
                        let startindex = colpos[i].lines[j].startindex;
                        let endindex = colpos[i].lines[j].endindex;
                        if (startrow <= startindex && endindex <= endrow) {
                            colindexlines.push({ startindex, endindex });
                        }
                    }
                    colindexlines.forEach((value) => {
                        //console.log(colpos[i].pos);
                        //console.log(value.startindex, value.endindex)
                        this.removecollines(colpos[i].pos, [{ startindex: value.startindex, endindex: value.endindex }]);
                        this.drawlines();
                    })
                }
            }
        }
    }

    clearallcanvas() {
        let canvas = this.eleRef.nativeElement.querySelector('#selectcanvas');//根据点击位置选择此块区域的正方形
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    switchtype(type) {
        if (this.type == type) {
            this.type = undefined;
            this.clearallcanvas();
            this.showmerge = false;
            this.showsplit = false;
        } else {
            this.type = type;
            switch (type) {
                case 'multiple':
                    this.clearallcanvas();
                    this.showmerge = true;
                    this.showsplit = false;
                    break;
                case 'merge':
                    this.merge();
                    this.switchtype('multiple');
                    break;
                case 'line':
                    this.clearallcanvas();
                    this.selectlines = [];
                    break;
                case 'split':
                    this.hascut = true;
                    break
            }
        }
    }

    changesize(direction, action) {
        switch (direction) {
            case 'row':
                if (action == 'reduce') {
                    if (this.rownum != 0) {
                        this.rownum--;
                    } 
                } else if (action == 'add') {
                    this.rownum++;
                }
                break;
            case 'col':
                if (action == 'reduce') {
                    if (this.colnum!=0) {
                        this.colnum--;
                    }
                } else if (action == 'add') {
                    this.colnum++;
                }
                break
        }
        console.log(this.multiselectnode1, this.multiselectnode2);
        
        console.log(this.rownum, this.colnum);
        
    }

    close() {
        this.hascut = false;
        this.switchtype('single');
        this.clearallcanvas();
        this.multiselectnode1 = this.selectnode1 = this.multiselectnode2 = this.selectnode2 = undefined;
        this.rownum = 2;
        this.colnum = 2;
    }

    confirm() {
        this.hascut = false;
        this.switchtype('single');
        this.drawwithnum(this.selectnode1, this.selectnode2, this.rownum, this.colnum);
        this.clearallcanvas();
        this.multiselectnode1 = this.selectnode1 = this.multiselectnode2 = this.selectnode2 = undefined;
        this.rownum = 2;
        this.colnum = 2;
    }
}
