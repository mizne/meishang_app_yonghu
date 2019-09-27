import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';
@Component({
  selector: 'app-account-msg',
  templateUrl: './account-msg.page.html',
  styleUrls: ['./account-msg.page.scss'],
})
export class AccountMsgPage implements OnInit {

  constructor(public nav: NavController, private loc: Location) { }

  ngOnInit() {
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }
}
