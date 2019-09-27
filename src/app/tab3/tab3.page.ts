import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(public nav: NavController, private loc: Location) {

  }
  // 返回上一页
  canGoBack() {
    this.loc.back();
  }
}
