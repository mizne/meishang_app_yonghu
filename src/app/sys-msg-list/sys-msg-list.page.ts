import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-sys-msg-list',
  templateUrl: './sys-msg-list.page.html',
  styleUrls: ['./sys-msg-list.page.scss'],
})
export class SysMsgListPage implements OnInit {

  constructor(public nav: NavController, public router: Router, private loc: Location) { }

  ngOnInit() {
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  // 查看系统消息
  goToMySysMsg() {
    this.router.navigateByUrl('/sys-inform');
  }
  // 查看账户消息
  goToMyAccountMsg() {
    this.router.navigateByUrl('/account-msg');

  }

  // 查看订阅消息
  goToMyAppointments() {
    this.router.navigateByUrl('/appointment-msg');
  }
  // 查看点赞列表
  goToLikeList() {
    this.router.navigateByUrl('/like-list');
  }

  // 查看留言列表
  goToLeaveMsg() {
    this.router.navigateByUrl('/leave-mmessages');
  }
  // 查看评论@
  goToCommentsList() {
    this.router.navigateByUrl('/comment-list');

  }

}
