import { AfterViewInit } from '@angular/core';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { NavController, IonContent } from '@ionic/angular';
import { ToastController, ModalController } from '@ionic/angular';
import { AddTeachingNewPage } from '../add-teaching-new/add-teaching-new.page';
import { error } from '@angular/compiler/src/util';
import { Tab3Page } from '../tab3/tab3.page';
import { TabService } from '../tab.service';
import { IonInfiniteScroll, IonSlides } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonSlides, { static: false }) ionSlides: IonSlides;
  public testhaha;
  public isGoods;
  public products;
  public params;
  public bannerList;
  public coursesList;
  public TenantId;
  public UserId;
  public ExhibitionId;
  public IsFirstList;
  public IsCollection;
  public isLike;
  public isRecommend;
  public coursesFollowList; // 收藏教程
  public test111;
  public isBanner;
  public teachingNumber;
  public i;
  public isCourseEmpty;
  public k;
  public isCollectEmpty;
  public blackList;
  private destroySub = new Subject<void>();
  private devWidth;
  private HeightDiff;
  public isMoreCollection;
  public slidesOptions = {
    autoplay: {
      disableOnInteraction: false
    },
    autoHeight: true
  };
  constructor(
    public toastController: ToastController,
    public router: Router,
    private http: HttpClient,
    public storage: Storage,
    public nav: NavController,
    public modalController: ModalController,
    private tabService: TabService,
    private loc: Location
  ) { }

  ngOnInit() {
    // 获取设备宽度
    this.devWidth = document.body.clientWidth;
    this.HeightDiff = 0;
    this.i = 1;
    this.k = 1;
    this.isCourseEmpty = false;
    this.isMoreCollection = true;
    this.coursesList = [];
    this.teachingNumber = 1;
    this.isBanner = true;
    this.testhaha = 'hahah1';
    this.blackList = [];
    // 获取缓存里数据
    this.isRecommend = true;
    this.isLike = false;
    this.isGoods = true;
    this.IsFirstList = false;
    this.IsCollection = false;
    this.products = [];
    this.bannerList = [];
    this.params;
    this.ensureTabWillEnter();
    this.getProductListByPage1(1);
  }
  ionViewDidEnter() {
    this.infiniteScroll.disabled = false;
    this.startPlay();
  }
  ngAfterViewInit() {
  }
  ionViewWillLeave() {
    // 获取设备宽度
    this.devWidth = document.body.clientWidth;
    this.HeightDiff = 0;
    this.i = 1;
    this.k = 1;
    this.isCourseEmpty = false;
    this.isMoreCollection = true;
    this.coursesList = [];
    this.teachingNumber = 1;
    this.isBanner = true;
    this.testhaha = 'hahah1';
    this.blackList = [];
    // 获取缓存里数据
    this.isRecommend = true;
    this.isLike = false;
    this.isGoods = true;
    this.IsFirstList = false;
    this.IsCollection = false;
    this.products = [];
    this.bannerList = [];
  }
  ngOnDestroy() {
    this.destroySub.next();
    this.destroySub.complete();
  }
  ionViewWillEnter() {
    this.HeightDiff = 0;
    this.i = 1;
    this.k = 1;
    this.isRecommend = true;
    this.getExhibitionBanner();
    this.queryIsStore();
    this.queryBlacklist();
    this.getProductListByPage1(1);
    this.getFollowingTeaching();
    this.ionSlides.startAutoplay();
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

  async presentModal1() {
    const modal = await this.modalController.create({
      component: AddTeachingNewPage,
      // cssClass: 'addMyCart',
      componentProps: {
        source: '0'
        // goodsDetaiInfo: this.goodsDetaiInfo,
        // goodsPrice: this.goodsPrice,
        // goodsVolum: this.goodsVolum,
        // sizeId: this.sizeId,
        // isSpec: this.isSpec,
        // goodsId: this.goodsId
      }
    });
    modal.onDidDismiss().then(
      () => {
        this.HeightDiff = 0;
        this.i = 1;
        this.k = 1;
        this.getProductListByPage1(1);
      },
      () => { }
    );
    return await modal.present();
  }

  // 获取展会信息 存缓存
  getInofomation() {
    // 查询展会
    // 缓存如果有就不做操作，没有的话就查询存缓存
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId')
    ]).then(
      ([tenantId, exhibitionId]) => {
        if (null == tenantId || null == exhibitionId) {
          let exData = {
            params: {
              condition: {
                ExName: '美尚云讯'
              }
            }
          };
          this.http
            .post(AppComponent.apiUrl + 'v2/data/queryList/Exhibition', exData)
            .subscribe(res => {
              // debugger
              if ((res as any).resCode == 0) {
                let resultInfo = (res as any).result;
                this.storage.set('TenantId', resultInfo[0].TenantId);
                // ExhibitionId
                this.storage.set('ExhibitionId', resultInfo[0].RecordId);
                this.storage.set('UserId', resultInfo[0].UserId);
              }
            });
        } else {
        }
      },
      function (error) {
        // do something when failure
      }
    );
  }
  // 返回上一页
  canGoBack() {
    this.loc.back();
  }
  goToCollect(id) {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      let teachingData = {
        userId: userId,
        tenantId: tenantId,
        params: {
          record: {
            ExhibitionId: exhibitionId,
            ExhibitorId: '',
            ProductId: id,
            VisitorId: VisitorRecordId,
            CollectedExhibitorExhibitionInfoId: ''
          }
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/insert/CollectionInfo',
          teachingData
        )
        .subscribe(res => {
          let result_info = (res as any).result;
          this.isLike = true;
          this.presentToast('收藏成功');
        });
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
  // 查询推荐课程列表
  // 新增话题
  addTopic() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, userId, ExhibitionId]) => {
      // let courseData = {
      //   'tenantId': tenantId,
      //   'userId': userId,
      //   'UserId': '5bbececca29bab4080a7a17c',
      //   'TenantId': '532ad4c34138982cbb4e9397d26d107f',
      //   'params': {
      //     'record': {
      //       'ExhibitionId': '5b174d60dc767494168f874a',
      //       'VisitorId': '5b17e21b3ed95aa82e2f96f9',
      //       'IsShow': true,
      //       'ContactId': '',
      //       'Logo': 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKT7Exm9wh9wsZCJ9EA1ouicOJeqRib6Yfm2kc3YgtJNSiaswtPqWH46j79Ncjhv3JVd6t0p786UG5nw/132',
      //       'CreatedName': '小花',
      //       'Name': '秒杀全场',
      //       'Content': '我是大美人',
      //       'type': 'meishang',
      //       'MessageNumber': 0,
      //       'ThumpUpNumber': 0
      //     }
      //   }
      // }
      // this.http.post(AppComponent.apiUrl + 'v2/data/Insert/Topic', this.params)
      //   .subscribe(res => {
      //     this.coursesList = (res as any).result;
      //   })
    });
  }
  // 查询教程列表
  getProductList() {
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
            IsRelease: true,
            SourceType: '商城',
            ProductType: '教程',
            IsShow: true
          },
          properties: [
            'ProductId.Product.___all',
            'VisitorExhibitionInfoId.VisitorExhibitionInfo.___all'
          ],
          options: {
            pageIndex: 1,
            pageSize: 10
          }
        }
      };

      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            this.coursesList = (res as any).result;
            this.IsFirstList = false;
          } else {
            this.coursesList = [];
            this.IsFirstList = true;
          }
        });
    });
  }
  gotoCamera() {
    this.router.navigateByUrl('/test');
  }
  gotoPCQ() {
    this.router.navigateByUrl('/test2');
  }
  // 去新增教程
  goToAddTeaching() {
    this.router.navigateByUrl('/add-teaching');
  }
  // 查看教程详情
  goToTeachingDetails(id) {
    if (id) {
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
              IsRelease: true,
              SourceType: '商城',
              ProductType: '教程',
              RecordId: id
            }
          }
        };
        this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
          .subscribe(res => {
            if ((res as any).resCode === 0) {
              if ((res as any).result[0].IsShow === true) {
                this.router.navigateByUrl('/lessons-details/' + id);
              } else {
                this.presentToast('该教程已被屏蔽');
                this.HeightDiff = 0;
                this.i = 1;
                this.k = 1;
                this.getProductListByPage1(1);
              }
            }
          });
      });
    }
  }
  goToNext() {
    // this.router.navigateByUrl('/sys-msg-list');
    this.isGoods = !this.isGoods;
  }
  // 去签到
  goToSign() {
    // 判断时候登录
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      if (null == VisitorRecordId || undefined === VisitorRecordId) {
        this.router.navigateByUrl('/login-by-phone');
      } else {
        this.router.navigateByUrl('/to-sign');
      }
    });
    this.router.navigateByUrl('/to-sign');
  }
  // 切换tab
  goToChange() {
    this.isRecommend = !this.isRecommend;
    this.HeightDiff = 0;
    this.i = 1;
    this.k = 1;
    if (this.isRecommend) {
      this.getProductListByPage1(1);
    } else {
      // this.getFollowingTeaching();
      this.getCollectListByPage1(1);
    }
  }

  // 去搜索
  goToSearch() {
    this.router.navigateByUrl('/search/1');
  }

  // 查看消息列表
  goToMsgList() {
    Promise.all([
      this.storage.get('VisitorRecordId')
    ]).then(([VisitorRecordId]) => {
      if (VisitorRecordId && VisitorRecordId.length == 24) {
        this.router.navigateByUrl('/sys-msg-list');
      } else {
        this.presentToast('登录后才可以使用哦！');
      }
    });
  }

  getExhibitionBanner() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, userId, ExhibitionId]) => {
      this.params = {
        TenantId: tenantId,
        UserId: userId,
        params: {
          condition: {
            ExhibitionId: ExhibitionId,
            Type: '1'
          }
        }
      };
      // this.appService.httpPost(AppGlobal.API.getList, this.params, rs => {
      // this.http.head('Content-Type:application/x-www-form-urlencoded')
      // var headers = new Headers();
      // headers.append('Content-Type', 'application/json');
      // headers.append('Authorization', 'weixiao-token');//这里添加了token
      // let options = JSON.stringify({ headers: headers });
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/queryList/ExhibitionBanner',
          this.params
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

  addTezching() {
    // 发布教程
    let teachingData = {};
    // AppComponent.apiUrl + v2/data/Insert/Product
  }

  // 查询点赞总数
  getCollectNumbers() { }

  async presentModal() {
    const modal = await this.modalController.create({
      component: Tab3Page,
      componentProps: { value: 123 }
      // cssClass: 'GoToAddCartPage'
    });
    return await modal.present();
  }

  // 查看物流接口
  getRouteInfo() {
    // 时间
    let time = new Date();
    let mon = time.getMonth() + 1;
    // 物流运单号 测试：3914855547508
    let nu = '3914855547508';
    let com = 'auto';
    let showapi_timestamp =
      '' +
      time.getFullYear() +
      mon +
      time.getDate() +
      time.getHours() +
      time.getMinutes() +
      time.getSeconds();
    let senderPhone = '';
    let receiverPhone = '';
    let showapi_appid = '98211';

    let showapi_sign = 'ecc1c4e6948f4d5eb4de331a76ba4d55';

    this.http
      .post(
        'https://route.showapi.com/64-19?showapi_appid=' +
        showapi_appid +
        '&showapi_sign=' +
        showapi_sign +
        '&showapi_timestamp=' +
        showapi_timestamp +
        '&com=' +
        com +
        '&nu=' +
        nu +
        '&senderPhone=&receiverPhone=',
        {}
      )
      .subscribe(res => {
        let routesList = (res as any).showapi_res_body;
        let routesInfo = (routesList as any).data;
      });
  }

  private ensureTabWillEnter() {
    this.tabService.tab1EnterEvent
      .pipe(takeUntil(this.destroySub.asObservable()))
      .subscribe(() => {
        this.queryBlacklist();
        this.getExhibitionBanner();
        this.i = 1;
        this.getInofomation();
        this.getFollowingTeaching();
        this.isRecommend = true;
        this.queryIsStore();
      });
  }

  // 预览图片
  goToViewPic(id) {
    // this.photoViewer.show('https://mysite.com/path/to/image.jpg')
    // this.photoViewer.show(id);
  }

  goToSave() {
    //   this.photoLibrary.requestAuthorization().then(() => {
    //     this.photoLibrary.getLibrary().subscribe({
    //       next: library => {
    //         library.forEach(function (libraryItem) {
    //           console.log(libraryItem.id);          // ID of the photo
    //           console.log(libraryItem.photoURL);    // Cross-platform access to photo
    //           console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
    //           console.log(libraryItem.fileName);
    //           console.log(libraryItem.width);
    //           console.log(libraryItem.height);
    //           console.log(libraryItem.creationDate);
    //           console.log(libraryItem.latitude);
    //           console.log(libraryItem.longitude);
    //           console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
    //         });
    //       },
    //       error: err => { console.log('could not get photos'); },
    //       complete: () => { console.log('done getting photos'); }
    //     });
    //   })
    //     .catch(err => console.log('permissions weren\'t granted'));
  }
  //  查看下一页数据
  // goToGetNext(){
  //   this.teachingNumber = this.teachingNumber+1
  //   this.getProductListByPage1(this.teachingNumber)
  // }
  // 查询关注的人发布的教程
  getFollowingTeaching() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      // 判断用户已经登录
      if (VisitorRecordId && VisitorRecordId.length == 24) {
        this.UserId = userId;
        this.TenantId = tenantId;
        this.ExhibitionId = ExhibitionId;
        let courseData = {
          tenantId: tenantId,
          userId: userId,
          params: {
            condition: {
              ExhibitionId,
              VisitorId: VisitorRecordId,
              CollectionByWhat: '收藏教程'
            },
            properties: [
              'ProductId.Product.___all',
              'ProductVisitorExhibitionId.VisitorExhibitionInfo.___all'
            ]
            // options: {
            //   pageIndex: 2,
            //   pageSize: 10
            // }
          }
        };
        this.http
          .post(
            AppComponent.apiUrl + 'v2/data/queryList/CollectionInfo',
            courseData
          )
          .subscribe(res => {
            if ((res as any).resCode === 0) {
              let arr = (res as any).result;
              let arr1 = [];
              arr.forEach(element => {
                if (element.ProductId) {
                  if (element.ProductId.IsRelease === true && element.ProductId.IsShow === true) {
                    arr1.push(element);
                  }
                }
              });
              this.coursesFollowList = arr1;
              this.IsCollection = false;
            } else {
              this.coursesFollowList = [];
              this.IsCollection = true;
            }
          });
      } else {
        this.coursesFollowList = [];
        this.IsCollection = true;
      }
    });
  }
  getCollectListByPage1(pageIndex) {
    if (pageIndex === 1) {
      this.k = 1;
      this.coursesFollowList = [];
    }
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) =>{
      // 判断用户已经登录
      if (VisitorRecordId && VisitorRecordId.length === 24) {
        this.UserId = userId;
        this.TenantId = tenantId;
        this.ExhibitionId = ExhibitionId;
        let courseData = {
          tenantId: tenantId,
          userId: userId,
          params: {
            condition: {
              ExhibitionId,
              VisitorId: VisitorRecordId,
              CollectionByWhat: '收藏教程'
            },
            properties: [
              'ProductId.Product.___all',
              'ProductVisitorExhibitionId.VisitorExhibitionInfo.___all'
            ],
            options: {
              pageIndex,
              pageSize: 10
            }
          }
        };
        this.http
          .post(
            AppComponent.apiUrl + 'v2/data/queryList/CollectionInfo',
            courseData
          )
          .subscribe(res => {
            if ((res as any).resCode === 0) {
              let arr = (res as any).result;
              let arr1 = [];
              arr.forEach(element => {
                if (element.ProductId) {
                  if (element.ProductId.IsRelease === true && element.ProductId.IsShow === true) {
                    arr1.push(element);
                  }
                }
              });
              const ArrResult = arr1;
              let _this = this;
              Promise.all(
                ArrResult.map(element => {
                  return new Promise((resolve, reject) => {
                    element.float = 'left';
                    AppComponent.imgReady(element.ProductId.PicList[0].PicPath, function() {
                      let imgHeight = this.height / (this.width / _this.devWidth) * 0.47;
                      let DivHeight = parseFloat(imgHeight.toFixed(2)) + 69;
                      element.DivHeight = DivHeight;
                      resolve(element);
                    }, error);
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
                });
              });
              this.coursesFollowList = this.coursesFollowList.concat(ArrResult);
              this.isMoreCollection = true;
            } else {
              this.isMoreCollection = false;
            }
          });
      } else {
        this.coursesFollowList = [];
        this.IsCollection = true;
      }
    });
  }
  getProductListByPage1(pageIndex) {
    if (pageIndex === 1) {
      this.i = 1;
      this.coursesList = [];
    }
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      let orderParams = {
        userId: userId,
        tenantId: tenantId,
        params: {
          condition: {
            VisitorId: VisitorRecordId
          }
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/queryList/VisitorBlackList',
          orderParams
        )
        .subscribe(res => {
          let courseData = {};
          if ((res as any).resCode === 0) {
            let arr1 = [];
            let array = (res as any).result;
            for (let index = 0; index < array.length; index++) {
              const element = array[index];
              arr1.push(element.VisitorInBlacklist);
            }
            courseData = {
              tenantId: tenantId,
              userId: userId,
              params: {
                condition: {
                  ExhibitionId,
                  IsRelease: true,
                  SourceType: '商城',
                  ProductType: '教程',
                  IsShow: true,
                  AuthorId: {
                    $nin: arr1
                  }
                },
                properties: [
                  'ProductId.Product.___all',
                  'VisitorExhibitionInfoId.VisitorExhibitionInfo.___all'
                ],
                options: {
                  pageIndex,
                  pageSize: 10
                }
              }
            };
            this.http
              .post(
                AppComponent.apiUrl + 'v2/data/queryList/Product',
                courseData
              )
              .subscribe(res => {
                if ((res as any).resCode === 0) {
                  const ArrResult = (res as any).result;
                  let _this = this;
                  Promise.all(
                    ArrResult.map(element => {
                      return new Promise((resolve, reject) => {
                        element.float = 'left';
                        AppComponent.imgReady(element.PicList[0].PicPath, function() {
                          let imgHeight = this.height / (this.width / _this.devWidth) * 0.47;
                          let DivHeight = parseFloat(imgHeight.toFixed(2)) + 69;
                          element.DivHeight = DivHeight;
                          resolve(element);
                        }, error);
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
                      console.log(`HeightDiff`, _this.HeightDiff, index)
                    });
                  });
                  this.coursesList = this.coursesList.concat(ArrResult);
                  this.IsFirstList = false;
                  this.isCourseEmpty = false;
                } else {
                  if (this.i === 1) {
                    this.isCourseEmpty = true;
                  } else {
                    this.isCourseEmpty = false;
                    this.infiniteScroll.disabled = true;
                  }
                  this.IsFirstList = true;
                }
              });
          } else {
            courseData = {
              tenantId: tenantId,
              userId: userId,
              params: {
                condition: {
                  ExhibitionId,
                  IsRelease: true,
                  SourceType: '商城',
                  ProductType: '教程',
                  IsShow: true
                },
                properties: [
                  'ProductId.Product.___all',
                  'VisitorExhibitionInfoId.VisitorExhibitionInfo.___all'
                ],
                options: {
                  pageIndex,
                  pageSize: 10
                }
              }
            };
            this.http
              .post(
                AppComponent.apiUrl + 'v2/data/queryList/Product',
                courseData
              )
              .subscribe(res => {
                if ((res as any).resCode === 0) {
                  const ArrResult = (res as any).result;
                  let _this = this;
                  Promise.all(
                    ArrResult.map(element => {
                      return new Promise((resolve, reject) => {
                        element.float = 'left';
                        AppComponent.imgReady(element.PicList[0].PicPath, function() {
                          let imgHeight = this.height / (this.width / _this.devWidth) * 0.47;
                          let DivHeight = parseFloat(imgHeight.toFixed(2)) + 69;
                          element.DivHeight = DivHeight;
                          resolve(element);
                        }, error);
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
                      console.log(`HeightDiff`, _this.HeightDiff, index)
                    });
                  });
                  this.coursesList = this.coursesList.concat(ArrResult);
                  this.IsFirstList = false;
                  this.isCourseEmpty = false;
                } else {
                  if (this.i === 1) {
                    this.isCourseEmpty = true;
                  } else {
                    this.isCourseEmpty = false;
                    this.infiniteScroll.disabled = true;
                  }
                  this.IsFirstList = true;
                }
              });
          }
        });
    });
  }
  loadData1(event) {
    this.i = this.i + 1;
    setTimeout(() => {
      event.target.complete();
      this.getProductListByPage1(this.i);
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
    }, 800);
  }
  loadData2(event) {
    this.k = this.k + 1;
    console.log('loadData2')
    setTimeout(() => {
      event.target.complete();
      this.getCollectListByPage1(this.k);
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
    }, 800);
  }


  getNode() {
    let parentNode = document.getElementById('container');
    let childNodeArray: any = parentNode.getElementsByClassName('box');
    let screenWidth = document.documentElement.clientWidth;
    let childWidth = childNodeArray[0].offsetWidth;
    let num = Math.floor(screenWidth / childWidth); // 获得一排摆的个数 用Math.floor()转换为整数
    parentNode.style.cssText =
      'width:' + childWidth * num + 'px; margin:0 auto'; // 固定container的宽并设置居中
    this.setImagePosition(num, childNodeArray);
  }

  setImagePosition(num, childArray) {
    var imgHeightArray = []; // 定义数组用于存放所有图片的高度
    for (var i = 0; i < childArray.length; i++) {
      // 遍历所有图片
      if (i < num) {
        imgHeightArray[i] = childArray[i].offsetHeight; // 取得第一排图片的高度
      } else {
        var minHeight = Math.min.apply(null, imgHeightArray); // 获取第一排图片中高度最小的图片
        var minIndex = this.getMinHeight(imgHeightArray, minHeight); // 函数获得高度最小的图片的位置
        childArray[i].style.position = 'absolute'; // 绝对定位图片
        childArray[i].style.top = minHeight + 'px'; // 图片距顶部像素
        childArray[i].style.left = childArray[minIndex].offsetLeft + 'px'; // 图片距左的像素
        imgHeightArray[minIndex] =
          imgHeightArray[minIndex] + childArray[i].offsetHeight; // 将最低高度的box的高度加上它下方的box高度
      }
    }
  }

  getMinHeight(imgHeightArray, minHeight) {
    for (var i in imgHeightArray) {
      if (imgHeightArray[i] == minHeight) {
        // 循环所有数组的高度 让它等于最小图片的高度 返回i值
        return i;
      }
    }
  }

  // 这里是借助ionic的上拉加载代替网页的滚动监听实现加载更多
  doInfinite(infiniteScroll) {
    // 添加新数据
    let parentNode = document.getElementById('container');
    // let imgList = this.img_data;
    let imgList = [];
    for (var i = 0; i < imgList.length; i++) {
      let divNode = document.createElement('div'); // 创建div节点
      divNode.className = 'box'; // 为节点添加box类名
      parentNode.appendChild(divNode); // 添加根元素
      let subDivNode = document.createElement('div'); // 创建节点
      subDivNode.className = 'box_img'; // 为节点添加类名
      divNode.appendChild(subDivNode); // 添加根元素
      var img = document.createElement('img'); // 创建节点
      img.src = imgList[i].src; // 图片加载路径
      subDivNode.appendChild(img); // 添加根元素
    }
    this.getNode();
    // setTimeout(() => { infiniteScroll.complete() }, 1000);
  }

  classification() {
    this.router.navigateByUrl('/course-classification');
  }

  // 查询用户是否是商家
  queryIsStore() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId'),
      this.storage.get('Phone')
    ]).then(([tenantId, exhibitionId, UserId, Phone]) => {
      // 查询手机号是否已注册
      // let Phone='13612207521'
      let queryIsSign = {
        tenantId: tenantId,
        userId: UserId,
        params: {
          condition: {
            ExhibitionId: exhibitionId,
            Tel: Phone
          }
        }
      };
      // 查询用户表
      // alert(JSON.stringify(queryIsSign))
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/queryList/ExhibitorExhibitionInfo',
          queryIsSign
        )
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            // 已注册 弹出提示
            let storeId = (res as any).result[0].ExhibitorId;
            this.storage.set('ExhibitorId', storeId);
          } else {
            this.storage.set('ExhibitorId', '');
          }
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

  // 查询黑名单
  // 查询是否
  queryBlacklist() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('blacklist')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId, blacklist]) => {
      let orderParams = {
        userId: userId,
        tenantId: tenantId,
        params: {
          condition: {
            VisitorId: VisitorRecordId
          }
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/queryList/VisitorBlackList',
          orderParams
        )
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            let arr1 = [];
            let array = (res as any).result;
            for (let index = 0; index < array.length; index++) {
              const element = array[index];
              arr1.push(element.VisitorInBlacklist);
            }
            this.blackList = arr1;
          } else {
            this.blackList = [];
          }
        });
    });
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
}
