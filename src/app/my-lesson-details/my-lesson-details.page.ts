import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { AddTeachingNewPage } from '../add-teaching-new/add-teaching-new.page';
import { MyAddTeachingPage } from '../my-add-teaching/my-add-teaching.page';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-my-lesson-details',
  templateUrl: './my-lesson-details.page.html',
  styleUrls: ['./my-lesson-details.page.scss'],
})
export class MyLessonDetailsPage implements OnInit {
  public StepsAlbum;
  public UserId;
  public TenantId;
  public ExhibitionId;
  public StepsList;
  public VisitorRecordId;
  public arr1 = [];
  public teachingDetails;
  public teachingId;
  public commentsInfo;
  public commentList;
  public commentNum;
  public isCollect;
  public collectId;
  public isFollow;
  public isOwn;
  public PicList;
  public details;
  banner
  isComm
  public isCollectByOthers;
  public connCourseList;
  public isConnCourse;
  public connGoodsList;
  public isConnGoods;
  public checkNum;
  public productVisitId;

  constructor(
    public navParams: NavParams,
    public modalController: ModalController,
    public nav: NavController,
    public toastController: ToastController,
    public router: Router,
    private http: HttpClient,
    public storage: Storage) {
    this.teachingId = this.navParams.data.teachingId;
  }

  ionViewWillEnter() {
    this.getTeachingDetail();
    this.queryIsCollectByOthers();
    this.getCommentList();
    this.getCommentNum();
    // this.isCollect=false
    this.queryIsCollect();
    this.queryIsFollow();
    this.queryCourseList();
    this.queryGoodsList();
  }

  ngOnInit() {
    // this.isConnGoods=false
    // this.isConnCourse=false
    this.details = {};
    this.commentsInfo = '';
    this.isCollectByOthers = true;
    this.isOwn = false;
    this.commentNum = 0;
    // let aa = this.router.url
    // let arr = aa.split('/')
    // this.teachingId = arr[2]

    this.arr1 = [
      '时尚焦点小眼影Carbon',
      '柔遮瑕膏/轻亮粉底液',
      'Ultrasun 优佳全效防晒乳',
      '妙巴黎柔护提亮隔离乳',
      'CUIR葵儿红石榴防护喷雾',
      'JMsolution韩国海洋珍珠防晒棒'
    ];
    // this.getTeachingDetail()
    // this.getCommentList()
    // this.getCommentNum()
    // this.isCollect=false
    // this.queryIsCollect()
    // console.log('========this.queryIsCollect()==========' + this.queryIsCollect)
    // this.queryIsFollow()
  }

  queryIsCollectByOthers() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      // 赋值全局
      let courseData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            ExhibitionId: ExhibitionId,
            ProductId: this.teachingId,
            CollectionByWhat: '收藏教程',
            // SourceType: '商城',
            // ProductType: '教程'
          }
          // properties: ['ProductId.Product.___all'],
        }
      };

      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/CollectionInfo', courseData)
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            let resultInfo = (res as any).result;
            this.isCollectByOthers = true;
          } else {
            this.isCollectByOthers = false;
          }
        });
    });
  }

  // 分享
  goToShare() {
  }

  async presentModal1() {
    const modal = await this.modalController.create({
      component: MyAddTeachingPage,
      // cssClass: 'addMyCart',
      componentProps: {
        source: '1',
        teachingId: this.teachingId
        // goodsDetaiInfo: this.goodsDetaiInfo,
        // goodsPrice: this.goodsPrice,
        // goodsVolum: this.goodsVolum,
        // sizeId: this.sizeId,
        // isSpec: this.isSpec,
        // goodsId: this.goodsId
      }
    });

    modal.onDidDismiss().then(() => {
    }, () => { });
    return await modal.present();
  }

  // 删除教程
  goToDelete() {
    // 删除记录
    // 删除教程
    if (this.isCollectByOthers) {
      // 查询再删除
      Promise.all([
        this.storage.get('TenantId'),
        this.storage.get('UserId'),
        this.storage.get('ExhibitionId'),
        this.storage.get('VisitorRecordId'),
        this.storage.get('token')
      ]).then(([tenantId, userId, exhibitionId, VisitorRecordId, token]) => {
        let teachingData = {
          userId: userId,
          tenantId: tenantId,
          params: {
            condition: {
              ProductId: this.teachingId
            }
          }
        };
        this.http
          .post(
            AppComponent.apiUrl + 'v2/data/deleteByCondition/CollectionInfo',
            teachingData
          )
          .subscribe(res => {
            let result_info = (res as any).result;
            if ((res as any).resCode == 0) {
              let info = {
                userId: userId,
                tenantId: tenantId,
                params: {
                  recordId: this.teachingId
                }
              };
              this.http
                .post(
                  AppComponent.apiUrl + 'v2/data/delete/Product',
                  info, { headers: { Authorization: 'Bearer ' + token } }
                )
                .subscribe(res => {
                  let result_info = (res as any).result;
                  if ((res as any).resCode == 0) {
                    this.presentToast('删除成功');
                    this.modalController.dismiss({
                    });
                  }
                }, (err) => {
                  if (err.status == 403) {
                    this.presentToast('登录已过期，请重新登录');
                    this.storage.set(
                      'VisitorExhibitionInfoId',
                      ''
                    );
                    this.storage.set('VisitorRecordId', '');
                    this.router.navigateByUrl('/login-by-password');
                  }
                });
            }
          });
      });
    } else {
      // 直接删 别犹豫
      Promise.all([
        this.storage.get('TenantId'),
        this.storage.get('UserId'),
        this.storage.get('ExhibitionId'),
        this.storage.get('VisitorRecordId'),
        this.storage.get('token')
      ]).then(([tenantId, userId, exhibitionId, VisitorRecordId, token]) => {
        // debugger
        let token1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1Y2JkNmZkY2U4OTIzNTVjOTRkOTI3ZmMiLCJpYXQiOjE1NTgxNzI3NzQsImV4cCI6MTU1ODI1OTE3NH0.k-8pWdCruvUXn8nqDNv0G7SCxtv4Z6zADi0oXhFYJDY'
        let teachingData = {
          userId: userId,
          tenantId: tenantId,
          params: {
            recordId: this.teachingId
            // condition: {
            //   CollectionByWhat: '收藏教程',
            //   ExhibitionId: exhibitionId,
            //   ProductId: this.teachingId,
            // }
          }
        };
        this.http
          .post(
            AppComponent.apiUrl + 'v2/data/delete/Product',
            teachingData, { headers: { Authorization: 'Bearer ' + token } }
          )
          .subscribe(res => {
            let result_info = (res as any).result;
            if ((res as any).resCode == 0) {
              // this.isCollect = false
              this.presentToast('删除成功');
              this.modalController.dismiss({
              });
            }
          }, (err) => {
            if (err.status == 403) {
              this.presentToast('登录已过期，请重新登录');
              this.storage.set(
                'VisitorExhibitionInfoId',
                ''
              );
              this.storage.set('VisitorRecordId', '');
              this.router.navigateByUrl('/login-by-password');
            }
          }
          );
      });
    }
  }

  // 收藏教程
  goToCollect() {
    // 判断时候收藏 已收藏 修改状态  未收藏 新增一个
    if (this.isCollect == true) {
      // 取消收藏
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
            condition: {
              CollectionByWhat: '收藏教程',
              ExhibitionId: exhibitionId,
              ExhibitorId: '',
              ProductId: this.teachingId,
              VisitorId: VisitorRecordId,
            }
          }
        };
        this.http
          .post(
            AppComponent.apiUrl + 'v2/data/deleteByCondition/CollectionInfo',
            teachingData
          )
          .subscribe(res => {
            let result_info = (res as any).result;
            if ((res as any).resCode == 0) {
              this.isCollect = false
              this.presentToast('已取消收藏')
              this.modalController.dismiss({
              });
            }
          });
      });
    } else {
      // 新增收藏
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
              CollectionByWhat: '收藏教程',
              ExhibitionId: exhibitionId,
              ExhibitorId: '',
              ProductId: this.teachingId,
              VisitorId: VisitorRecordId,
              CollectedExhibitorExhibitionInfoId: '',
              ProductVisitorExhibitionId: this.teachingDetails.VisitorExhibitionInfoId.RecordId
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
            this.isCollect = true
            this.presentToast('收藏成功');
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

  // 返回上一页
  canGoBack() {
    // this.router.navigateByUrl('')
    this.modalController.dismiss({
    });
  }

  goToTest() {
    var mm = 'huhu';
    this.arr1.push(mm);
  }

  // 查询是否收藏
  queryIsCollect() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      // 赋值全局
      let courseData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            ExhibitionId: ExhibitionId,
            ProductId: this.teachingId,
            VisitorId: VisitorRecordId,
            CollectionByWhat: '收藏教程',
            // SourceType: '商城',
            // ProductType: '教程'
          }
          // properties: ['ProductId.Product.___all'],
        }
      };

      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/CollectionInfo', courseData)
        .subscribe(res => {
          let resultInfo = (res as any).result[0];
          if ((res as any).resCode == 0) {
            this.isCollect = true;
            this.collectId = this.teachingDetails.RecordId;
          } else {
            this.isCollect = false;
          }
        });
    });
  }

  // 查询是否关注这个作者
  queryIsFollow() {
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
      let courseData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            ExhibitionId: ExhibitionId,
            // ProductId: this.teachingId,
            VisitorId: VisitorRecordId,
            CollectionByWhat: '关注用户',
            CollectedVisitorId: this.teachingDetails.ProductVisitorId
            // SourceType: '商城',
            // ProductType: '教程'
          }
          // properties: ['ProductId.Product.___all'],
        }
      };

      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/CollectionInfo', courseData)
        .subscribe(res => {
          let resultInfo = (res as any).result[0];
          if ((res as any).resCode == 0) {
            this.isFollow = true;
          } else {
            this.isFollow = false;
          }
        });
    });
  }

  // 关注教程作者
  goToFollow() {
    // 判断是否关注 已关注 修改状态  未关注 新增一个
    if (this.isFollow == true) {
      // 取消收藏
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
            condition: {
              CollectionByWhat: '关注用户',
              ExhibitionId: exhibitionId,
              CollectedVisitorId: this.teachingDetails.ProductVisitorId,
              ProductId: '',
              VisitorId: VisitorRecordId,
            }
          }
        };
        this.http
          .post(
            AppComponent.apiUrl + 'v2/data/deleteByCondition/CollectionInfo',
            teachingData
          )
          .subscribe(res => {
            let result_info = (res as any).result;
            if ((res as any).resCode == 0) {
              this.isFollow = false;
              this.presentToast('已取消关注');
            }
          });
      });
    } else {
      // 新增收藏
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
              CollectionByWhat: '关注用户',
              CollectedVisitorId: this.teachingDetails.ProductVisitorId,
              ProductId: '',
              VisitorId: VisitorRecordId,
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
            let result_info = (res as any).result;
            this.isFollow = true;
            this.presentToast('已关注');
          });
      });
    }
  }

  // 查询教程详情
  getTeachingDetail() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorExhibitionInfoId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorExhibitionInfoId, VisitorRecordId]) => {
      let courseData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            // ExhibitionId: ExhibitionId,
            RecordId: this.teachingId,
            // SourceType: '商城',
            // ProductType: '教程'
          },
          properties: ['ProductId.Product.___all', 'VisitorExhibitionInfoId.VisitorExhibitionInfo.___all'],
          // properties: ['ProductId.Product.___all'],
        }
      };

      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
        .subscribe(res => {
          this.teachingDetails = (res as any).result[0];
          this.StepsList = this.teachingDetails.CourseList;
          this.details = (res as any).result[0].VisitorExhibitionInfoId;
          this.PicList = (res as any).result[0].PicList;
          this.banner = (res as any).result[0].PicList[0].PicPath;
          // 查看相册集
          if (this.teachingDetails.ProductVisitorId == VisitorRecordId) {
            this.isOwn = true;
          } else {
            this.isOwn = false;
          }
          this.checkNum = (res as any).result[0].PVNumber;
          this.productVisitId = (res as any).result[0].ProductVisitorId;
        });
    });
  }

  goToGoodsDetail() {
    this.router.navigateByUrl('/goods-details/123');
  }

  goToAddNew() {
    this.router.navigateByUrl('/goods-details/123');
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
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId, VisitorExhibitionInfoId, Logo, NickName]) => {
      let teachingData = {
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
            ProductId: this.teachingId,
            VisitorId: VisitorRecordId,
            ExhibitionId: exhibitionId,
            IsEvaluate: true,
            ProductType: "教程",
            SourceType: "商城"
          }
        }
      };
      if (undefined == this.commentsInfo || '' == this.commentsInfo) {
        this.presentToast('请填写评论内容');
      } else {
        this.http
          .post(
            AppComponent.apiUrl + 'v2/data/insert/ProductVisitInfoMessage',
            teachingData
          )
          .subscribe(res => {
            let result_info = (res as any).result;
            this.getCommentList();
            this.commentsInfo = '';
            this.getCommentNum();
            this.presentToast('评论成功');
          });
      }
    });
  }

  // 查看评论
  getCommentList() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      let courseData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            ExhibitionId: ExhibitionId,
            ProductId: this.teachingId,
            IsEvaluate: true,
            ProductType: "教程",
            SourceType: "商城"
            // VisitorId: VisitorRecordId,
          },
          properties: ['ProductId.Product.___all', 'ProductVisitInfoId.VisitorExhibitionInfo.___all'],
        }
      };

      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/ProductVisitInfoMessage', courseData)
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            // this.commentList = (res as any).result;
            let a = [];
            if ((res as any).result.length > 3) {
              for (let index = 0; index < 3; index++) {
                const element = (res as any).result[index];
                a.push(element);
              }
              this.commentList = a;
            } else {
              this.commentList = (res as any).result;
            }
            this.isComm = true;
          } else {
            this.isComm = false;
            this.commentList = [];
          }
        });
    });
  }

  // 查看全部评论
  goToAllComments() {
    this.modalController.dismiss({
    });
    this.router.navigateByUrl('/comments-of-teaching/' + this.teachingId);
  }

  // 获取评论数
  getCommentNum() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      let courseData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            ExhibitionId: ExhibitionId,
            ProductId: this.teachingId,
            IsEvaluate: true,
            ProductType: "教程",
            SourceType: "商城"
            // VisitorId: VisitorRecordId,
          },
          properties: ['ProductId.Product.___all'],
        }
      };

      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryCount/ProductVisitInfoMessage', courseData)
        .subscribe(res => {
          this.commentNum = (res as any).result;
        });
    });
  }

  // 查询关联商品，关联课程
  queryGoodsList() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      let courseData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            ExhibitionId: ExhibitionId,
            ProductId: this.teachingId,
            VisitorId: VisitorRecordId,
            CourseId: ''
          },
          properties: ['LessonId.Product.___all', 'ProductId.Product.___all']
        }
      };

      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/LessonCourseProduct', courseData)
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            this.connGoodsList = (res as any).result;
            this.isConnGoods = false;
          } else {
            this.connGoodsList = [];
            this.isConnGoods = true;
          }
        });
    });
  }

  goToCourseDetail(id) {
    this.router.navigateByUrl('/course-details/' + id);
  }

  // 查询关联课程
  queryCourseList() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('VisitorExhibitionInfoId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId, VisitorExhibitionInfoId]) => {
      // 赋值全局
      let courseData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            ExhibitionId: ExhibitionId,
            LessonId: this.teachingId,
            VisitorExhibitionInfoId: VisitorExhibitionInfoId,
            ProductId: ''
          },
          properties: ['LessonId.Product.___all', 'CourseId.Product.___all']
        }
      };

      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/LessonCourseProduct', courseData)
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            this.connCourseList = (res as any).result;
            this.isConnCourse = false;
          } else {
            this.connCourseList = [];
            this.isConnCourse = true;
          }
        });
    });
  }
}
