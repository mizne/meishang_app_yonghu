import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { NavController, ToastController, IonSlides } from '@ionic/angular';
import { TabService } from '../tab.service';
import { AppComponent } from '../app.component';
import { IonInfiniteScroll, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
declare var Act1Plugin: any;
@Component({
  selector: 'app-course-home',
  templateUrl: './course-home.page.html',
  styleUrls: ['./course-home.page.scss']
})
export class CourseHomePage implements OnInit {
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonSlides, { static: false }) ionSlides: IonSlides;
  public UserId;
  public TenantId;
  public ExhibitionId;
  public CourseList;
  public VisitorRecordId;
  public isCourseNull;
  public isCourseAlive;
  public isLiveNull;
  public LiveList;
  public resultData;
  public isTest;
  public bannerList;
  public isBanner;
  private pageIndex; // 分页查询课程
  public isMoreCourse; // 是否 有更多课程
  private devWidth; // 设备宽度
  private HeightDiff; // 瀑布流高度差

  public slidesOptions = {
    autoplay: {
      disableOnInteraction: false
    },
    autoHeight: true
  };
  constructor(
    private tabService: TabService,
    public nav: NavController,
    public router: Router,
    private http: HttpClient,
    public storage: Storage,
    public alertController: AlertController,
    public toastController: ToastController,
    private loc: Location
  ) { }

  ngOnInit() {
    this.isBanner = true;
    this.isTest = false;
    this.CourseList = [];
    this.isCourseNull = true;
    this.isCourseAlive = false;
    this.isLiveNull = false;
    this.LiveList = [];
    this.resultData = {
      id: '',
      userSig: '',
      token: '',
      title: 'test直播间',
      cover: 'https://main.qcloudimg.com/raw/18c5ada2476fc2ac7d344350e2ad298e.png',
      uid: '', // HostID HostName
      roomnum: 10127, // RoomNum
      thumbup: 0, // Admires
      memsize: 1, // Members
      tenantId: '',
      UserId: '',
      recordId: '',
      AliveState: '2'
    };
    this.pageIndex = 1;
    this.isMoreCourse = true;
    // 获取设备宽度
    this.devWidth = document.body.clientWidth;
    this.HeightDiff = 0;
  }

  ionViewWillEnter() {
    this.tabService.emitTabEnter(2);
    this.getCoursPages(this.pageIndex);
    this.getLiveList();
    // this.queryIsTestAccount();
    this.getExhibitionBanner();
    // this.queryIsLogin();
    this.getInofomation();
    this.ionSlides.startAutoplay();
  }
  ionViewWillLeave() {
    this.isBanner = true;
    this.isTest = false;
    this.CourseList = [];
    this.isCourseNull = true;
    this.isCourseAlive = false;
    this.isLiveNull = false;
    this.LiveList = [];
    this.pageIndex = 1;
    this.isMoreCourse = true;
    // 获取设备宽度
    this.devWidth = document.body.clientWidth;
    this.HeightDiff = 0;
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

  private ensureTabWillEnter() {
    this.tabService.tab2EnterEvent.subscribe(() => {
      this.getCoursPages(this.pageIndex);
      this.getLiveList();
      this.getExhibitionBanner();
    });
  }

  // 切换tab
  goToChange() {
    this.isCourseAlive = !this.isCourseAlive;
  }

  // 去搜索
  goToSearch() {
    this.router.navigateByUrl('/search/2');
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  // 查询课程
  //    IsCourseApprove: 1 审核通过 0 审核中 2审核未通过
  // 分页获取教程列表
  getCoursPages(pageIndex) {
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
            ExhibitionId: exhibitionId,
            SourceType: '商城',
            ProductType: '课程',
            IsShow: true,
            IsCourseApprove: '1'
          },
          properties: ['ProductId.Product.___all', 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'],
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
                  AppComponent.imgReady(element.CourseFirstImage, function() {
                    const imgHeight = this.height / (this.width / _this.devWidth) * 0.47;
                    const DivHeight = parseFloat(imgHeight.toFixed(2)) + 86;
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
            this.CourseList = this.CourseList.concat(ArrResult);
            this.isCourseNull = false;
          } else {
            if (this.pageIndex === 1) {
              // 无课程
              this.isCourseNull = true;
            } else {
              this.isMoreCourse = false;
              // 无更多课程 加载到底
            }
          }
        });
    });
  }
  // 分页获取教程列表 课程滚动加载
  loadData1(event) {
    this.pageIndex = this.pageIndex + 1;
    setTimeout(() => {
      event.target.complete();
      this.getCoursPages(this.pageIndex);
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
    }, 800);
  }

  // 去课程详情页
  goToCourseDetail(id) {
    if (id) {
      Promise.all([
        this.storage.get('TenantId'),
        this.storage.get('UserId'),
        this.storage.get('ExhibitionId')
      ]).then(([tenantId, userId, exhibitionId]) => {
        const courseData = {
          UserId: userId,
          TenantId: tenantId,
          params: {
            condition: {
              ExhibitionId: exhibitionId,
              SourceType: '商城',
              ProductType: '课程',
              IsCourseApprove: '1',
              RecordId: id
            }
          }
        };
        this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
          .subscribe(res => {
            if ((res as any).resCode === 0) {
              if ((res as any).result[0].IsShow === true) {
                this.router.navigateByUrl('/course-details/' + id);
              } else {
                this.presentToast('该课程已被屏蔽');
              }
            }
          });
      });
    }
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

  // 查询直播
  getLiveList() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      let LiveData = {
        tenantId: tenantId,
        UserId: userId,
        params: {
          condition: {
            ExhibitionId: exhibitionId,
            AliveState: '1'
          },
          properties: [
            'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'
          ]
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/BroadcastAppointment', LiveData)
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            this.LiveList = (res as any).result;
            this.isLiveNull = false;
            this.resultData.uid = 'StockName';
          } else {
            this.isLiveNull = true;
            this.LiveList = [];
          }
        });
    });
  }

  // 获取php直播房间列表
  getRoomList(i) {
    const roomlistData = {
      'token': this.resultData.token,
      'type': 'live',
      'index': 0,
      'size': 10
    };
    this.http.post('http://119.28.133.54/index.php?svc=live&cmd=roomlist', roomlistData)
      .subscribe(res => {
        if ((res as any).errorCode == 0) {
          this.resultData.roomnum = (res as any).data.rooms[i].info.roomnum;
          this.resultData.memsize = (res as any).data.rooms[i].info.memsize;
          Act1Plugin.Login(this.resultData);
        } else {
          alert(JSON.stringify((res as any)));
        }
      }, () => {
        alert('roomlist failed');
      });
  }

  // 直播
  goToLive(i) {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId')
    ]).then(([tenantId, userId]) => {
      const requestData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            recordId: userId
          }
        }
      };
      // 账号1
      // const requestData = {
      //   'tenantId':'532ad4c34138982cbb4e9397d26d107f',
      //   'userId':'5c1b0f1d3b428de40c40eecd',
      //   'params': {
      //     'condition': {
      //       'RecordId': '5c1b0f1d3b428de40c40eecd'
      //     }
      //   }
      // };
      // 账号2
      // const requestData = {
      //   'tenantId':'532ad4c34138982cbb4e9397d26d107f',
      //   'userId':'5c20919d18f692289df0fd51',
      //   'params': {
      //     'condition': {
      //       'RecordId':'5c20919d18f692289df0fd51'
      //     }
      //   }
      // }
      this.http.post('http://47.96.113.171:8100/portal-web/sxb/getUserInfo', requestData)
        .subscribe(res => {
          if ((res as any).code === 'true') {
            this.resultData.id = (res as any).userName;
            this.resultData.userSig = (res as any).userSig;
            this.resultData.token = (res as any).token;
            this.getRoomList(i);
          } else {
            console.log((res as any));
          }
        }, () => {
          alert('getUserInfo failed');
        });
    });
  }
  // 查询是否是测试账号
  queryIsTestAccount() {
    Promise.all([
      this.storage.get('Phone'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('VisitorExhibitionInfoId')
    ]).then(([phone, VisitorRecordId, VisitorExhibitionInfoId]) => {
      if (phone == '13776410320' || phone == '15651020766' || phone == '15151805908' ||
      VisitorRecordId == '5d160c9b8dfa20c84a24fe23' || VisitorExhibitionInfoId == '5d160c9b8dfa20c84a24fe24') {
        this.isTest = true;
      } else {
        this.isTest = false;
      }
    });
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
            Type: '2'
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

  // 判断用户是否登录
  queryIsLogin() {
    Promise.all([
      this.storage.get('VisitorRecordId')
    ]).then(([VisitorRecordId]) => {
      if (null == VisitorRecordId) {
        this.isTest = true;
        this.presentAlertTips();
      }
    }, function(error) {
      // do something when failure
    });
  }

  async presentAlertTips() {
    const alert = await this.alertController.create({
      header: '',
      subHeader: '',
      message: '请先注册登录',
      buttons: [{
        text: '取消',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
        }
      }, {
        text: '去登录',
        role: 'Ok',
        cssClass: 'secondary',
        handler: (blah) => {
          this.router.navigateByUrl('/login-by-phone');
        }
      }],
    });
    await alert.present();
  }

  getInofomation() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, exhibitionId]) => {
      const exData = {
        params: {
          condition: {
            ExName: '美尚云讯'
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Exhibition', exData)
        .subscribe(res => {
          if ((res as any).resMsg === 'success') {
            this.isTest = (res as any).result[0].ShowCoursePrice;
          }
        });
    });
  }

  shopDetail(id) {
    this.router.navigateByUrl('/store-home/' + id);
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
