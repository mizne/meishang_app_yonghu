import { Component, OnInit, AfterViewInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { GoToAddCartPage } from '../go-to-add-cart/go-to-add-cart.page';
import { GoToAddCartPageModule } from '../go-to-add-cart/go-to-add-cart.module';
import { LoadingController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
// import { NavParams } from '@ionic/angular';
// import Framework7 from 'framework7';
import { Wechat } from '@ionic-native/wechat/ngx';
import { QQSDK, QQShareOptions } from '@ionic-native/qqsdk/ngx';
// Import additional components
// import Searchbar from 'framework7/dist/components/searchbar/searchbar.js';
// import Calendar from 'framework7/dist/components/calendar/calendar.js';
// import Popup from 'framework7/dist/components/popup/popup.js';
import { AppComponent } from '../app.component';
import { FormControl } from '@angular/forms';
import { MySharePage } from '../my-share/my-share.page';
import { Location } from '@angular/common';

// import "tcplayer";
// declare var TcPlayer: any;

@Component({
  selector: 'app-goods-details',
  templateUrl: './goods-details.page.html',
  styleUrls: ['./goods-details.page.scss']
})
export class GoodsDetailsPage implements OnInit {
  // , AfterViewInit
  public UserId;
  public TenantId;
  public ExhibitionId;
  public goodsDetaiInfo;
  public VisitorRecordId;
  public isGoods;
  public isLike;
  public couponsList;
  public bannerList;
  public isCart;
  public numBuy;
  public goodSelect;
  public goodsId;
  public sizeId;
  public goodsPrice;
  public goodsVolum;
  public isSpec; // 判断时候有设置商品规格
  public isCollect;
  public collectId;
  public goodsDetaiMessageInfo;
  public serviceID;
  public onShow;
  public goodsDetaiMessageCount;
  public checkNum;
  public exhibitorId;
  public EEInfoId;
  public Logo;
  public StockName;
  public CreatedBy;
  public shareNum;
  public isQuill;
  public productVideo;
  public isVideo;
  public commentNum;
  public richTextCtrl = new FormControl(null);
  public modules = {
    toolbar: false
  };
  public slideOpts;
  public player: any;
  public showMoreBtn;
  constructor(
    public loadingController: LoadingController,
    public nav: NavController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController,
    public router: Router,
    private qq: QQSDK,
    private http: HttpClient,
    private wechat: Wechat,
    public AppComponent: AppComponent,
    public storage: Storage,
    private loc: Location
  ) {}

  ngOnInit() {
    this.commentNum = 0;
    this.slideOpts = {
      initialSlide: 0,
      speed: 400
      // autoplay: {
      //   delay: 2000,
      // },
    };
    this.isQuill = false;
    this.isSpec = true;
    const aa = this.router.url;
    const arr = aa.split('/');
    this.goodsId = arr[2];
    this.numBuy = 1;
    this.isCart = false;
    this.isGoods = true;
    this.isLike = false;
    this.shareNum = 0;
    // this.bannerList = [];
    if (undefined === this.bannerList) {
      this.presentLoading();
      // this.presentLoading1('图片加载中...');
    }
    this.sizeId = '0';
    this.goodsDetaiInfo = {};
    this.couponsList = ['满100减50', '满200减100', '满200减100'];
    this.goodsDetaiMessageInfo = [];
    this.productVideo = [];
    // this.getProductDetails();
  }

  ngAfterViewInit() {
    // this.getProductDetails()
    if (this.isVideo) {
      // this.player = new TcPlayer('id_test_video', {
      //   'background-color':'#fff',
      //   'mp4': this.productVideo[0].ViedoSrc, //请替换成实际可用的播放地址
      //   'controls':'system',
      //   // 'x5_orientation':2,
      //   'autoplay': false,      //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
      //   'poster': { 'style': 'cover', 'src': this.bannerList},
      //   // 'width': '480',//视频的显示宽度，请尽量使用视频分辨率宽度
      //   // 'height': '350px'//视频的显示高度，请尽量使用视频分辨率高度
      // });
    } else {
    }
  }

  async presentLoading1(msg) {
    const loading = await this.loadingController.create({
      message: msg
      // duration: 1500
    });
    await loading.present();
    // const { role, data } = await loading.onDidDismiss();
    loading.onDidDismiss().then(() => {}, () => {});
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: '加载中...',
      duration: 350
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
  }

  ionViewWillEnter() {
    this.showMoreBtn = false;
    // if (undefined === this.bannerList) {
    //   this.presentLoading();
    // }
    this.getProductDetails();
    this.queryIsCollect();
    this.queryProductVisit();
    this.getCommentList();
    this.queryShareCount();
  }

  async presentModal(type) {
    const modal = await this.modalController.create({
      component: GoToAddCartPage,
      cssClass: 'addMyCart',
      componentProps: {
        goodsDetaiInfo: this.goodsDetaiInfo,
        goodsPrice: this.goodsPrice,
        goodsVolum: this.goodsVolum,
        sizeId: this.sizeId,
        isSpec: this.isSpec,
        goodsId: this.goodsId,
        sourceType: type
      }
    });
    return await modal.present();
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  // 去购物车
  goToCartPage() {
    Promise.all([
      this.storage.get('VisitorRecordId')
    ]).then(([VisitorRecordId]) => {
      if (VisitorRecordId && VisitorRecordId.length == 24) {
        this.router.navigateByUrl('/cart-list');
      } else {
        this.presentToast2('登录后才可以使用哦！');
      }
    });
  }

  queryProductVisit() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, VisitorRecordId]) => {
      const courseData = {
        tenantId,
        userId,
        params: {
          condition: {
            VisitorId: VisitorRecordId,
            ProductId: this.goodsId
          }
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/queryList/ProductVisitInfo',
          courseData
        )
        .subscribe(res => {
          if ((res as any).resCode !== 0) {
            this.insertProductVisit();
          }
        });
    });
  }

  insertProductVisit() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      const courseData = {
        tenantId,
        userId,
        params: {
          record: {
            ExhibitorExhibitionInfoId: this.EEInfoId, // 商品课程  ExhibitorExhibitionInfoId.RecordId
            ExhibitorId: this.exhibitorId, // 商品课程
            ExhibitionId,
            VisitorId: VisitorRecordId,
            ProductId: this.goodsId
          }
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/insert/ProductVisitInfo',
          courseData
        )
        .subscribe(res => {});
    });
  }

  // 收藏
  goToCollect() {
    // 判断时候收藏 已收藏 修改状态  未收藏 新增一个
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      if (VisitorRecordId && VisitorRecordId.length == 24) {
        if (this.isCollect === true) {
          // 取消收藏
          const teachingData = {
            userId: userId,
            tenantId: tenantId,
            params: {
              condition: {
                ExhibitionId: exhibitionId,
                ExhibitorId: '',
                ProductId: this.goodsId,
                VisitorId: VisitorRecordId
              }
            }
          };
          this.http
            .post(
              AppComponent.apiUrl + 'v2/data/deleteByCondition/CollectionInfo',
              teachingData
            )
            .subscribe(res => {
              const result_info = (res as any).result;
              if ((res as any).resCode === 0) {
                this.isCollect = false;
                this.presentToast1();
              }
            });
        } else {
          // 新增收藏
          const teachingData = {
            userId: userId,
            tenantId: tenantId,
            params: {
              record: {
                ExhibitionId: exhibitionId,
                ExhibitorId: this.goodsDetaiInfo.ExhibitorId,
                ProductId: this.goodsId,
                VisitorId: VisitorRecordId,
                CollectedExhibitorExhibitionInfoId: this.serviceID
              }
            }
          };
          this.http
            .post(
              AppComponent.apiUrl + 'v2/data/insert/CollectionInfo',
              teachingData
            )
            .subscribe(res => {
              const result_info = (res as any).result;
              this.isCollect = true;
              this.presentToast();
            });
        }
      } else {
        this.presentToast3('登录后才可以使用哦！', 2000);
      }
    });
  }

  async presentToast1() {
    const toast = await this.toastController.create({
      message: '取消成功',
      duration: 2000,
      color: 'dark',
      cssClass: 'toast-wrapper',
      position: 'middle'
    });
    toast.present();
  }
  async presentToast3(msg, time) {
    const toast = await this.toastController.create({
      message: msg,
      duration: time || 2000,
      color: 'dark',
      cssClass: 'toast-wrapper',
      position: 'middle'
    });
    toast.present();
  }

  // async presentToast3(msg, time) {
  //   const toast = await this.toastController.create({
  //     message: msg,
  //     duration: time,
  //     color: 'dark',
  //     cssClass: 'toast-wrapper',
  //     position: 'middle'
  //   });
  //   toast.present();
  // }

  // async presentToast() {
  //   const toast = await this.toastController.create({
  //     message: '收藏成功',
  //     duration: 2000,
  //     color: 'dark',
  //     cssClass: 'toast-wrapper',
  //     position: 'middle'
  //   });
  //   toast.present();
  // }
  goCilic(id) {
    this.sizeId = id;
    this.goodsPrice = this.goodsDetaiInfo.Specifications[id].price;
    this.goodsVolum = this.goodsDetaiInfo.Specifications[id].total;
  }

  // 弹出购物车
  goToCart() {
    this.isCart = true;
  }

  // 查询这个商品时候收藏
  // 查询是否收藏
  queryIsCollect() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      this.UserId = userId;
      this.TenantId = tenantId;
      this.ExhibitionId = ExhibitionId;
      const courseData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            ExhibitionId: ExhibitionId,
            ProductId: this.goodsId,
            VisitorId: VisitorRecordId,
            CollectionByWhat: '收藏商品'
            // SourceType: '商城',
            // ProductType: '教程'
          }
          // properties: ['ProductId.Product.___all'],
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/queryList/CollectionInfo',
          courseData
        )
        .subscribe(res => {
          const resultInfo = (res as any).result[0];
          if ((res as any).resCode === 0) {
            this.isCollect = true;
          } else {
            this.isCollect = false;
          }
        });
    });
  }

  // 收藏
  addLike() {
    this.isLike = !this.isLike;
  }

  // 我要收藏
  goToAddCollect() {
    // isCollect
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      if (VisitorRecordId && VisitorRecordId.length == 24) {
        if (this.isCollect === true) {
          // 取消收藏

          const teachingData = {
            userId: userId,
            tenantId: tenantId,
            params: {
              condition: {
                CollectionByWhat: '收藏商品',
                ExhibitionId: exhibitionId,
                ProductId: this.goodsId,
                VisitorId: VisitorRecordId
              }
            }
          };
          this.http
            .post(
              AppComponent.apiUrl + 'v2/data/deleteByCondition/CollectionInfo',
              teachingData
            )
            .subscribe(res => {
              const result_info = (res as any).result;
              if ((res as any).resCode === 0) {
                this.isCollect = false;
                this.presentToast2('已取消');
              }
            });
        } else {
          // 新增收藏
          const teachingData = {
            userId: userId,
            tenantId: tenantId,
            params: {
              record: {
                CollectionByWhat: '收藏商品',
                ExhibitionId: exhibitionId,
                ExhibitorId: this.goodsDetaiInfo.ExhibitorId,
                ProductId: this.goodsId,
                VisitorId: VisitorRecordId,
                CollectedExhibitorExhibitionInfoId: this.serviceID
              }
            }
          };
          this.http
            .post(
              AppComponent.apiUrl + 'v2/data/insert/CollectionInfo',
              teachingData
            )
            .subscribe(res => {
              const result_info = (res as any).result;
              this.isCollect = true;
              this.presentToast2('收藏成功');
            });
        }
      } else {
        this.presentToast3('登录后才可以使用哦！', 2000);
      }
    });
  }

  goToNext() {
    this.isGoods = !this.isGoods;
  }

  // 查看商品详情
  getProductDetails() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId')
    ]).then(([tenantId, exhibitionId, userId]) => {
      const goodsData = {
        UserId: userId,
        TenantId: tenantId,
        params: {
          condition: {
            ExhibitionId: exhibitionId,
            RecordId: this.goodsId
          },
          properties: [
            'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'
          ]
        }
      };
      //  'ProductId' : ObjectId('5cb5aebdd9754d97704b77c4'),
      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/Product', goodsData)
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            // 判断是否有详情
            if (
              undefined != (res as any).result[0].ProductDescription &&
              (res as any).result[0].ProductDescription != ''
            ) {
              this.isQuill = true;
              this.richTextCtrl.patchValue(
                (res as any).result[0].ProductDescription
              );
              // this.richTextCtrl.value=(res as any).result[0].ProductDescription;
            } else {
              this.isQuill = false;
            }
            if ((res as any).result[0].ExhibitorExhibitionInfoId) {
              this.serviceID = (res as any).result[0].ExhibitorExhibitionInfoId.RecordId;
              this.EEInfoId = (res as any).result[0].ExhibitorExhibitionInfoId.RecordId;
              this.Logo = (res as any).result[0].ExhibitorExhibitionInfoId.Logo;
              this.StockName = (res as any).result[0].ExhibitorExhibitionInfoId.StockName;
              this.CreatedBy = (res as any).result[0].ExhibitorExhibitionInfoId.CreatedBy;
            } else {
              this.serviceID = '';
              this.EEInfoId = '';
              this.Logo = '';
              this.StockName = '';
              this.CreatedBy = '';
            }
            this.goodsDetaiInfo = (res as any).result[0];
            this.bannerList = this.goodsDetaiInfo.PicList[0].PicPath;
            if (
              this.goodsDetaiInfo.productVideo &&
              this.goodsDetaiInfo.productVideo.length > 0
            ) {
              this.ngAfterViewInit();
              this.productVideo = this.goodsDetaiInfo.productVideo;
              this.isVideo = true;
            } else {
              this.isVideo = false;
              this.productVideo = [];
            }
            // this.loadingController.dismiss({
            // })
            const arr = this.goodsDetaiInfo.Specifications;
            if (arr.length > 0) {
              this.isSpec = false;
              this.goodsVolum = arr[0].total;
              this.goodsPrice = arr[0].price;
            } else {
              this.goodsPrice = this.goodsDetaiInfo.ProductPrice;
              this.isSpec = true;
              this.goodsVolum = this.goodsDetaiInfo.StockNumber;
            }
            this.checkNum = (res as any).result[0].PVNumber;
            this.exhibitorId = (res as any).result[0].ExhibitorId;
          }
        });
    });
  }

  goToService() {
    Promise.all([
      this.storage.get('VisitorRecordId')
    ]).then(([VisitorRecordId]) => {
      if (VisitorRecordId && VisitorRecordId.length == 24) {
        this.router.navigateByUrl('/help-serve/' + this.serviceID);
      } else {
        this.presentToast2('登录后才可以使用哦！');
      }
    });
  }

  // 查看商品评论
  getCommentList() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId')
    ]).then(([tenantId, exhibitionId, userId]) => {
      const goodsData = {
        userId: userId,
        tenantId: tenantId,
        params: {
          condition: {
            ExhibitionId: exhibitionId,
            ProductId: this.goodsId,
            IsEvaluate: true,
            ProductType: '商品',
            SourceType: '商城'
          },
          // 'options': {
          //   'pageIndex': 1, 'pageSize': 3
          // },
          properties: [
            'ProductId.Product.___all',
            'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'
          ]
          // childObjects: [
          //   {
          //     fieldName: 'VisitInfoMessageComment',
          //     reference: {
          //       object: 'VisitInfoMessageComment',
          //       field: 'ProductVisitInfoMessageId'
          //     }
          //   }
          // ]
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/queryList/ProductVisitInfoMessage',
          goodsData
        )
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            const a = [];
            if ((res as any).result.length > 3) {
              for (let index = 0; index < 3; index++) {
                const element = (res as any).result[index];
                a.push(element);
              }
              this.showMoreBtn = true;
              this.goodsDetaiMessageInfo = a;
            } else {
              this.showMoreBtn = false;
              this.goodsDetaiMessageInfo = (res as any).result;
            }
            this.http
              .post(
                AppComponent.apiUrl +
                  'v2/data/queryCount/ProductVisitInfoMessage',
                goodsData
              )
              .subscribe(res => {
                if ((res as any).resCode == 0) {
                  this.goodsDetaiMessageCount = (res as any).result;
                }
              });
          } else {
            this.goodsDetaiMessageCount = 0;
          }
        });
    });
  }

  goToAllComments() {
    this.router.navigateByUrl('/comments-of-shop/' + this.goodsId);
  }

  goToBuy() {}

  async presentToast2(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: 'dark',
      cssClass: 'toast-wrapper',
      position: 'middle'
    });
    toast.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: '不能再少啦',
      duration: 2000,
      color: 'dark',
      cssClass: 'toast-wrapper',
      position: 'middle'
    });
    toast.present();
  }

  // 购物车+
  goToAdd() {
    this.numBuy++;
  }

  // 购物车-
  goToMinus() {
    if (this.numBuy === 1) {
      this.numBuy = 1;
    } else {
      this.numBuy--;
    }
  }

  // 店铺详情
  shopDetail() {
    this.router.navigateByUrl('/store-home/' + this.serviceID);
  }

  // 删除评论
  goTodelete1(index, id) {
    // 查询是不是自己的评论 是自己的可以删除 不是的不做任何操作
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      if (this.goodsDetaiMessageInfo[index].VisitorId === VisitorRecordId) {
        // 是自己的
        this.presentAlert(index, id);
      } else {
        // 不是自己的
      }
    });
  }

  async presentAlert(index, id) {
    const alert = await this.alertController.create({
      header: '',
      subHeader: '',
      message: '确定要删除这条评论吗?',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {}
        },
        {
          text: '确定',
          role: 'Ok',
          cssClass: 'secondary',
          handler: blah => {
            this.deleteComments(index, id);
          }
        }
      ]
    });
    await alert.present();
  }

  // 删除
  deleteComments(index, id) {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('token')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId, token]) => {
      let info = {
        userId: userId,
        tenantId: tenantId,
        params: {
          recordId: id
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/delete/ProductVisitInfoMessage',
          info,
          { headers: { Authorization: 'Bearer ' + token } }
        )
        .subscribe(
          res => {
            let result_info = (res as any).result;
            if ((res as any).resCode === 0) {
              this.goodsDetaiMessageInfo.splice(index, 1);
              this.presentToast3('删除成功', 1500);
              // this.getCommentList()
              // this.getCommentNum()
              this.getCommentList();
            } else {
              this.presentToast3('删除失败', 1500);
            }
          },
          err => {
            if (err.status == 403) {
              this.presentToast3('登录已过期，请重新登录', 1500);
              this.storage.set('VisitorExhibitionInfoId', '');
              this.storage.set('VisitorRecordId', '');
              this.router.navigateByUrl('/login-by-password');
            }
          }
        );
    });
  }

  // 查看分享次数
  queryShareCount() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      const courseData = {
        tenantId,
        userId,
        params: {
          condition: {
            ExhibitionId,
            ProductId: this.goodsId
          },
          properties: ['ProductId.Product.___all']
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/queryCount/ShareHistory',
          courseData
        )
        .subscribe(res => {
          this.shareNum = (res as any).result;
        });
    });
  }

  goToVisitorHome(id) {
    Promise.all([this.storage.get('VisitorRecordId')]).then(
      ([VisitorRecordId]) => {
        if (id == VisitorRecordId) {
          this.router.navigateByUrl('/tabs/tabs/my-collection');
        } else {
          this.router.navigateByUrl('/others-page/' + id);
        }
      }
    );
  }

  goToMore(id) {
    this.router.navigateByUrl('/my-comments/' + id);
  }

  // 查询商品评价的回复数
  queryCommentsNum(id) {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, recordId, VisitorRecordId]) => {
      const requestData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            // ExhibitorId: VisitorRecordId,
            ExhibitionId: recordId,
            ProductVisitInfoMessageId: id
          }
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + '/v2/data/queryCount/VisitInfoMessageComment',
          requestData
        )
        .subscribe(
          res => {
            if ((res as any).resMsg === 'success') {
              let num = (res as any).result;
              return num;
            } else {
              return 0;
            }
          },
          error => {}
        );
    });
  }

  async presentModalShare() {
    Promise.all([this.storage.get('VisitorRecordId')]).then(
      async ([VisitorRecordId]) => {
        if (VisitorRecordId && VisitorRecordId.length == 24) {
          const modal = await this.modalController.create({
            component: MySharePage,
            cssClass: 'myShare',
            componentProps: {
              type: '商品',
              ProductId: this.goodsId
            }
          });
          modal.onDidDismiss().then(
            () => {
              this.queryShareCount();
            },
            () => {}
          );
          return await modal.present();
        } else {
          this.presentToast3('登录后才可以使用哦！', 2000);
        }
      }
    );
  }
}
