import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';
@Component({
  selector: 'app-leave-mmessages',
  templateUrl: './leave-mmessages.page.html',
  styleUrls: ['./leave-mmessages.page.scss'],
})
export class LeaveMmessagesPage implements OnInit {

  constructor(public nav: NavController, private loc: Location) { }

  ngOnInit() {
  }
  // 返回上一页
  canGoBack() {
    this.loc.back();
  }
}
