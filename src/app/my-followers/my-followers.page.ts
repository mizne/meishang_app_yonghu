import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-my-followers',
  templateUrl: './my-followers.page.html',
  styleUrls: ['./my-followers.page.scss'],
})
export class MyFollowersPage implements OnInit {
  public followersList;
  public UserId;
  public TenantId;
  public ExhibitionId;
  public IsFirstList;
  public isMyself;
  public currentVisitorId;
  constructor(public nav: NavController, public router: Router, private http: HttpClient,
              public storage: Storage, public toastController: ToastController,
              private loc: Location) {
  }

  ngOnInit() {
    const aa = this.router.url;
    const arr = aa.split('/');
    this.currentVisitorId = arr[2];
  }

  ionViewWillEnter() {
    // this.myFollowersList();
    this.queryIsMyself();
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  myFollowersList(id) {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      this.UserId = userId;
      this.TenantId = tenantId;
      this.ExhibitionId = ExhibitionId;
      const requestData = {
        tenantId,
        userId,
        params: {
          condition: {
            ExhibitionId,
            CollectedVisitorId: this.currentVisitorId,
            CollectionByWhat: '关注用户'
          },
          properties: ['VisitorId.Visitor.___all']
          // properties: ['FllowWithVisitorId.Visitor.___all', 'FlloeWithExhibitorId.Exhibitor.___all']
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/CollectionInfo', requestData)
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            this.IsFirstList = true;
            this.followersList = (res as any).result;
          } else {
            this.followersList = [];
            this.IsFirstList = false;
          }
          // if ((res as any).resMsg === 'success') {
          //   this.followersList = (res as any).result;
          // }
        });
    });
  }

  reFollow(item) {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      const requestData = {
        userId,
        tenantId,
        params: {
          record: {
            CollectedVisitorId: item.VisitorId,
            VisitorId: VisitorRecordId,
            ExhibitionId: exhibitionId
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/insert/CollectionInfo', requestData)
        .subscribe(res => {
          if ((res as any).resMsg === 'success') {
            this.presentToast('已回粉');
          }
        });
    });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: 'grey',
      cssClass: 'toast-wrapper',
      position: 'bottom'
    });
    toast.present();
  }

  // 查询是否是自己
  queryIsMyself() {
    Promise.all([
      this.storage.get('VisitorRecordId'),
    ]).then(([VisitorRecordId]) => {
      if (this.currentVisitorId == VisitorRecordId) {
        this.isMyself = true;
        this.myFollowersList(VisitorRecordId);
      } else {
        this.isMyself = false;
        this.myFollowersList(this.currentVisitorId);
      }
    });
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
    });
  }
}
