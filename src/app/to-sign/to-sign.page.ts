import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-to-sign',
  templateUrl: './to-sign.page.html',
  styleUrls: ['./to-sign.page.scss'],
})
export class ToSignPage implements OnInit {
  public isInform;
  public UserId;
  public TenantId;
  public ExhibitionId;
  public mypoints;

  constructor(public toastController: ToastController, public router: Router,
              private http: HttpClient, public nav: NavController,
              public storage: Storage, private loc: Location) { }

  ngOnInit() {
    this.isInform = true;
    // this.getMyPoints()
    this.test();
  }
  ionViewWillEnter() {
    this.getMyPoints();
  }

  // 检测 每天只能签到一次
  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  chooseInform() {
    this.isInform = !this.isInform;
    let msg = '设置成功';
    let msg1 = '取消设置';
    if (this.isInform == true) {
      this.presentToast(msg);
    } else {
      this.presentToast(msg1);
    }
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'middle',
      //  color:'Medium',
      cssClass: 'toast-wrapper',
      duration: 2000
    });
    toast.present();
  }

  // 去查看积分列表
  goToPointsList() {
    this.router.navigateByUrl('/points-list');
  }

  // 查看积分
  getMyPoints() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      let goodsData = {
        UserId: userId,
        TenantId: tenantId,
        params: {
          condition: {
            VisitorId: VisitorRecordId,
            ExhibitionId: exhibitionId,
          }
        }
      };
      //  'ProductId' : ObjectId('5cb5aebdd9754d97704b77c4'),
      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryCount/MyShopPoints', goodsData)
        .subscribe(res => {
          this.mypoints = (res as any).result;
          this.mypoints = this.mypoints * 10;
        });
    });
  }

  test() {
    let time = new Date();
    let mon = time.getMonth() + 1;
    time.getFullYear() + mon + time.getDate()
    var d1 = new Date('2016/03/28 10:17:22').getTime();
    var d2 = new Date('2016/03/28 11:17:22').getTime();
  }

  // 签到新增积分
  toAddPoints() {
    // 判断一天只能领取一次
    let time = new Date();
    let mon = time.getMonth() + 1;
    let mm = time.getFullYear() + '-' + mon + '-' + time.getDate();
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      // debugger
      //  判断用户是否登录
      if(VisitorRecordId && VisitorRecordId.length == 24){

        let time = new Date();
        let mon = time.getMonth() + 1;
        let mm = time.getFullYear() + '-' + mon + '-' + time.getDate();
        let goodsData = {
          UserId: userId,
          TenantId: tenantId,
          params: {
            condition: {
              VisitorId: VisitorRecordId,
              ExhibitionId: exhibitionId,
              CreatedAt: '/' + mm + '/'
            }
          }
        };
        //  'ProductId' : ObjectId('5cb5aebdd9754d97704b77c4'),
        this.http
          .post(AppComponent.apiUrl + 'v2/data/queryList/MyShopPoints', goodsData)
          .subscribe(res => {
            if ((res as any).resCode == 0) {
              this.presentToast('一天只能签到一次哦');
            } else {
              let teachingData = {
                userId: userId,
                tenantId: tenantId,
                params: {
                  record: {
                    VisitorId: VisitorRecordId,
                    ExhibitionId: exhibitionId,
                    ExhibitorId: '',
                    Type: '每日签到',
                    Points: '10'
                  }
                }
              };
              this.http
                .post(
                  AppComponent.apiUrl + 'v2/data/insert/MyShopPoints',
                  teachingData
                )
                .subscribe(res => {
                  let result_info = (res as any).result;
                  this.presentToast('签到成功');
                  this.getMyPoints();
                });
            }
          });
      } else {
        this.presentToast('登陆后才可以签到哦！');
      }
    });
  }
}
