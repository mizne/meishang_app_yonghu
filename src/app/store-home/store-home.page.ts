import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-store-home',
  templateUrl: './store-home.page.html',
  styleUrls: ['./store-home.page.scss'],
})
export class StoreHomePage implements OnInit {
  public shopId;
  public shopType;
  public IsFirstList;
  public IsSecondList;
  public shopProductList;
  public shopLessonList;
  public shopCheckType;
  public shopLogo;
  public shopName;
  public isCollectStore;
  public StoreInfo;
  public PVNumber;
  public StockIntroduce;
  constructor(public toastController: ToastController, public router: Router, private loc: Location,
              private http: HttpClient, public storage: Storage, public nav: NavController) { }

  ngOnInit() {
    const url = this.router.url;
    const splitURL = url.split('/');
    this.shopId = splitURL[2];
    this.shopType = '0';
    this.IsFirstList = false;
    this.shopCheckType = '商品';
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

  ionViewWillEnter() {
    this.queryStoreInfo();
    this.queryProductList();
    // this.queryCollectStore()
  }

  checkTab(type) {
    this.shopType = type;
    if (type === '0') {
      this.shopCheckType = '商品';
      this.queryProductList();
    } else if (type === '1') {
      this.shopCheckType = '课程';
      this.queryLessonList();
    }
  }

  queryProductList() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, userId, ExhibitionId]) => {
      const courseData = {
        tenantId,
        userId,
        params: {
          condition: {
            ExhibitionId,
            IsRecycled: false,
            IsShow: true,
            ExhibitorExhibitionInfoId: this.shopId,
            ProductType: this.shopCheckType
          },
          properties: ['ProductId.Product.___all', 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'],
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            this.shopProductList = (res as any).result;
            this.IsFirstList = false;
          } else {
            this.shopProductList = [];
            this.IsFirstList = true;
          }
        });
    });
  }

  queryLessonList() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, userId, ExhibitionId]) => {
      const courseData = {
        tenantId,
        userId,
        params: {
          condition: {
            ExhibitionId,
            // IsRecycled: false,
            IsShow: true,
            IsCourseApprove: '1',
            ExhibitorExhibitionInfoId: this.shopId,
            ProductType: this.shopCheckType
          },
          properties: ['ProductId.Product.___all', 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'],
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            this.shopLessonList = (res as any).result;
            this.IsSecondList = false;
          } else {
            this.shopLessonList = [];
            this.IsSecondList = true;
          }
        });
    });
  }

  queryStoreInfo() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
    ]).then(([tenantId, userId]) => {
      const courseData = {
        tenantId,
        userId,
        params: {
          condition: {
            RecordId: this.shopId
          },
          properties: ['ProductId.Product.___all', 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'],
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/ExhibitorExhibitionInfo', courseData)
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            this.shopLogo = (res as any).result[0].Logo;
            this.shopName = (res as any).result[0].StockName;
            this.StoreInfo = (res as any).result[0];
            this.PVNumber = (res as any).result[0].PVNumber + 1;
            this.StockIntroduce = (res as any).result[0].StockIntroduce;
            let num = (res as any).result[0].PVNumber;
            this.updatePVNumber(num);
            this.queryCollectStore();
          } else {
            this.presentToast('该店铺已不存在');
          }
        });
    });
  }

  productDetail(id) {
    this.router.navigateByUrl('/goods-details/' + id);
  }

  lessonDetail(id) {
    this.router.navigateByUrl('/course-details/' + id);
  }

  // 收藏店铺
  goToCollectStore() {
    // this.isCollectStore = !this.isCollectStore
    // 判断是否关注 已关注 修改状态  未关注 新增一个
    if (this.isCollectStore == true) {
      // 取消收藏
      Promise.all([
        this.storage.get('TenantId'),
        this.storage.get('UserId'),
        this.storage.get('ExhibitionId'),
        this.storage.get('VisitorRecordId')
      ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
        if (VisitorRecordId && VisitorRecordId.length == 24) {
          const teachingData = {
            userId,
            tenantId,
            params: {
              condition: {
                ExhibitorId: this.StoreInfo.ExhibitorId,
                CollectedExhibitorExhibitionInfoId: this.StoreInfo.RecordId,
                VisitorId: VisitorRecordId,
                CollectionByWhat: '关注店铺',
                ExhibitionId: exhibitionId,
              }
            }
          };
          this.http
            .post(
              AppComponent.apiUrl + 'v2/data/deleteByCondition/CollectionInfo',
              teachingData
            )
            .subscribe(res => {
              if ((res as any).resCode == 0) {
                this.isCollectStore = false;
                this.presentToast('已取消关注');
              } else {
                this.presentToast('取消关注失败');
              }
            });
        } else {
          this.presentToast('登录后才可以使用哦！');
        }
      });
    } else {
      // 新增收藏
      Promise.all([
        this.storage.get('TenantId'),
        this.storage.get('UserId'),
        this.storage.get('ExhibitionId'),
        this.storage.get('VisitorRecordId')
      ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
        if (VisitorRecordId && VisitorRecordId.length == 24) {
          const teachingData = {
            userId,
            tenantId,
            params: {
              record: {
                ExhibitorId: this.StoreInfo.ExhibitorId,
                CollectedExhibitorExhibitionInfoId: this.StoreInfo.RecordId,
                VisitorId: VisitorRecordId,
                CollectionByWhat: '关注店铺',
                ExhibitionId: exhibitionId
              }
            }
          };
          this.http
            .post(
              AppComponent.apiUrl + 'v2/data/insert/CollectionInfo',
              teachingData
            )
            .subscribe(res => {
              if ((res as any).resCode == 0) {
                this.isCollectStore = true;
                this.presentToast('已关注');
              } else {
                this.isCollectStore = false;
                this.presentToast('关注失败');
              }
            });
        } else {
          this.presentToast('登录后才可以使用哦！');
        }
      });
    }
  }

  // 查询是否关注店铺
  queryCollectStore() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      const courseData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            ExhibitionId: ExhibitionId,
            ExhibitorId: this.StoreInfo.ExhibitorId,

            CollectedExhibitorExhibitionInfoId: this.StoreInfo.RecordId,
            VisitorId: VisitorRecordId,
            CollectionByWhat: '关注店铺',
            // SourceType: '商城',
            // ProductType: '教程'
          }
          // properties: ['ProductId.Product.___all'],
        }
      };
      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/CollectionInfo', courseData)
        .subscribe(res => {
          const resultInfo = (res as any).result[0];
          if ((res as any).resCode == 0) {
            this.isCollectStore = true;
          } else {
            this.isCollectStore = false;
          }
        });
    });
  }

  updatePVNumber(num) {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      this.http
        .post(AppComponent.apiUrl + 'v2/data/update/ExhibitorExhibitionInfo', {
          tenantId,
          userId,
          params: {
            recordId: this.shopId,
            setValue: {
              PVNumber: num + 1
            }
          }
        }).subscribe((results) => {
        });
    });
  }
}
