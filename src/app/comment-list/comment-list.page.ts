import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';
@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.page.html',
  styleUrls: ['./comment-list.page.scss'],
})
export class CommentListPage implements OnInit {

  constructor(public nav: NavController, private loc: Location) { }

  ngOnInit() {
  }
  // 返回上一页
  canGoBack() {
    this.loc.back();
  }
}
