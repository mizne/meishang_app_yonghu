import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-my-black-list',
  templateUrl: './my-black-list.page.html',
  styleUrls: ['./my-black-list.page.scss'],
})
export class MyBlackListPage implements OnInit {

  public followList;
  public UserId;
  public TenantId;
  public ExhibitionId;
  public IsFirstList;
  public isMyself;
  public currentVisitorId;
  constructor(public router: Router, public toastController: ToastController,
              public nav: NavController, private http: HttpClient,
              public storage: Storage, private loc: Location) {
  }

  ngOnInit() {
    const aa = this.router.url;
    const arr = aa.split('/');
    this.currentVisitorId = arr[2];
  }
  ionViewWillEnter() {
    this.myFollowList();
    this.queryIsMyself();
  }
  // 返回上一页
  canGoBack() {
    this.loc.back();
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      color: 'dark',
      cssClass: 'toast-wrapper',
      position: 'middle'
    });
    toast.present();
  }
  myFollowList() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      // 赋值全局
      this.UserId = userId;
      this.TenantId = tenantId;
      this.ExhibitionId = ExhibitionId;
      const requestData = {
        tenantId,
        userId,
        params: {
          condition: {

            VisitorId: VisitorRecordId,

          },
          properties: ['VisitorInBlacklist.Visitor.___all'],
          // properties: ['FllowWithVisitorId.Visitor.___all', 'FlloeWithExhibitorId.Exhibitor.___all']
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/VisitorBlackList', requestData)
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            this.IsFirstList = true
            this.followList = (res as any).result;
          } else {
            this.followList = []
            this.IsFirstList = false
          }
        });
    });
  }
  cancelFollow(item) {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('token')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId, token]) => {
      // 赋值全局
      this.UserId = userId;
      this.TenantId = tenantId;
      this.ExhibitionId = ExhibitionId;
      const requestData = {
        tenantId,
        userId,
        params: {
          recordId: item
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/delete/CollectionInfo', requestData, { headers: { Authorization: 'Bearer ' + token } })
        .subscribe(res => {
          if ((res as any).resMsg === 'success') {
            // this.followList = (res as any).result;
            this.queryIsMyself()
          }
          // console.log(JSON.stringify(this.followList))
        }, (err) => {
          console.log('==========hahha======')
          console.log(err);
          console.log(err.status);
          if (err.status == 403) {
            this.presentToast('登录已过期，请重新登录')

            this.storage.set(
              'VisitorExhibitionInfoId',
              ''
            );
            this.storage.set('VisitorRecordId', '');
            this.router.navigateByUrl('/login-by-password')
          }
        }
        );
    });
  }

  // 查询是否是自己
  queryIsMyself() {
    Promise.all([

      this.storage.get('VisitorRecordId'),

    ]).then(([VisitorRecordId]) => {
      if (this.currentVisitorId == VisitorRecordId) {
        this.isMyself = true
        // this.myFollowList(VisitorRecordId)
        console.log('===========this.isTest=====' + this.isMyself)
      } else {
        this.isMyself = false
        // this.myFollowList(this.currentVisitorId)

      }

    })

  }

  goToVisitorHome(id) {
    Promise.all([
      this.storage.get('VisitorRecordId'),
    ]).then(([VisitorRecordId]) => {
      if (id == VisitorRecordId) {
        this.router.navigateByUrl('/tabs/tabs/my-collection');
      } else {
        this.router.navigateByUrl('/others-page/' + id);
      }

    })


  }
}

