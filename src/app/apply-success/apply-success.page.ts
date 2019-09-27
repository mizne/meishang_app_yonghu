import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-apply-success',
  templateUrl: './apply-success.page.html',
  styleUrls: ['./apply-success.page.scss'],
})
export class ApplySuccessPage implements OnInit {

  constructor(public nav: NavController, public router: Router, private loc: Location) { }

  ngOnInit() {
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }
  goBackHome() {
    this.router.navigateByUrl('/tabs/tabs/tab1');
  }

}
