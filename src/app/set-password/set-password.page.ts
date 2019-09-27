import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.page.html',
  styleUrls: ['./set-password.page.scss'],
})
export class SetPasswordPage implements OnInit {
  public userPassword1;
  public userPassword2;
  public type;
  public showBackBtn;
  constructor(public nav: NavController, public toastController: ToastController, private loc: Location,
              public router: Router, private http: HttpClient, public storage: Storage) { }

  ngOnInit() {
    this.userPassword1 = '';
    this.userPassword2 = '';
  }

  ionViewWillEnter() {
    const aa = this.router.url;
    const arr = aa.split('/');
    this.type = arr[2];
    if (this.type === '0') {
      this.showBackBtn = false;
    } else if (this.type === '1') {
      this.showBackBtn = true;
    }
  }

  gotoLogin() {
    if (this.userPassword1 == '') {
      this.presentToast('请设置密码', 2000);
    } else if (this.userPassword1 != this.userPassword2) {
      this.presentToast('两次输入密码不一致', 2000);
    } else {
      // 修改密码
      Promise.all([
        this.storage.get('TenantId'),
        this.storage.get('UserId'),
        this.storage.get('ExhibitionId')
      ]).then(([tenantId, userId, exhibitionId]) => {
        let teachingData = {
          UserId: userId,
          TenantId: tenantId,
          params: {
            recordId: userId,
            Type: '2',
            setValue: {
              UserPassword: this.userPassword1
            }
          }
        };
        this.http
          .post(
            AppComponent.apiUrl + 'v2/data/update/User',
            teachingData
          )
          .subscribe(res => {
            if ((res as any).resCode == 0) {
              this.presentToast('密码修改成功', 3000);
              if (this.showBackBtn) {
                this.router.navigateByUrl('/account-safe');
              } else {
                this.router.navigateByUrl('/tabs/tabs/tab1');
              }
            }
            // this.CategoriesFirstList = (res as any).result;
          });
      });
    }
  }

  async presentToast(msg, time) {
    const toast = await this.toastController.create({
      message: msg,
      duration: time,
      cssClass: 'toast-wrapper',
      position: 'middle'
    });
    toast.present();
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }
}
