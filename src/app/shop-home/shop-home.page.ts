import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { NavController, ToastController, IonSlides } from '@ionic/angular';
import { TabService } from '../tab.service';
import { AppComponent } from '../app.component';
import { IonInfiniteScroll } from '@ionic/angular';
import { Location } from '@angular/common';
@Component({
  // selector: 'app-shop-home',
  selector: 'modal-page',
  templateUrl: './shop-home.page.html',
  styleUrls: ['./shop-home.page.scss']
})
export class ShopHomePage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonSlides, { static: false }) ionSlides: IonSlides;
  public UserId;
  public TenantId;
  public ExhibitionId;
  public CategoriesFirstList;
  public CategoriesSecondList;
  public VisitorRecordId;
  public goodsList;
  public isGoodsNull;
  public bannerList;
  public isBanner;
  private pageIndex; // 分页查询课程
  public isMoreGoods; // 是否 有更多课程
  private devWidth; // 设备宽度
  private HeightDiff; // 瀑布流高度差

  public slidesOptions = {
    autoplay: {
      disableOnInteraction: false
    }
  };
  constructor(
    private tabService: TabService,
    public nav: NavController,
    public router: Router,
    private http: HttpClient,
    public storage: Storage,
    public toastController: ToastController,
    private loc: Location
  ) { }

  ngOnInit() {
    this.isBanner = true;
    // 获取设备宽度
    this.devWidth = document.body.clientWidth;
    this.HeightDiff = 0;
    this.goodsList = [];
    this.pageIndex = 1;
    this.isMoreGoods = true;
  }

  private ensureTabWillEnter() {
    this.tabService.tab3EnterEvent.subscribe(() => {
      this.getCategoriesFirst();
      this.getProductsPages(this.pageIndex);
      this.getExhibitionBanner();
    });
  }
  ionViewWillEnter() {
    this.tabService.emitTabEnter(3);
    this.getCategoriesFirst();
    this.getProductsPages(this.pageIndex);
    this.getExhibitionBanner();
    this.ionSlides.startAutoplay();
  }
  ionViewWillLeave() {
    this.HeightDiff = 0;
    this.goodsList = [];
    this.pageIndex = 1;
    this.isMoreGoods = true;
  }
  ionViewDidEnter() {
    this.startPlay();
  }
  startPlay() {
    var that = this;
    if (that.bannerList && that.bannerList.length > 0) {
      setTimeout(() => {
        if (that.ionSlides != null) {
          that.ionSlides.startAutoplay();
        }
      }, 1000);
    }
  }
  ionViewDidLeave() {
    if (this.ionSlides != null) {
      this.ionSlides.stopAutoplay();
    }
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }
  goToTest() {
    this.router.navigateByUrl('/tabs/tabs/tab1');
  }
  // 查看每种分类的商品
  goToDetail(id) {
    this.router.navigateByUrl('/every-first-category/' + id + '&1');
    // every-first-category.page
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
            ExhibitionId: exhibitionId
          },
          options: {
            pageIndex: 1,
            pageSize: 9,
            sort: {
              Sort: 1
            }
          }
        }
      };

      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/queryList/CategoryFirst',
          queryCategoriesFirst
        )
        .subscribe(res => {
          this.CategoriesFirstList = (res as any).result;
        });
    });
  }
  // 查询商品

  getProductsList() {
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
            IsShow: true,
            IsRecycled: false,
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
          if ((res as any).resCode === 0) {
            this.goodsList = (res as any).result;
            this.isGoodsNull = false;
          } else {
            this.goodsList = []
            this.isGoodsNull = true;
          }
        });
    });
  }
  // 分页查询商品
  getProductsPages(pageIndex) {
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
            IsShow: true,
            IsRecycled: false,
            ExhibitionId: exhibitionId,
            SourceType: '商城',
            ProductType: '商品'
          },
          properties: ['ProductId.Product.___all'],
          options: {
            pageIndex,
            pageSize: 10
          }
        }
      };
      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            const ArrResult = (res as any).result;
            let _this = this;
            Promise.all(
              ArrResult.map(element => {
                return new Promise((resolve, reject) => {
                  element.float = 'left';
                  AppComponent.imgReady(element.PicList[0].PicPath, function () {
                    const imgHeight = this.height / (this.width / _this.devWidth) * 0.47;
                    const DivHeight = parseFloat(imgHeight.toFixed(2)) + 70;
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
              // 无商品
              this.goodsList = [];
              this.isGoodsNull = true;
            } else {
              // 无更多商品 全部加载完毕
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
      this.getProductsPages(this.pageIndex);
    }, 800);
  }

  // 去购物车
  goToCartList() {
    Promise.all([
      this.storage.get('VisitorRecordId')
    ]).then(([VisitorRecordId]) => {
      if (VisitorRecordId && VisitorRecordId.length == 24) {
        this.router.navigateByUrl('/cart-list');
      } else {
        this.presentToast('登录后才可以使用哦！');
      }
    });
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

  // 查看商品详情
  goToDetails(id) {
    if (id) {
      this.router.navigateByUrl('/goods-details/' + id);
    }
  }
  // 去搜索商品
  goToSearch() {
    // this.router.navigateByUrl('/goods-details/' + id);
    this.router.navigateByUrl('/search/3');
  }
  goToCategories() {
    this.router.navigateByUrl('/categories');
  }

  getExhibitionBanner() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, userId, ExhibitionId]) => {
      let params = {
        TenantId: tenantId,
        UserId: userId,
        params: {
          condition: {
            ExhibitionId: ExhibitionId,
            Type: '3'
          }
        }
      };

      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/queryList/ExhibitionBanner',
          params
        )
        .subscribe(
          res => {
            if ((res as any).resCode === 0) {
              this.bannerList = (res as any).result;
              this.isBanner = true;
            } else {
              this.bannerList = [];
              this.isBanner = false;
            }
          },
          error => { }
        );
    });
  }
}
