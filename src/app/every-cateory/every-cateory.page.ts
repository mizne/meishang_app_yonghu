import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-every-cateory',
  templateUrl: './every-cateory.page.html',
  styleUrls: ['./every-cateory.page.scss'],
})
export class EveryCateoryPage implements OnInit {
  public UserId;
  public TenantId;
  public ExhibitionId;
  public CategoriesFirstList;
  public CategoriesSecondList;
  public VisitorRecordId;
  public firstCategoryId;
  public toastCtrl;
  public isGoods1;
  public isGoods2;
  public searchValue;
  public coursesList;
  public cateoryId;
  public goodsList;
  public goodsSearchList;
  public isSearch;
  public isSearchNull;
  public isGoodsNull;
  public type;
  constructor(public toastController: ToastController, public nav: NavController,
              public alertController: AlertController,
              public router: Router, private loc: Location,
              private http: HttpClient,
              public storage: Storage) { }

  ngOnInit() {
    const aa = this.router.url;
    const arr = aa.split('/');
    const str = arr[2];
    const strr = str.split('&');
    this.cateoryId = strr[0];
    this.type = strr[1];

    this.isSearch = false;
    this.isSearchNull = false;
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

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  ionViewWillEnter() {
    if (this.type === 'first') {
      this.getProductsAllList();
    } else if (this.type === 'second') {
      this.getProductsList();
    }
  }

  // 查询商品
  getProductsList() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      let courseData = {
        UserId: userId,
        TenantId: tenantId,
        params: {
          condition: {
            IsRecycled: false,
            IsShow: true,
            CategorySecondId: this.cateoryId,
            ExhibitionId: exhibitionId,
            SourceType: '商城',
            ProductType: '商品'
          },
          properties: ['ProductId.Product.___all'],
          // options: {
          //   pageIndex: 1,
          //   pageSize: 10
          // }
        }
      };
      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            this.goodsList = (res as any).result;
            this.isGoodsNull = false;
          } else {
            this.isGoodsNull = true;
          }
        });
    });
  }

  // 查询商品
  getProductsAllList() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      let courseData = {
        UserId: userId,
        TenantId: tenantId,
        params: {
          condition: {
            IsRecycled: false,
            IsShow: true,
            CategoryFirstId: this.cateoryId,
            ExhibitionId: exhibitionId,
            SourceType: '商城',
            ProductType: '商品'
          },
          properties: ['ProductId.Product.___all'],
          // options: {
          //   pageIndex: 1,
          //   pageSize: 10
          // }
        }
      };
      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            this.goodsList = (res as any).result;
            this.isGoodsNull = false;
          } else {
            this.isGoodsNull = true;
          }
        });
    });
  }

  // 搜索课程
  // 搜索
  goToSearch() {
    this.isSearch = true;
    if (this.type === 'first') {
      this.searchFirst();
    } else if (this.type === 'second') {
      this.searchSecond();
    }
  }

  searchFirst() {
    // 查询商品
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, userId, ExhibitionId]) => {
      // 赋值全局
      this.UserId = userId;
      this.TenantId = tenantId;
      this.ExhibitionId = ExhibitionId;
      let courseData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            ExhibitionId: ExhibitionId,
            ProductType: '商品',
            IsRecycled: false,
            IsShow: true,
            // ProductType: '教程程',
            CategoryFirstId: this.cateoryId,
            SourceType: '商城',
            productTitle: '/' + this.searchValue + '/'
          },
          properties: ['ProductId.Product.___all'],
          // options: {
          //   pageIndex: 1,
          //   pageSize: 10
          // }
        }
      };
      if (this.isGoodsNull) {
        this.searchValue = '';
        // alert('暂无商品可搜索')
        this.presentToast('暂无商品可搜索');
      } else {
        this.http
          .post(
            AppComponent.apiUrl + 'v2/data/queryList/Product',
            courseData
          )
          .subscribe(res => {
            if ((res as any).resCode == 0) {
              this.goodsSearchList = (res as any).result;
              this.searchValue = '';
              this.isSearchNull = false;
            } else {
              this.isSearchNull = true;
              this.searchValue = '';
            }
          });
      }
    });
  }

  searchSecond() {
    // 查询商品
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, userId, ExhibitionId]) => {
      // 赋值全局
      this.UserId = userId;
      this.TenantId = tenantId;
      this.ExhibitionId = ExhibitionId;
      let courseData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            ExhibitionId: ExhibitionId,
            ProductType: '商品',
            IsRecycled: false,
            IsShow: true,
            // ProductType: '教程程',
            CategorySecondId: this.cateoryId,
            SourceType: '商城',
            productTitle: '/' + this.searchValue + '/'
          },
          properties: ['ProductId.Product.___all'],
          // options: {
          //   pageIndex: 1,
          //   pageSize: 10
          // }
        }
      };
      if (this.isGoodsNull) {
        this.searchValue = '';
        // alert('暂无商品可搜索')
        this.presentToast('暂无商品可搜索');
      } else {
        this.http
          .post(
            AppComponent.apiUrl + 'v2/data/queryList/Product',
            courseData
          )
          .subscribe(res => {
            if ((res as any).resCode == 0) {
              this.goodsSearchList = (res as any).result;
              this.searchValue = '';
              this.isSearchNull = false;
            } else {
              this.isSearchNull = true;
              this.searchValue = '';
            }
          });
      }
    });
  }

  // 查看商品详情
  goToDetails(id) {
    this.router.navigateByUrl('/goods-details/' + id);
  }
}
