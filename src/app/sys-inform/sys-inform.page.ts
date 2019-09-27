import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';
@Component({
  selector: 'app-sys-inform',
  templateUrl: './sys-inform.page.html',
  styleUrls: ['./sys-inform.page.scss'],
})
export class SysInformPage implements OnInit {

  constructor(public nav: NavController, private loc: Location
  ) { }

  ngOnInit() {
  }
  // 返回上一页
  canGoBack() {
    this.loc.back();
  }
}
