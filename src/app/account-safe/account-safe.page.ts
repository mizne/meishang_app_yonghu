import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-account-safe',
  templateUrl: './account-safe.page.html',
  styleUrls: ['./account-safe.page.scss'],
})
export class AccountSafePage implements OnInit {
  public myPhone;
  constructor(private callNumber: CallNumber, public alertController: AlertController,
              public nav: NavController, public toastController: ToastController,
              public router: Router, private http: HttpClient, public storage: Storage,
              private loc: Location) { }

  ngOnInit() {
    this.getPhone();
  }

  getPhone() {
    Promise.all([
      this.storage.get('Phone')
    ]).then(([Phone]) => {
      this.myPhone = Phone;
    });
  }

  goTotest1() {
    this.router.navigateByUrl('/login-by-phone');
  }

  goTotest2() {
    this.router.navigateByUrl('/wechatshare');
  }

  goTotest() {
    this.router.navigateByUrl('/teaching-comments');
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  gotoChangePhone() {
    this.presentToast('手机号不可修改', 2000);
  }

  ionViewWillEnter() {
  }

  goToCall() {
    this.presentAlert();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: '',
      subHeader: '',
      message: '确定要拨打投诉电话吗',
      buttons: [{
        text: '取消',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
        }
      }, {
        text: '确定',
        role: 'Ok',
        cssClass: 'secondary',
        handler: (blah) => {
          this.callNumber.callNumber('13776410320', true)
            .then(res =>
              console.log('Launched dialer!', res)
            )
            .catch(err => console.log('Error launching dialer', err)
            );
        }
      }],
    });
    await alert.present();
  }

  goToLoginOut() {
    this.presentAlert1();
  }

  async presentAlert1() {
    const alert = await this.alertController.create({
      header: '',
      subHeader: '',
      message: '确定要退出登录吗',
      buttons: [{
        text: '取消',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
        }
      }, {
        text: '确定',
        role: 'Ok',
        cssClass: 'secondary',
        handler: (blah) => {
          this.storage.clear();
          // this.presentToast('缓存已全部清除')
          // 继续存缓存
          const exData = {
            params: {
              condition: {
                ExName: '美尚云讯'
              }
            }
          };
          this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Exhibition', exData)
            .subscribe(res => {
              if ((res as any).resCode === 0) {
                const resultInfo = (res as any).result;
                // this.presentToast('查询成功')
                this.storage.set('TenantId', resultInfo[0].TenantId);
                // ExhibitionId
                this.storage.set('ExhibitionId', resultInfo[0].RecordId);
                this.storage.set('UserIdOfEx', resultInfo[0].UserId);
                this.router.navigateByUrl('/login-by-phone');
              } else {
                // this.presentToast('缓存失败');
              }
            });
        }
      }],
    });
    await alert.present();
  }

  goToSetPassword() {
    const type = '1';
    this.router.navigateByUrl('/set-password/' + type);
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
}
