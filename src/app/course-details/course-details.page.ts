import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { ToastController, ModalController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Wechat } from '@ionic-native/wechat/ngx';
import { QQSDK, QQShareOptions } from '@ionic-native/qqsdk/ngx';
import { ConfirmOrderForCoursePage } from '../confirm-order-for-course/confirm-order-for-course.page';
import { AppComponent } from '../app.component';
import { MySharePage } from '../my-share/my-share.page';
import { Location } from '@angular/common';
@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.page.html',
  styleUrls: ['./course-details.page.scss']
})
export class CourseDetailsPage implements OnInit {
  public arr1 = [];

  constructor(
    public loadingController: LoadingController,
    public toastController: ToastController,
    private wechat: Wechat,
    private qq: QQSDK,
    public nav: NavController,
    public router: Router,
    public modalController: ModalController,
    public alertController: AlertController,
    private http: HttpClient,
    public storage: Storage,
    private loc: Location
  ) {}
  public UserId;
  public TenantId;
  public ExhibitionId;
  public StepsList;
  public VisitorRecordId;
  public courseId;
  public courseDetailsInfo;
  public goodsList;
  public courseDetails;
  public routesInfo;
  public isCollectCourse;
  public isCollectStore;
  public banner;
  public isOwn;
  public isComm;
  public commentNum;
  public commentList;
  public commentsInfo;
  public checkNum;
  public exhibitorId;
  public EEInfoId;
  public isBuy;
  public shareNum;
  public isTest;
  public showMoreBtn;
  public userLogo;
  ngOnInit() {
    this.isBuy = true;
    this.shareNum = 0;
    const aa = this.router.url;
    const arr = aa.split('/');
    this.courseId = arr[2];
    this.courseDetailsInfo = {};

    this.isTest = false;
    // this.getCourseDetails()
    if (undefined == this.banner) {
      this.presentLoading();
      // this.presentLoading1('图片加载中...');
    }
    this.arr1 = [
      '时尚焦点小眼影Carbon',
      '柔遮瑕膏/轻亮粉底液',
      'Ultrasun 优佳全效防晒乳',
      '妙巴黎柔护提亮隔离乳',
      'CUIR葵儿红石榴防护喷雾',
      'JMsolution韩国海洋珍珠防晒棒'
    ];
  }
  async presentLoading1(msg) {
    const loading = await this.loadingController.create({
      message: msg
      // duration: 1500
    });
    await loading.present();

    // const { role, data } = await loading.onDidDismiss();
    loading.onDidDismiss().then(() => {}, () => {});
    console.log('Loading dismissed!');
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: '加载中...',
      duration: 350
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

  ionViewWillEnter() {
    Promise.all([
      this.storage.get('Logo')
    ]).then(([logo]) => {
      this.userLogo = logo;
    });
    this.showMoreBtn = false;
    // if (undefined == this.banner) {
    //   this.presentLoading()
    // }
    this.getCommentNum();
    this.getCommentList();
    this.getCourseDetails();
    this.queryCollectCourse();
    // this.queryCollectCourse();
    this.queryProductVisit();
    this.queryIsBuy();
    this.queryShareCount();
    // 查看是否是测试账号
    // this.queryIsTestAccount();
    this.getInofomation();
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
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
            ProductId: this.courseId
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
            ProductId: this.courseId
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

  goToTest() {
    const mm = 'huhu';
    this.arr1.push(mm);
  }
  // 查询详情
  getCourseDetails() {
    // this.courseId
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
            ExhibitionId: exhibitionId,
            RecordId: this.courseId
          },
          properties: [
            'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'
          ],
          options: { pageIndex: 1, pageSize: 10 },
          childObjects: [
            {
              fieldName: 'Product',
              reference: {
                object: 'Product',
                field: 'ProductId'
              }
            }
          ]
        }
      };
      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            this.courseDetailsInfo = (res as any).result[0];
            this.goodsList = (res as any).result[0];
            this.banner = this.goodsList.CourseFirstImage;
            // this.loadingController.dismiss({
            // })

            this.courseDetails = (this.goodsList as any).CourseList;
            this.routesInfo = (this.goodsList as any).Product;
            this.checkNum = (res as any).result[0].PVNumber;
            this.exhibitorId = (res as any).result[0].ExhibitorId;
            if ((res as any).result[0].ExhibitorExhibitionInfoId) {
              this.EEInfoId = (res as any).result[0].ExhibitorExhibitionInfoId.RecordId;
            }
            this.queryCollectStore();
          }
        });
    });
  }

  // 查询是否关注店铺
  queryCollectStore() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      let CollectedExhibitorExhibitionInfoId;
      // console.log(JSON.stringify(this.courseDetailsInfo))
      if (this.courseDetailsInfo.ExhibitorExhibitionInfoId) {
        CollectedExhibitorExhibitionInfoId = this.courseDetailsInfo
          .ExhibitorExhibitionInfoId.RecordId;
      } else {
        CollectedExhibitorExhibitionInfoId = '';
      }
      const courseData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            ExhibitionId: ExhibitionId,
            ExhibitorId: this.courseDetailsInfo.ExhibitorId,
            CollectedVisitorId: this.courseDetailsInfo.ProductVisitorId,
            CollectedExhibitorExhibitionInfoId: CollectedExhibitorExhibitionInfoId,
            VisitorId: VisitorRecordId,
            CollectionByWhat: '关注店铺'
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
          if ((res as any).resCode == 0) {
            this.isCollectStore = true;
          } else {
            this.isCollectStore = false;
          }
        });
    });
  }
  // 查询是否收藏本课程
  queryCollectCourse() {
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
            ProductId: this.courseId,
            VisitorId: VisitorRecordId,
            CollectionByWhat: '收藏课程'
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
          if ((res as any).resCode == 0) {
            this.isCollectCourse = true;
            // this.collectId = this.teachingDetails.RecordId
          } else {
            this.isCollectCourse = false;
          }
        });
    });
  }
  // 点击收藏课程
  goToCollectCourse() {
    // 判断时候收藏 已收藏 修改状态  未收藏 新增一个
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('VisitorExhibitionInfoId')
    ]).then(
      ([
        tenantId,
        userId,
        exhibitionId,
        VisitorRecordId,
        VisitorExhibitionInfoId
      ]) => {
        if (VisitorRecordId && VisitorRecordId.length == 24) {
          if (this.isCollectCourse == true) {
            // 取消收藏
            const teachingData = {
              userId: userId,
              tenantId: tenantId,
              params: {
                condition: {
                  CollectionByWhat: '收藏课程',
                  ExhibitionId: exhibitionId,
                  ProductId: this.courseId,
                  VisitorId: VisitorRecordId
                }
              }
            };
            this.http
              .post(
                AppComponent.apiUrl +
                  'v2/data/deleteByCondition/CollectionInfo',
                teachingData
              )
              .subscribe(res => {
                const result_info = (res as any).result;
                if ((res as any).resCode == 0) {
                  this.isCollectCourse = false;
                }
              });
          } else {
            // 新增收藏
            const teachingData = {
              userId: userId,
              tenantId: tenantId,
              params: {
                record: {
                  CollectionByWhat: '收藏课程',
                  ExhibitionId: exhibitionId,
                  ProductId: this.courseId,
                  VisitorId: VisitorRecordId,
                  ExhibitorId: this.courseDetailsInfo.ExhibitorId,
                  CollectedExhibitorExhibitionInfoId: this.courseDetailsInfo
                    .ExhibitorExhibitionInfoId.RecordId
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
                this.isCollectCourse = true;
                this.presentToast('收藏成功');
              });
          }
        } else {
          this.presentToast('登录后才可以使用哦！');
        }
      }
    );
  }

  // 点击收藏店铺
  goToCollectStore() {
    // this.isCollectStore = !this.isCollectStore
    // 判断是否关注 已关注 修改状态  未关注 新增一个
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      if (VisitorRecordId && VisitorRecordId.length == 24) {
        if (this.isCollectStore == true) {
          // 取消收藏

          const teachingData = {
            userId: userId,
            tenantId: tenantId,
            params: {
              condition: {
                ExhibitorId: this.courseDetailsInfo.ExhibitorId,
                CollectedVisitorId: this.courseDetailsInfo.ProductVisitorId,
                CollectedExhibitorExhibitionInfoId: this.courseDetailsInfo
                  .ExhibitorExhibitionInfoId.RecordId,
                VisitorId: VisitorRecordId,
                CollectionByWhat: '关注店铺',
                ExhibitionId: exhibitionId
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
              if ((res as any).resCode == 0) {
                this.isCollectStore = false;
                this.presentToast('已取消关注');
              } else {
                this.presentToast('取消关注失败');
              }
            });
        } else {
          // 新增收藏

          const teachingData = {
            userId: userId,
            tenantId: tenantId,
            params: {
              record: {
                ExhibitorId: this.courseDetailsInfo.ExhibitorId,
                CollectedVisitorId: this.courseDetailsInfo.ProductVisitorId,
                CollectedExhibitorExhibitionInfoId: this.courseDetailsInfo
                  .ExhibitorExhibitionInfoId.RecordId,
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
                const result_info = (res as any).result;
                this.isCollectStore = true;
                this.presentToast('已关注');
              } else {
                this.isCollectStore = false;
                this.presentToast('关注失败');
              }
            });
        }
      } else {
        this.presentToast('登录后才可以使用哦！');
      }
    });
  }

  // 发送评论
  toSendComments() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('VisitorExhibitionInfoId'),
      this.storage.get('Logo'),
      this.storage.get('NickName')
    ]).then(
      ([
        tenantId,
        userId,
        exhibitionId,
        VisitorRecordId,
        VisitorExhibitionInfoId,
        Logo,
        NickName
      ]) => {
        if (VisitorRecordId && VisitorRecordId.length == 24) {
          const teachingData = {
            userId: userId,
            tenantId: tenantId,
            params: {
              record: {
                ProductVisitInfoId: '',
                ExhibitorId: '',
                Logo: Logo,
                Name: NickName,
                UserId: userId,
                TenantId: tenantId,
                Content: this.commentsInfo,
                ProductId: this.courseId,
                VisitorId: VisitorRecordId,
                ExhibitionId: exhibitionId,
                IsEvaluate: true,
                ProductType: '课程',
                SourceType: '商城'
              }
            }
          };
          if (undefined == this.commentsInfo || '' === this.commentsInfo) {
            // alert('请填写评论内容');
            this.presentToast('请填写评论内容');
          } else {
            this.http
              .post(
                AppComponent.apiUrl + 'v2/data/insert/ProductVisitInfoMessage',
                teachingData
              )
              .subscribe(res => {
                const result_info = (res as any).result;
                this.getCommentList();
                this.commentsInfo = '';
                this.getCommentNum();
                this.presentToast('评论成功');
              });
          }
        } else {
          this.presentToast('登录后才可以使用哦！');
        }
      }
    );
  }

  // 查看每个章节视频
  goToVideo(index) {
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
            RecordId: this.courseId
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            if ((res as any).result[0].IsShow === true) {
              this.router.navigateByUrl('/course-details-for-video/' + this.courseId + '&' + index);
            } else {
              this.presentToast('该课程已被屏蔽');
            }
          }
        });
    });
  }

  // 查看每个章节视频
  goToVideo1() {
    this.router.navigateByUrl(
      '/course-details-for-video/' + this.courseId + '&' + 0
    );
  }

  // 查看每个章节视频
  goToVideo2() {
    // my-course-list
    this.router.navigateByUrl('/my-course-list/' + this.courseId);
  }

  // 查看评论
  getCommentList() {
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
            ProductId: this.courseId,
            IsEvaluate: true,
            ProductType: '课程',
            SourceType: '商城'
            // VisitorId: VisitorRecordId
          },
          properties: [
            'ProductId.Product.___all',
            'ProductVisitInfoId.VisitorExhibitionInfo.___all'
          ]
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/queryList/ProductVisitInfoMessage',
          courseData
        )
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            // this.commentList = (res as any).result;
            const a = [];
            if ((res as any).result.length > 3) {
              for (let index = 0; index < 3; index++) {
                let element = (res as any).result[index];
                a.push(element);
              }
              this.commentList = a;
              this.showMoreBtn = true;
            } else {
              this.showMoreBtn = false;
              this.commentList = (res as any).result;
            }
            this.isComm = true;
          } else {
            this.isComm = false;
            this.showMoreBtn = false;
            this.commentList = [];
          }
        });
    });
  }

  // 获取评论数
  getCommentNum() {
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
            ProductId: this.courseId,
            IsEvaluate: true,
            ProductType: '课程',
            SourceType: '商城'
            // VisitorId: VisitorRecordId
          },
          properties: ['ProductId.Product.___all']
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/queryCount/ProductVisitInfoMessage',
          courseData
        )
        .subscribe(res => {
          this.commentNum = (res as any).result;
        });
    });
  }

  // 查看全部评论
  goToAllComments() {
    this.router.navigateByUrl('/comments-of-teaching/' + this.courseId);
  }

  // 店铺详情
  shopDetail(id) {
    this.router.navigateByUrl('/store-home/' + id);
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
      if (this.commentList[index].VisitorId == VisitorRecordId) {
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
            if ((res as any).resCode == 0) {
              this.commentList.splice(index, 1);
              this.presentToast('删除成功');
              this.getCommentList();
              this.getCommentNum();
            } else {
              this.presentToast('删除失败');
            }
          },
          err => {
            if (err.status == 403) {
              this.presentToast('登录已过期，请重新登录');
              this.storage.set('VisitorExhibitionInfoId', '');
              this.storage.set('VisitorRecordId', '');
              this.router.navigateByUrl('/login-by-password');
            }
          }
        );
    });
  }

  async goToBuy() {
    const modal = await this.modalController.create({
      component: ConfirmOrderForCoursePage,
      // cssClass: 'addMyCart',
      componentProps: {}
    });

    modal.onDidDismiss().then(
      () => {
        // this.getProductList();
      },
      () => {}
    );

    return await modal.present();
  }

  // 购买课程
  toBuyCourse() {
    // 判断是否登录 没登录的话跳登录
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('token'),
      this.storage.get('VisitorExhibitionInfoId')
    ]).then(
      ([
        tenantId,
        exhibitionId,
        userId,
        VisitorId,
        token,
        VisitorExhibitionInfoId
      ]) => {
        if (VisitorId && VisitorId.length == 24) {
          if (this.isBuy == true) {
            this.presentToast('您已购买过该课程，请勿重复购买');
          } else if (this.goodsList.ProductPrice == 0) {
            // 新增一条购买记录
            // this.courseDetailsInfo
            // 生成订单 再添加记录
            let orderInfo = {
              Receiver: '',
              ReceiverPhone: '',
              ReceiverAddress: '',
              myAddress: '',
              ExhibitorExhibitionInfoId: this.courseDetailsInfo
                .ExhibitorExhibitionInfoId.RecordId,
              ExhibitorId: this.courseDetailsInfo.ExhibitorId,
              VisitorId: VisitorId,
              ProductId: this.courseId,
              OrderType: '课程',
              ExhibitionId: exhibitionId,
              OrderLineNumber: '1',
              OrderName: this.courseDetailsInfo.ExhibitorExhibitionInfoId
                .StockName,
              Sum: 0,
              state: '401',
              BallanceAccountState: false,
              Logistics: '1',
              PayWay: '微信支付',
              OrderSource: '订单来源',
              Remark: '留言备注'
            };

            let ProductInfo = [
              {
                ProductId: this.courseId,
                ProductNum: '1',
                ProductName: this.courseDetailsInfo.CourseTitle,
                Price: '0',
                UnitPrice:"0",
              }
            ];

            let orderParams = {
              userId: userId,
              tenantId: tenantId,
              params: {
                record: {
                  AppType: '商城',
                  Orderinfo: orderInfo,
                  Productinfo: ProductInfo
                }
              }
            };

            this.http
              .post(AppComponent.apiUrl + 'v2/data/insert/Order', orderParams)
              .subscribe(res => {
                if ((res as any).resCode == 0) {
                  let teachingData = {
                    userId: userId,
                    tenantId: tenantId,
                    params: {
                      record: {
                        ExhibitionId: exhibitionId,
                        ProductId: this.courseId,
                        VisitorExhibitionInfoId: VisitorExhibitionInfoId,
                        VisitorId: VisitorId
                      }
                    }
                  };
                  this.http
                    .post(
                      AppComponent.apiUrl + 'v2/data/insert/CourseByRecords',
                      teachingData
                    )
                    .subscribe(res => {
                      if ((res as any).resCode == 0) {
                        this.presentToast('购买成功');
                        this.queryIsBuy();
                      } else {
                        this.presentToast('购买失败');
                      }
                    });
                } else {
                  this.presentToast('购买失败');
                }
              });
          } else {
            if (null == VisitorId) {
              this.modalController.dismiss({
                // 'result': value
              });
              this.presentAlertTips();
              // this.presentToast('请先登录');
              // this.router.navigateByUrl('/login-by-phone');
            } else {
              this.presentModal1();
            }
          }
        } else {
          this.modalController.dismiss({
            // 'result': value
          });
          this.presentAlertTips();
          // this.presentToast('请先登录');
          // this.router.navigateByUrl('/login-by-phone');
        }
      }
    );
  }

  async presentModal1() {
    const modal = await this.modalController.create({
      component: ConfirmOrderForCoursePage,
      componentProps: {
        courseDetailsInfo: this.courseDetailsInfo,
        banner: this.banner,
        courseId: this.courseId
      }
    });
    modal.onDidDismiss().then(
      () => {
        // this.getProductList();
      },
      () => {}
    );
    return await modal.present();
  }

  async presentAlertTips() {
    const alert = await this.alertController.create({
      header: '',
      subHeader: '',
      message: '请先注册登录',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {}
        },
        {
          text: '去登录',
          role: 'Ok',
          cssClass: 'secondary',
          handler: blah => {
            this.router.navigateByUrl('/login-by-phone');
          }
        }
      ]
    });
    await alert.present();
  }

  // 查询是否购买过
  queryIsBuy() {
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
            ProductId: this.courseId,
            OrderType: '课程',
            state: '401',
            VisitorId: VisitorRecordId
          }
          // properties: ['ProductId.Product.___all', 'ProductVisitInfoId.VisitorExhibitionInfo.___all'],
        }
      };
      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/Order', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            // this.commentList = (res as any).result;
            this.isBuy = true;
          } else {
            this.isBuy = false;
          }
        });
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
            ProductId: this.courseId
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

  // 查询是否是测试账号
  queryIsTestAccount() {
    Promise.all([
      this.storage.get('Phone'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('VisitorExhibitionInfoId')
    ]).then(([phone, VisitorRecordId, VisitorExhibitionInfoId]) => {
      if (
        phone == '13776410320' ||
        phone == '15651020766' ||
        VisitorRecordId == '5d160c9b8dfa20c84a24fe23' ||
        VisitorExhibitionInfoId == '5d160c9b8dfa20c84a24fe24'
      ) {
        this.isTest = true;
      } else {
        this.isTest = false;
      }
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

  async presentModalShare() {
    Promise.all([this.storage.get('VisitorRecordId')]).then(
      async ([VisitorRecordId]) => {
        if (VisitorRecordId && VisitorRecordId.length == 24) {
          const modal = await this.modalController.create({
            component: MySharePage,
            cssClass: 'myShare',
            componentProps: {
              type: '课程',
              ProductId: this.courseId
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
          this.presentToast('登录后才可以使用该功能哦！');
        }
      }
    );
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
}
