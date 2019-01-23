import { Component, Input, ElementRef, EventEmitter, Output, Renderer2,ViewChild } from '@angular/core';
/**
 * Generated class for the GridAreaComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'grid-area',
  templateUrl: 'grid-area.page.html',
  styleUrls: ['grid-area.page.scss'],
})
export class GridAreaComponent {


    @Input() canmove: boolean = true;

    @Input() rowNum: number = 20;
    @Input() colNum: number = 20;
    @Input() colSize: number = 50;
    @Input() colGap: number = 3;
    @Input() buildingList: Array<any> = [];
    @Input() usethumbnail: boolean = true;
    @Input() pagename: any;
    @Input() usebackground: any;
    areaInfo = {};

    wallSize: number = 20;
    areaWidth: number = 500;
    areaHeight: number = 1000;
    area: any;

    oW;
    oH;
    oLeft;
    oTop;

    deviceWidth;
    deviceHeight;

    emitPosition = new EventEmitter();
    @Output() emitbulidingListstack = new EventEmitter();
    @Output() emitshowlist = new EventEmitter();
    constructor(public eleRef: ElementRef, public render: Renderer2) { }

    ngOnInit() {
        //大的范围
        this.areaWidth = this.colNum * this.colSize + this.colGap * (this.colNum + 1) + this.wallSize * 2;
        this.areaHeight = this.rowNum * this.colSize + this.colGap * (this.rowNum + 1) + this.wallSize * 2;
        //屏幕范围
        this.deviceWidth = window.innerWidth;
        this.deviceHeight = window.innerHeight;

        this.areaInfo = {
            colNum: this.colNum,
            rowNum: this.rowNum,
            colSize: this.colSize,
            colGap: this.colGap,
            wallSize: this.wallSize,
            areaWidth: this.areaWidth - this.wallSize * 2 - this.colGap - 2,
            areaHeight: this.rowNum * this.colSize + this.colGap * (this.rowNum - 1),
            deviceWidth: this.deviceWidth,
            deviceHeight: this.deviceHeight,
        }

        this.area = this.eleRef.nativeElement.querySelector('.area');
        if (this.areaWidth < this.deviceWidth) {
            let mleft = (this.deviceWidth - this.areaWidth) / 2;
            this.render.setStyle(this.area, 'margin-left', `${mleft}px`)
        }
        if (this.areaHeight < this.deviceHeight) {
            let mtop = (this.deviceHeight - this.areaHeight) / 2;
            this.render.setStyle(this.area, 'margin-top', `${mtop}px`)
        }

        this.drawCanvas();
        this.pagename;
    }
    setgrid(show: boolean) {
        this.usebackground = show;
        this.drawCanvas();
    }
    drawCanvas() {
        // let oD = new Date().getTime();

        let canvas = this.eleRef.nativeElement.querySelector('#area');
        let context = canvas.getContext("2d");
        let colGap = this.colGap;
        let colSize = this.colSize;
        let height = this.areaHeight;
        let width = this.areaWidth;
        let wallSize = this.wallSize;
        let colNum = this.colNum;
        let rowNum = this.rowNum;
        //无边框。
        canvas.width = width;
        canvas.height = height;
        if (this.usebackground) {
            context.fillStyle = "#F0F0F0";
            context.fillRect(wallSize + colGap, wallSize + colGap, colNum * (colSize + colGap), rowNum * (colSize + colGap))

            context.lineWidth = this.colGap / 2;
            context.strokeStyle = "#d7d7d7";
            for (let i = 0, l = colNum; i <= l; i++) {
                const length = i * (colSize + colGap) + colGap / 2 + wallSize;
                context.moveTo(length, colGap / 2 + wallSize)//把画笔移到这个位置
                context.lineTo(length, height - colGap / 2 - wallSize)//把画笔与此位置连接
            }

            for (let i = 0, l = rowNum; i <= l; i++) {
                const length = i * (colSize + colGap) + colGap / 2 + wallSize;
                context.moveTo(colGap / 2 + wallSize, length)//把画笔移到这个位置
                context.lineTo(width - colGap / 2 - wallSize, length)//把画笔与此位置连接
            }

            context.stroke()//画
        }

        //let nD = new Date().getTime();
        //console.log(nD-oD);
    }

    touchStart(e) {
        let touches = e.touches[0];
        this.oW = touches.clientX - this.area.offsetLeft;
        this.oH = touches.clientY - this.area.offsetTop;

        // e.preventDefault();
        //e.stopPropagation();
    }

    touchMove(e) {
        let touches = e.touches[0];
        let oLeft = touches.clientX - this.oW;
        let oTop = touches.clientY - this.oH;

        let width = this.deviceWidth > this.areaWidth ? 0 : this.deviceWidth - this.areaWidth;
        let height = this.deviceHeight > this.areaHeight ? 0 : this.deviceHeight - this.areaHeight;

        if (oLeft > 0) {
            oLeft = 0;
        } else if (oLeft < width) {
            oLeft = width;
        }

        if (oTop > 0) {
            oTop = 0;
        } else if (oTop < height) {
            oTop = height;
        }

        [this.oLeft, this.oTop] = [oLeft, oTop];

        //this.area.style.left = oLeft + "px";
        this.area.style.top = oTop + "px";

        e.preventDefault();
        e.stopPropagation();
    }

    touchEnd(e) {
        //this.emitPosition.emit([
        //    Math.abs(this.oLeft) / this.areaWidth,
        //    Math.abs(this.oTop) / this.areaHeight]);
        this.emitPosition.emit([
            Math.abs(this.oTop) / this.areaHeight
        ]);

    }

    getTPosition([left, top]) {
        let oLeft = -left * this.areaWidth;
        let oTop = -top * this.areaHeight;

        let width = this.deviceWidth > this.areaWidth ? 0 : this.deviceWidth - this.areaWidth;
        let height = this.deviceHeight > this.areaHeight ? 0 : this.deviceHeight - this.areaHeight;

        if (oLeft > 0) {
            oLeft = 0;
        } else if (oLeft < width) {
            oLeft = width;
        }

        if (oTop > 0) {
            oTop = 0;
        } else if (oTop < height) {
            oTop = height;
        }
        this.render.setStyle(this.area, 'left', `${oLeft}px`)
        this.render.setStyle(this.area, 'top', `${oTop}px`)
    }

    changestack(e) {
        //console.log(e);
        this.emitbulidingListstack.emit(e);
    }

    disableshowList() {
        this.emitshowlist.emit();
    }
}
