import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-help-and-customer-service',
  templateUrl: './help-and-customer-service.page.html',
  styleUrls: ['./help-and-customer-service.page.scss'],
})
export class HelpAndCustomerServicePage implements OnInit {
  public messageList;
  public isPhone;
  public isArea;
  public phone;
  public area;
  public phonearea;
  constructor(public router: Router, private http: HttpClient, public storage: Storage, public nav: NavController,
              public alertController: AlertController, private callNumber: CallNumber, private loc: Location) { }

  ngOnInit() {
    this.messageList = [
      {
        Type: '0',
        Content: '1、如何发布我的教程？',
        Answer: '答：点击首页左上角的“+”号跳转发布页，或者查看教程详情页的时候点击页面下方的 （我也要发布）的按钮。'
      },
      {
        Type: '0',
        Content: '2、怎么入驻商家？',
        Answer: '答：我的页面点击设置的图标打开侧边菜单，然后点击 入驻成为商家，填完信息后，根据指示登录商家端APP'
      },
      {
        Type: '0',
        Content: '3、积分如何获取？',
        Answer: '答：首页有每日签到按钮，每日可签到一次并获取相应的积分。'
      },
      {
        Type: '0',
        Content: '4、怎么查看我的足迹？',
        Answer: '答：我的页面点击设置的图标打开侧边菜单，然后点击 互动足迹，即可查看我浏览过的教程，课程和商品。'
      },
      {
        Type: '0',
        Content: '5、怎么修改个人资料？',
        Answer: '答：我的页面点击个人资料即可修改昵称，职业等信息。'
      }
    ];
  }

  canGoBack() {
    this.loc.back();
  }

  ionViewWillEnter() {
    this.querySysInfomation();
  }

  async presentAlert() {
    let phone = this.phonearea + this.phone;

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
          this.callNumber.callNumber(phone, true)
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

  callService() {
    this.presentAlert();
  }

  // 查询客服联系方式
  querySysInfomation() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, userId, ExhibitionId]) => {
      let courseData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            ExhibitionId,
          },
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/queryList/CustomerService',
          courseData
        )
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            let info = (res as any).result[0];
            if (info.ShowServicePhone) {
              this.isPhone = true;
              this.phone = info.Phone;
              this.phonearea = info.PhoneArea;
              this.area = info.Province + '' + info.City + '' + info.Area;
            } else {
              this.isPhone = false;
            }
            if (info.ShowAddress) {
              this.isArea = true;
              this.area = info.Province + info.City + info.Area;
            } else {
              this.isArea = false;
            }
          } else {
            this.isArea = false;
            this.isPhone = false;
          }
        });
    });
  }
}
