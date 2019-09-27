import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  constructor(public nav: NavController, private loc: Location) {

  }
  // 返回上一页
  canGoBack() {
    this.loc.back();
  }
}
