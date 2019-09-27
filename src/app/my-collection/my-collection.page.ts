import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { PersonalDataPage } from '../personal-data/personal-data.page';
import { EditTeachingPage } from '../edit-teaching/edit-teaching.page';
import { MyLessonDetailsPage } from '../my-lesson-details/my-lesson-details.page';
import { TabService } from '../tab.service';
import { ToastController } from '@ionic/angular';
import { EditMyTeachingPage } from '../edit-my-teaching/edit-my-teaching.page';
import { LoadingController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
declare var cordova;
@Component({
  selector: 'app-my-collection',
  templateUrl: './my-collection.page.html',
  styleUrls: ['./my-collection.page.scss'],
})
export class MyCollectionPage implements OnInit {
  showFiller = false;
  public version;
  public UserId;
  public TenantId;
  public ExhibitionId;
  public desc;
  public VisitorInfo;
  public myTeachingList;
  public otherTeachingList;
  public isCollect;
  public coursesList;
  public IsFirstList;
  public IsSecondList;
  public coursesFollowList;
  public isTeachingType;
  public IsThirdList;
  public unReleaseList;
  public isLogin;
  public numOFFollowers;
  public numOfFollowing;
  public centerType;
  public productType;
  public IsFourthList;
  public courseList;
  public IsFifthList;
  public productList;
  public IsSixthList;
  public shopList;
  public mypointnum;
  public isStore;
  constructor(public toastController: ToastController, private tabService: TabService,
              public modalController: ModalController, public alertController: AlertController,
              private callNumber: CallNumber, public nav: NavController, public router: Router,
              private http: HttpClient, public storage: Storage,
              public loadingController: LoadingController, private loc: Location) { }

  ngOnInit() {
    this.centerType = '0';
    this.numOfFollowing = 0;
    this.numOFFollowers = 0;
    // this.isLogin = false
    this.isCollect = false;
    this.IsSecondList = false;
    this.IsThirdList = false;
    this.IsFourthList = false;
    this.IsFifthList = false;
    this.IsSixthList = false;
    this.isStore = false;
    this.VisitorInfo = { Sex: '2', logo: '' };
    this.isTeachingType = '0';
    // this.getVisitorInfo()
    // this.getMyTeaching()
  }

  ionViewWillEnter() {
    // this.tabService.emitTabEnter(4)
    this.centerType = '0';
    this.isTeachingType = '0';
    this.gotoLogin();
    this.getVisitorInfo();
    this.getMyTeaching();
    this.getFollowingTeaching();
    this.getProductUnReleaseList();
    this.queryMyFollowersNum();
    this.queryMyFollowingNum();
    this.ensureTabWillEnter();
    this.accountMyPoints();
    this.queryIsStore();
    this.getVersion();
  }

  getVersion() {
    cordova.getAppVersion.getVersionNumber().then((version) => {
      this.version = version;
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

  private ensureTabWillEnter() {
    this.tabService.tab4EnterEvent.subscribe(() => {
      this.accountMyPoints();
      this.getMyTeaching();
      this.queryMyFollowersNum();
      this.queryMyFollowingNum();
      this.queryIsStore();
    });
  }

  // 修改个人资料
  async presentModal1() {
    const modal = await this.modalController.create({
      component: PersonalDataPage,
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
    modal.onDidDismiss().then(() => {
      this.getVisitorInfo();
    }, () => { });
    return await modal.present();
  }

  teachingDetailsModal111(id, isShow) {
    // 判断是否审核
    if (isShow) {
      this.router.navigateByUrl('/lessons-details/' + id);
    } else {
      this.presentToast('教程正在审核中,请耐心等待');
    }
  }

  // 查看教程详情 删除操作 取消收藏
  async teachingDetailsModal1(id) {
    const modal = await this.modalController.create({
      component: MyLessonDetailsPage,
      // cssClass: 'addMyCart',
      componentProps: {
        teachingId: id
      }
    });
    modal.onDidDismiss().then(() => {
      this.getMyTeaching();
      this.getFollowingTeaching();
    }, () => { });
    return await modal.present();
  }

  // 去编辑草稿箱
  async editMyTeaching(id) {
    // if (isShow) {
      const modal = await this.modalController.create({
        component: EditTeachingPage,
        // cssClass: 'addMyCart',
        componentProps: {
          teachingId: id
        }
      });
      modal.onDidDismiss().then(() => {
        this.getProductUnReleaseList();
      }, () => { });
      return await modal.present();
    // } else {
    //   this.presentToast('教程正在审核中,请耐心等待');
    // }
  }

  async presentAlert() {
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
          this.callNumber.callNumber('13776410320', true)
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

  // 投诉
  goToAppeal() {
    this.presentAlert();
    // this.callNumber.callNumber('13776410320', true)
    //   .then(res =>
    //     console.log('Launched dialer!', res)
    //   )
    //   .catch(err => console.log('Error launching dialer', err)
    //   );
  }

  gotoLoginBywechat() {
  }

  gotoLoginByPhone() {
    this.router.navigateByUrl('/login-by-phone');
  }

  // 去登陆
  gotoLogin() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      if (null === VisitorRecordId || undefined === VisitorRecordId || VisitorRecordId === '') {
        this.isLogin = false;
      } else {
        this.isLogin = true;
      }
    });
  }

  // 判断时候登录
  // 查询自己收藏的教程
  getFollowingTeaching() {
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
        tenantId,
        userId,
        params: {
          condition: {
            ExhibitionId,
            VisitorId: VisitorRecordId,
            CollectionByWhat: '收藏教程'
          },
          properties: ['ProductId.Product.___all', 'ProductVisitorExhibitionId.VisitorExhibitionInfo.___all'],
          // options: {
          //   pageIndex: 2,
          //   pageSize: 10
          // }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/CollectionInfo', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            let arr = (res as any).result;
            // this.coursesFollowList = (res as any).result;
            let arr1 = [];
            arr.forEach(element => {
              if (element.ProductId) {
                if (element.ProductId.IsRelease === true && element.ProductId.IsShow === true) {
                  arr1.push(element);
                }
              }
            });
            this.coursesFollowList = arr1;
            this.IsSecondList = false;
          } else {
            this.coursesFollowList = [];
            this.IsSecondList = true;
          }
        });
    });
  }

  // 查询自己的关注数量
  queryMyFollowingNum() {
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
      const courseData = {
        tenantId,
        userId,
        params: {
          condition: {
            ExhibitionId,
            CollectionByWhat: '关注用户',
            VisitorId: VisitorRecordId,
          },
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryCount/CollectionInfo', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            this.numOfFollowing = (res as any).result;
          } else {
            this.numOfFollowing = 0;
          }
        });
    });
  }

  // 查询自己的粉丝量
  queryMyFollowersNum() {
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
        tenantId,
        userId,
        params: {
          condition: {
            ExhibitionId,
            CollectionByWhat: '关注用户',
            CollectedVisitorId: VisitorRecordId,
          },
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryCount/CollectionInfo', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            this.numOFFollowers = (res as any).result;
          } else {
            this.numOFFollowers = 0;
          }
        });
    });
  }

  // 查询草稿箱
  // 查询自己发布的教程
  getProductUnReleaseList() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId'),
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      this.UserId = userId;
      this.TenantId = tenantId;
      this.ExhibitionId = ExhibitionId;
      const courseData = {
        tenantId,
        userId,
        params: {
          condition: {
            ExhibitionId,
            ProductVisitorId: VisitorRecordId,
            SourceType: '商城',
            ProductType: '教程',
            IsRelease: false,
            // IsShow:true
          },
          properties: ['ProductId.Product.___all', 'VisitorExhibitionInfoId.VisitorExhibitionInfo.___all'],
          // options: {
          //   pageIndex: 2,
          //   pageSize: 10
          // }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            this.unReleaseList = (res as any).result;
            this.IsThirdList = false;
          } else {
            this.IsThirdList = true;
            this.unReleaseList = [];
          }
        });
    });
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  // 切换tab
  goToChange() {
    this.isCollect = !this.isCollect;
  }

  // 切换tab
  goToChange1(i) {
    this.isTeachingType = i;
    if (this.isTeachingType === '0') {
      this.getMyTeaching();
    } else if (this.isTeachingType === '1') {
      this.getFollowingTeaching();
    } else if (this.isTeachingType === '2') {
      this.getProductUnReleaseList();
    } else {
      this.isTeachingType = '0';
      this.getMyTeaching();
    }
    // this.isCollect = !this.isCollect
  }

  // 查看教程详情
  goToTeachingDetails(id) {
    this.router.navigateByUrl('/lessons-details/' + id);
  }

  // 去编辑草稿箱
  // goToEditTeachingDetails(id) {
  //   this.router.navigateByUrl('/edit-teaching/' + id);
  // }

  // 查看用户信息
  getVisitorInfo() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId'),
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      const teachingData = {
        tenantId,
        userId,
        params: {
          condition: {
            ExhibitionId: exhibitionId,
            VisitorId: VisitorRecordId,
          },
          properties: ['VisitorId.Visitor.___all'],
          options: { pageIndex: 1, pageSize: 10 }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/VisitorExhibitionInfo', teachingData)
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            this.VisitorInfo = (res as any).result[0];
            this.desc = (res as any).result[0].Remark;
          }

        });
    });
  }

  goToMyfollwing() {
    Promise.all([
      this.storage.get('VisitorRecordId'),
    ]).then(([VisitorRecordId]) => {
      this.router.navigateByUrl('/my-following/' + VisitorRecordId);
    });
  }

  goToMyfollwer() {
    Promise.all([
      this.storage.get('VisitorRecordId'),
    ]).then(([VisitorRecordId]) => {
      this.router.navigateByUrl('/my-followers/' + VisitorRecordId);
    });
  }

  // my-walconst.page
  // 入驻成为商家
  goToBeSeller() {
    this.router.navigateByUrl('/businessman');
  }

  // 订单
  goToOrders() {
    this.router.navigateByUrl('/my-order');
  }

  async presentAlert1() {
    const alert = await this.alertController.create({
      header: '',
      subHeader: '',
      message: '确定要退出登录吗',
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
          this.storage.clear();
          // this.presentToast('缓存已全部清除')
          // 继续存缓存
          const exData = {
            params: {
              condition: {
                ExName: '美尚云讯'
              }
            }
          };
          this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Exhibition', exData)
            .subscribe(res => {
              if ((res as any).resCode === 0) {
                const resultInfo = (res as any).result;
                // this.presentToast('查询成功')
                this.storage.set('TenantId', resultInfo[0].TenantId);
                // ExhibitionId
                this.storage.set('ExhibitionId', resultInfo[0].RecordId);
                this.storage.set('UserIdOfEx', resultInfo[0].UserId);
                this.router.navigateByUrl('/login-by-phone');
              } else {
                this.presentToast('缓存失败');
              }
            });
        }
      }],
    });
    await alert.present();
  }

  // 退出登录
  goToLoginOut() {
    this.presentAlert1();
  }

  // 获取展会信息 存缓存
  getInofomation() {
    // 查询展会
    // 缓存如果有就不做操作，没有的话就查询存缓存
  }

  // 收货地址
  goToMyAddress() {
    this.router.navigateByUrl('/address');
  }

  // 互动足迹
  goToFootprint() {
    this.router.navigateByUrl('/active-foot');
  }

  // 我的钱包
  goToMyWallet() {
    this.router.navigateByUrl('/my-wallet');
  }

  // 帮助
  goToHelp() {
    this.router.navigateByUrl('/help-serve');
  }
  // 查看积分
  goToMyPoints() {
    this.router.navigateByUrl('/points-list');
  }

  // 账户与安全
  goToMyAccount() {
    this.router.navigateByUrl('/account-safe');
  }

  goToMyData() {
    this.router.navigateByUrl('/personal-data');
  }

  // 查看我发布的教程
  getMyTeaching() {
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
        tenantId,
        userId,
        params: {
          condition: {
            ExhibitionId,
            ProductVisitorId: VisitorRecordId,
            IsRelease: true,
            // IsShow: true
            SourceType: '商城',
            ProductType: '教程'
          },
          properties: ['ProductId.Product.___all', 'VisitorExhibitionInfoId.VisitorExhibitionInfo.___all'],
          // options: {
          //   pageIndex: 1,
          //   pageSize: 12
          // }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
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

  changeType(type) {
    this.centerType = type;
    if (type === '0') {
      this.isTeachingType = '0';
    } else if (type === '1') {
      this.isTeachingType = '';
      this.queryCourseList();
    } else if (type === '2') {
      this.isTeachingType = '';
      this.productType = '0';
      this.queryProductList();
    }
  }

  queryList(type) {
    this.productType = type;
    if (type === '0') {
      this.queryProductList();
    } else if (type === '1') {
      this.queryShopList();
    }
  }

  queryCourseList() {
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
            VisitorId: VisitorRecordId,
            CollectionByWhat: '收藏课程'
          },
          properties: ['ProductId.Product.___all', 'ProductVisitorExhibitionId.VisitorExhibitionInfo.___all',
            'CollectedExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'],
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/CollectionInfo', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            // this.courseList = (res as any).result;
            let arr = (res as any).result;
            let arr1 = [];
            arr.forEach(element => {
              if (element.ProductId) {
                arr1.push(element);
              }

            });
            this.courseList = arr1;
            this.IsFourthList = false;
          } else {
            this.courseList = [];
            this.IsFourthList = true;
          }
        });
    });
  }

  queryProductList() {
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
            VisitorId: VisitorRecordId,
            CollectionByWhat: '收藏商品'
          },
          properties: ['ProductId.Product.___all', 'ProductVisitorExhibitionId.VisitorExhibitionInfo.___all',
            'CollectedExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'],
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/CollectionInfo', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            // this.productList = (res as any).result;

            let arr = (res as any).result;
            let arr1 = [];
            arr.forEach(element => {
              if (element.ProductId) {
                arr1.push(element);
              }

            });
            this.productList = arr1;
            this.IsFifthList = false;
          } else {
            this.productList = [];
            this.IsFifthList = true;
          }
        });
    });
  }

  queryShopList() {
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
            VisitorId: VisitorRecordId,
            CollectionByWhat: '关注店铺'
          },
          properties: ['ProductId.Product.___all', 'ProductVisitorExhibitionId.VisitorExhibitionInfo.___all',
            'CollectedExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'],
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/CollectionInfo', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            // this.shopList = (res as any).result;
            let arr = (res as any).result;
            let arr1 = [];
            arr.forEach(element => {
              if (element.CollectedExhibitorExhibitionInfoId) {
                arr1.push(element);
              }

            });
            this.shopList = arr1;
            this.IsSixthList = false;
          } else {
            this.shopList = [];
            this.IsSixthList = true;
          }
        });
    });
  }


  // 查询用户是否是商家
  queryIsStore() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId'),

      this.storage.get('Phone'),
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
          // alert('========查询是否注册==========')
          //  alert(JSON.stringify(res))
          if ((res as any).resCode == 0) {
            // 已注册 弹出提示
            this.isStore = true;
          } else {
            this.isStore = false;
          }
        });
    });
  }

  // 店铺详情
  shopDetail(id) {
    this.router.navigateByUrl('/store-home/' + id);
  }

  // 课程详情
  courseDetail(id) {
    this.router.navigateByUrl('/course-details/' + id);
  }

  // 商品详情
  productDetail(id) {
    this.router.navigateByUrl('/goods-details/' + id);
  }

  // 帮助与客服
  goToHelpService() {
    this.router.navigateByUrl('/help-and-customer-service');
  }

  // 查看积分总数
  // 总积分
  accountMyPoints() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      // debugger
      let a = new Date();
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
          this.mypointnum = (res as any).result;
          this.mypointnum = this.mypointnum * 10;
        });
    });
  }

  // 编辑
  async goToEdit(id) {
    const modal = await this.modalController.create({
      component: EditMyTeachingPage,
      // cssClass: 'addMyCart',
      componentProps: {
        teachingId: id
      }
    });
    modal.onDidDismiss().then(() => {
      this.getMyTeaching();
      this.getFollowingTeaching();
    }, () => { });
    return await modal.present();
  }

  // 去签到
  goToSign() {
    this.router.navigateByUrl('/to-sign');
  }

  goToPress() {
  }

  // 清除缓存
  goToRemoveStorage() {
    this.presentLoading();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: '清理缓存中',
      duration: 1500
    });
    await loading.present();
    // const { role, data } = await loading.onDidDismiss();
    loading.onDidDismiss().then(() => {
      this.presentToast('清理成功');
    }, () => { });
    console.log('Loading dismissed!');
  }

  goToMyBlackList() {
    this.router.navigateByUrl('/my-black-list');
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
