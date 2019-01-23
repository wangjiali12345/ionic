import { Component, Input, ElementRef, Output, EventEmitter} from '@angular/core';
import { GlobalData } from '../../providers/GlobalData';
import { Router } from '@angular/router';
/**
 * Generated class for the BuildingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'building',
  templateUrl: './building.page.html',
  styleUrls: ['./building.page.scss'],
})
export class BuildingComponent {
  @Input() canmove: boolean = true;
  @Input() areaInfo: any = {};
  @Input() building: any = {};
  @Input() pagename: any;
  oldLeft: any;
  oldTop: any;
  newLeft: any;
  newTop: any;
  oW: any;
  oH: any;
  buildingEle: any;
  @Output() emitbuildingList = new EventEmitter();

  constructor(public eleRef: ElementRef, public globalData: GlobalData,
              public router:Router) { }

    ngOnInit() {
        this.buildingEle = this.eleRef.nativeElement.querySelector('.building');
    }
    forward(e) {
       
        this.globalData.buildingList.forEach((item) => {
            if (item.pagename === this.building.name) {
                this.globalData.Gobuilding(item);
                this.emitbuildingList.emit(item);
            } 
        });
    }

    touchstart(e) {
     
        if (this.canmove) {
            [this.oldLeft, this.oldTop] = [this.building.left, this.building.top];
            this.buildingEle.style.zIndex = 1;
            let touches = e.touches[0];
            this.oW = touches.clientX - this.buildingEle.offsetLeft;
            this.oH = touches.clientY - this.buildingEle.offsetTop;
            e.preventDefault();
            e.stopPropagation();
        } 
    
  }

  touchmove(e) {
      if (this.canmove != false) {
          let touches = e.touches[0];
          let oLeft = touches.clientX - this.oW;
          let oTop = touches.clientY - this.oH;

          if (oLeft < 0) {
              oLeft = 0;
          } else if (oLeft > this.areaInfo.areaWidth - this.buildingEle.offsetWidth) {
              oLeft = (this.areaInfo.areaWidth - this.buildingEle.offsetWidth);
          }

          if (oTop < 0) {
              oTop = 0;
          } else if (oTop > this.areaInfo.areaHeight - this.buildingEle.offsetHeight) {
              oTop = (this.areaInfo.areaHeight - this.buildingEle.offsetHeight);
          }

          [this.newLeft, this.newTop] = [oLeft, oTop]

          this.buildingEle.style.left = oLeft + "px";
          this.buildingEle.style.top = oTop + "px";
          e.preventDefault();
          e.stopPropagation();
      }
      
   
  }

  touchend(e) {
      if (this.canmove != false) {
          ['Left', 'Top'].forEach(dir => {
              let colNum = Math.floor(this[`new${dir}`] / (this.areaInfo.colSize + this.areaInfo.colGap));
              let rest = this[`new${dir}`] % (this.areaInfo.colSize + this.areaInfo.colGap);
              if (rest > 0.5 * (this.areaInfo.colSize + this.areaInfo.colGap)) colNum++;
              let attr = dir.toLowerCase();
              this.building[attr] = colNum;
              this.setStyle(attr);
          });
          this.isBlocking(this.building);

          this.buildingEle.style.zIndex = 0;
          e.preventDefault();
          e.stopPropagation();
      }
      
 

  }

  setStyle(attr) {
    this.buildingEle.style[attr] = (this.areaInfo.colGap + this.areaInfo.colSize) * this.building[attr] + 'px'
  }

  isBlocking(building) {
      this.globalData.buildingList.forEach((item) => {
          if (item.pagename == this.pagename) {
              for (let b of item.buildingList) {
                  if (building != b) {
                      let [x1, x2] = [b.left, b.left + b.width - 1];
                      let [y1, y2] = [b.top, b.top + b.height - 1];
                      for (let i = building.left; i < building.left + building.width; i++) {
                          for (let j = building.top; j < building.top + building.height; j++) {
                              
                              if (x1 <= i && i <= x2 && y1 <= j && j <= y2) {
                                  [building.left, building.top] = [this.oldLeft, this.oldTop];
                                  ['left', 'top'].forEach(attr => {
                                      this.setStyle(attr);
                                  })
                                  return;
                              }
                          }
                      }
                  }
              }
          }
      })
  }
}
