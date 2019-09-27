import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { IonInfiniteScroll } from '@ionic/angular';
import { Location } from '@angular/common';
@Component({
  selector: 'app-every-first-category',
  templateUrl: './every-first-category.page.html',
  styleUrls: ['./every-first-category.page.scss'],
})
export class EveryFirstCategoryPage implements OnInit {
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  public UserId;
  public TenantId;
  public ExhibitionId;
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
  public productType;
  public headerText;
  private pageIndex; // 分页查询
  public isMoreGoods; // 是否 有更多商品
  private devWidth; // 设备宽度
  private HeightDiff; // 瀑布流高度差
  private AddHeight; // 瀑布流增加高度
  constructor(public toastController: ToastController, public nav: NavController,
              public alertController: AlertController,
              private loc: Location,
              public router: Router,
              private http: HttpClient,
              public storage: Storage) { }
  ngOnInit() {
  }
  ionViewWillEnter() {
    const aa = this.router.url;
    const arr = aa.split('/');
    const str = arr[2];
    const arr2 = str.split('&');
    this.cateoryId = arr2[0];
    this.type = arr2[1];
    this.isSearch = false;
    this.isSearchNull = false;
    this.searchValue = '';
    this.pageIndex = 1;
    this.isMoreGoods = true;
    // 获取设备宽度
    this.devWidth = document.body.clientWidth;
    this.HeightDiff = 0;
    this.goodsList = [];
    this.getProductPages(this.pageIndex);
    this.getCategoriesFirst();
  }
  ionViewWillLeave() {
    this.isSearch = false;
    this.isSearchNull = false;
    this.searchValue = '';
    this.pageIndex = 1;
    this.isMoreGoods = true;
    // 获取设备宽度
    this.devWidth = document.body.clientWidth;
    this.HeightDiff = 0;
    this.goodsList = [];
  }
  // 返回上一页
  canGoBack() {
    this.loc.back();
  }
  // 查询商品
  getProductsList() {
    if (this.type === '0') {
      this.productType = '教程';
    } else if (this.type === '1') {
      this.productType = '商品';
    }
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      const courseData = {
        UserId: userId,
        TenantId: tenantId,
        params: {
          condition: {
            CategoryFirstId: this.cateoryId,
            ExhibitionId: exhibitionId,
            SourceType: '商城',
            ProductType: this.productType,
            IsRecycled: false,
            IsShow: true,
          },
          properties: ['ProductId.Product.___all', 'VisitorExhibitionInfoId.VisitorExhibitionInfo.___all'],
          // options: {
          //   pageIndex: 1,
          //   pageSize: 10
          // }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            this.goodsList = (res as any).result;
            this.isGoodsNull = false;
          } else {
            this.isGoodsNull = true;
          }
        });
    });
  }
  getProductPages(pageIndex) {
    if (this.type === '0') {
      this.productType = '教程';
      this.AddHeight = 69;
    } else if (this.type === '1') {
      this.productType = '商品';
      this.AddHeight = 81;
    }
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      const courseData = {
        UserId: userId,
        TenantId: tenantId,
        params: {
          condition: {
            CategoryFirstId: this.cateoryId,
            ExhibitionId: exhibitionId,
            SourceType: '商城',
            ProductType: this.productType,
            IsRecycled: false,
            IsShow: true,
          },
          properties: ['ProductId.Product.___all', 'VisitorExhibitionInfoId.VisitorExhibitionInfo.___all'],
          options: {
            pageIndex,
            pageSize: 10
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            const ArrResult = (res as any).result;
            let _this = this;
            Promise.all(
              ArrResult.map(element => {
                return new Promise((resolve, reject) => {
                  element.float = 'left';
                  AppComponent.imgReady(element.PicList[0].PicPath, function() {
                    const imgHeight = this.height / (this.width / _this.devWidth) * 0.47;
                    const DivHeight = parseFloat(imgHeight.toFixed(2)) + _this.AddHeight;
                    element.DivHeight = DivHeight;
                    resolve(element);
                  }, Error);
                });
              })
            ).then(element => {
              ArrResult.forEach((element, index) => {
                element.float = 'left';
                if (_this.HeightDiff > 0) {
                  element.float = 'right';
                  _this.HeightDiff = _this.HeightDiff - element.DivHeight;
                } else {
                  _this.HeightDiff = _this.HeightDiff + element.DivHeight;
                }
                console.log(`HeightDiff2`, _this.HeightDiff, index);
              });
            });
            this.goodsList = this.goodsList.concat(ArrResult);
            this.isGoodsNull = false;
          } else {
            if (this.pageIndex === 1) {
              this.isGoodsNull = true;
            } else {
              this.isMoreGoods = false;
            }
          }
        });
    });
  }
  // 分页获取商品列表 课程滚动加载
  loadData1(event) {
    this.pageIndex = this.pageIndex + 1;
    setTimeout(() => {
      event.target.complete();
      this.getProductPages(this.pageIndex);
    }, 800);
  }
  // 提示
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
  // 搜索课程
  // 搜索
  goToSearch() {
    let courseData = {};
    if (this.type === '0') {
      this.productType = '教程';
    } else if (this.type === '1') {
      this.productType = '商品';
    }
    this.isSearch = true;
    // 查询商品
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, userId, ExhibitionId]) => {
      if (this.type === '0') {
        this.productType = '教程';
        courseData = {
          tenantId,
          userId,
          params: {
            condition: {
              IsRelease: true,
              IsShow: true,
              ExhibitionId,
              ProductType: '教程',
              // ProductType: '教程程',
              CategoryFirstId: this.cateoryId,
              SourceType: '商城',
              ProductName: '/' + this.searchValue + '/'
            },
            properties: ['ProductId.Product.___all'],
            // options: {
            //   pageIndex: 1,
            //   pageSize: 10
            // }
          }
        };
      } else if (this.type === '1') {
        courseData = {
          tenantId,
          userId,
          params: {
            condition: {
              IsRecycled: false,
              IsShow: true,
              ExhibitionId,
              ProductType: '商品',
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
      }
      if (this.isGoodsNull) {
        this.searchValue = '';
        this.presentToast('暂无商品可搜索');
      } else if (this.searchValue == '') {
        this.presentToast('请输入名称搜索');
      } else {
        this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
          .subscribe(res => {
            if ((res as any).resCode === 0) {
              this.goodsSearchList = (res as any).result;
              this.searchValue = '';
              this.isSearchNull = false;
            } else {
              this.isSearchNull = true;
              this.goodsSearchList = [];
              this.searchValue = '';
            }
          });
      }
    });
  }
  // 查看商品详情
  goToDetails(id) {
    if (this.type === '0') {
      this.router.navigateByUrl('/lessons-details/' + id);
    } else if (this.type === '1') {
      this.router.navigateByUrl('/goods-details/' + id);
    }
  }
  // 字符串压缩处理
  StringCompression(str) {
    if (str.length > 3) {
      let first = str.substr(0, 1);
      let last = str.substr(str.length - 1, 1);
      return first + "**" + last
    } else {
      return str;
    }
  }
  // 查询一级分类
  getCategoriesFirst() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, userId, exhibitionId]) => {
      const queryCategoriesFirst = {
        UserId: userId,
        TenantId: tenantId,
        params: {
          condition: {
            ExhibitionId: exhibitionId,
            RecordId: this.cateoryId
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/CategoryFirst', queryCategoriesFirst)
        .subscribe(res => {
          this.headerText = (res as any).result[0].Name;
        });
    });
  }
}
