import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
// import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Location } from '@angular/common';
@Component({
  selector: 'app-my-wallet',
  templateUrl: './my-wallet.page.html',
  styleUrls: ['./my-wallet.page.scss'],
})
export class MyWalletPage implements OnInit {

  constructor(public toastController: ToastController, public nav: NavController, private loc: Location) { }
  ngOnInit() {
  }
  // 返回上一页
  canGoBack() {
    this.loc.back();
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: 'dark',
      cssClass: 'toast-wrapper',
      position: 'middle'
    });
    toast.present();
  }
  gotoTansM(){
    this.presentToast('请填写评论内容')
    // alert("暂不支持提现功能")
  }
}
