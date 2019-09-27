import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';
@Component({
  selector: 'app-user-rules',
  templateUrl: './user-rules.page.html',
  styleUrls: ['./user-rules.page.scss'],
})
export class UserRulesPage implements OnInit {

  constructor(public nav: NavController, private loc: Location) { }
  a;
  ngOnInit() {
    this.a = new Date();
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }
}
