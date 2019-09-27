import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';
@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.page.html',
  styleUrls: ['./goods-list.page.scss'],
})
export class GoodsListPage implements OnInit {

  constructor(public nav: NavController, private loc: Location) { }

  ngOnInit() {
  }
  // 返回上一页
  canGoBack() {
    this.loc.back();
  }
}
