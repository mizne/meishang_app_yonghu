import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';
@Component({
  selector: 'app-order-courier',
  templateUrl: './order-courier.page.html',
  styleUrls: ['./order-courier.page.scss'],
})
export class OrderCourierPage implements OnInit {

  constructor( public nav: NavController, private loc: Location) { }

  ngOnInit() {
  }
  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

}
