import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AddTeachingNewPage } from '../add-teaching-new/add-teaching-new.page';
import { MyAddTeachingPage } from '../my-add-teaching/my-add-teaching.page';
import { Wechat } from '@ionic-native/wechat/ngx';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { QQSDK, QQShareOptions } from '@ionic-native/qqsdk/ngx';
import { AppComponent } from '../app.component';

import { MySharePage } from '../my-share/my-share.page';
import { Location } from '@angular/common';

@Component({
  selector: 'app-lessons-details',
  templateUrl: './lessons-details.page.html',
  styleUrls: ['./lessons-details.page.scss']
})
export class LessonsDetailsPage implements OnInit {
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
  public isCollectByOthers;
  public connCourseList;
  public isConnCourse;
  public connGoodsList;
  public isConnGoods;
  public isComm;
  public checkNum;
  public productVisitId;
  public isAllRemark;
  public visitorId;
  public isLike;
  public remark1;
  public remark2;
  public isIcon;
  public shareNum;
  public showMoreBtn;
  public userLogo;
  constructor(
    public loadingController: LoadingController,
    public modalController: ModalController,
    public nav: NavController,
    public toastController: ToastController,
    public router: Router,
    private qq: QQSDK,
    private wechat: Wechat,
    public alertController: AlertController,
    private http: HttpClient,
    public storage: Storage,
    private loc: Location
  ) {}

  ngOnInit() {
    this.shareNum = 0;
    if (undefined === this.PicList) {
      // this.presentLoading();
      // this.presentLoading1('图片加载中...');
      this.presentLoading();
      // this.PicList = []
    } else {
    }
    this.isConnCourse = true;
    this.isConnGoods = true;
    this.isLike = false;
    this.commentsInfo = '';
    this.isCollectByOthers = true;
    this.isOwn = false;
    this.commentNum = 0;
    const aa = this.router.url;
    const arr = aa.split('/');
    this.teachingId = arr[2];
    this.isAllRemark = false;
    this.arr1 = [
      '时尚焦点小眼影Carbon',
      '柔遮瑕膏/轻亮粉底液',
      'Ultrasun 优佳全效防晒乳',
      '妙巴黎柔护提亮隔离乳',
      'CUIR葵儿红石榴防护喷雾',
      'JMsolution韩国海洋珍珠防晒棒'
    ];
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: '图片加载中...',
      duration: 350
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
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

  ionViewWillEnter() {
    Promise.all([
      this.storage.get('Logo')
    ]).then(([logo]) => {
      this.userLogo = logo;
    });
    this.showMoreBtn = false;
    // if (undefined == this.PicList) {
    //   this.presentLoading()
    // }
    this.queryIsCollectByOthers();
    this.getTeachingDetail();
    this.getCommentList();
    this.getCommentNum();
    // this.isCollect=false
    this.queryIsCollect();
    this.queryIsFollow();
    this.queryProductVisit();
    // alert(this.isConnCourse)
    this.queryShareCount();
  }

  ionViewDidEnter() {
    this.StepsList.forEach((element, index) => {
      element.video.forEach((e, i) => {
        document.getElementById(index).addEventListener('play', (event) => {
          this.queryIsShow(document.getElementById(index));
        });
      });
    });
  }

  queryIsShow(video) {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId')
    ]).then(([tenantId, userId]) => {
      const courseData = {
        tenantId,
        userId,
        params: {
          condition: {
            // ExhibitionId: ExhibitionId,
            RecordId: this.teachingId
            // SourceType: '商城',
            // ProductType: '教程'
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            if ((res as any).result[0].IsShow === false) {
              video.currentTime = 0;
              video.pause();
              this.presentToast('该教程已被屏蔽');
              this.loc.back();
            }
          }
        });
      }
    );
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
            ProductId: this.teachingId
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
            ExhibitionId,
            VisitorId: VisitorRecordId,
            ProductId: this.teachingId,
            ProductVisitorId: this.productVisitId
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

  queryIsCollectByOthers() {
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
            ProductId: this.teachingId,
            CollectionByWhat: '收藏教程'
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
          if ((res as any).resCode === 0) {
            const resultInfo = (res as any).result;
            if (resultInfo.length > 0) {
              this.isCollectByOthers = true;
            } else {
              this.isCollectByOthers = false;
            }
          } else {
            this.isCollectByOthers = false;
          }
        });
    });
  }

  // 分享
  goToShare() {
    // 分享
    // 开始分享
    this.wechat
      .share({
        //     message: {
        //       title: '我是小花谁怕谁',
        //         description: '从前有座山我是卖报的小行家',
        //        mediaTagName: 'Media Tag Name(optional)',
        //   thumb: 'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/1559207275600-0.767-image.png',
        //         media: {
        //           type:this.wechat.Type.WEBPAGE,

        //             webpageUrl: 'https://www.baidu.com'    // webpage
        //        }
        //     },
        // scene: this.wechat.Scene.TIMELINE   // share to Timeline
        //  scene:type=='session'? Wechat.Scene.SESSION : Wechat.Scene.TIMELINE   // SESSION ：分享到微信，TIMELINE：分享到朋友圈
        text: 'This is just a plain string',
        scene: this.wechat.Scene.TIMELINE
      })
      .then(res => {
        alert('wechat share success!! ' + JSON.stringify(res));
      })
      .catch(e => {
        alert('wechat share failure; ' + e.message);
      });
  }

  async presentModal1() {
    const modal = await this.modalController.create({
      component: AddTeachingNewPage,
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

    modal.onDidDismiss().then(
      () => {
        // this.
      },
      () => {}
    );
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
        const teachingData = {
          userId,
          tenantId,
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
            const result_info = (res as any).result;
            if ((res as any).resCode === 0) {
              const info = {
                userId,
                tenantId,
                params: {
                  recordId: this.teachingId
                }
              };
              this.http
                .post(AppComponent.apiUrl + 'v2/data/delete/Product', info, {
                  headers: { Authorization: 'Bearer ' + token }
                })
                .subscribe(
                  res => {
                    const result_info = (res as any).result;
                    if ((res as any).resCode === 0) {
                      this.presentToast('删除成功');
                      this.loc.back();
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
        const token1 =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1Y2JkNmZkY2U4OTIzNTVjOTRkOTI3ZmMiLCJpYXQiOjE1NTgxNzI3NzQsImV4cCI6MTU1ODI1OTE3NH0.k-8pWdCruvUXn8nqDNv0G7SCxtv4Z6zADi0oXhFYJDY';
        const teachingData = {
          userId,
          tenantId,
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
          .post(AppComponent.apiUrl + 'v2/data/delete/Product', teachingData, {
            headers: { Authorization: 'Bearer ' + token }
          })
          .subscribe(
            res => {
              const result_info = (res as any).result;
              if ((res as any).resCode === 0) {
                // this.isCollect = false
                this.presentToast('删除成功');
                this.loc.back();
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
        // this.http
        //   .post(
        //     AppComponent.apiUrl + 'v2/data/delete/Product',
        //     teachingData
        //   )
        //   .subscribe(res => {
        //     const result_info = (res as any).result;
        //     if ((res as any).resCode == 0) {
        //       this.isCollect = false
        //       this.presentToast('已取消')
        //     }
        //   });
      });
    }
  }
  // 收藏教程
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
            userId,
            tenantId,
            params: {
              condition: {
                CollectionByWhat: '收藏教程',
                ExhibitionId: exhibitionId,
                ExhibitorId: '',
                ProductId: this.teachingId,
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
                this.presentToast('已取消收藏');
              }
            });
        } else {
          // 新增收藏
          const teachingData = {
            userId,
            tenantId,
            params: {
              record: {
                CollectionByWhat: '收藏教程',
                ExhibitionId: exhibitionId,
                ExhibitorId: '',
                ProductId: this.teachingId,
                VisitorId: VisitorRecordId,
                CollectedExhibitorExhibitionInfoId: '',
                ProductVisitorExhibitionId: this.teachingDetails
                  .VisitorExhibitionInfoId.RecordId
              }
            }
          };
          this.http
            .post(
              AppComponent.apiUrl + 'v2/data/insert/CollectionInfo',
              teachingData
            )
            .subscribe(res => {
              if ((res as any).resCode === 0) {
                const result_info = (res as any).result;
                this.isCollect = true;
                this.presentToast('收藏成功');
                this.insertMsgInfo('收藏');
              }
            });
        }
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

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  goToTest() {
    const mm = 'huhu';
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
      const courseData = {
        tenantId,
        userId,
        params: {
          condition: {
            ExhibitionId,
            ProductId: this.teachingId,
            VisitorId: VisitorRecordId,
            CollectionByWhat: '收藏教程'
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
          if ((res as any).resCode === 0) {
            const resultInfo = (res as any).result[0];
            this.isCollect = true;
            this.collectId = this.teachingId;
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
      const courseData = {
        tenantId,
        userId,
        params: {
          condition: {
            ExhibitionId,
            // ProductId: this.teachingId,
            VisitorId: VisitorRecordId,
            CollectionByWhat: '关注用户',
            CollectedVisitorId: this.visitorId
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
          if ((res as any).resCode === 0) {
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
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      // 判断用户是否登录
      if (VisitorRecordId && VisitorRecordId.length == 24) {
        if (this.isFollow === true) {
          // 取消收藏
          const teachingData = {
            userId,
            tenantId,
            params: {
              condition: {
                CollectionByWhat: '关注用户',
                ExhibitionId: exhibitionId,
                CollectedVisitorId: this.teachingDetails.ProductVisitorId,
                ProductId: '',
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
                this.isFollow = false;
                this.presentToast('已取消关注');
              }
            });
        } else {
          // 新增收藏
          const teachingData = {
            userId,
            tenantId,
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
              if ((res as any).resCode === 0) {
                const result_info = (res as any).result;
                this.isFollow = true;
                this.presentToast('已关注');
                this.insertMsgInfo('关注');
              }
            });
        }
      } else {
        this.presentToast('登录后才可以使用哦！');
      }
    });
  }

  // 查询教程详情
  getTeachingDetail() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorExhibitionInfoId'),
      this.storage.get('VisitorRecordId')
    ]).then(
      ([
        tenantId,
        userId,
        ExhibitionId,
        VisitorExhibitionInfoId,
        VisitorRecordId
      ]) => {
        // 赋值全局
        // this.UserId = userId;
        // this.TenantId = tenantId;
        // this.ExhibitionId = ExhibitionId;
        const courseData = {
          tenantId,
          userId,
          params: {
            condition: {
              // ExhibitionId: ExhibitionId,
              RecordId: this.teachingId
              // SourceType: '商城',
              // ProductType: '教程'
            },
            properties: [
              'ProductId.Product.___all',
              'VisitorExhibitionInfoId.VisitorExhibitionInfo.___all'
            ]
            // properties: ['ProductId.Product.___all'],
          }
        };
        this.http
          .post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
          .subscribe(res => {
            if ((res as any).resCode === 0) {
              this.teachingDetails = (res as any).result[0];
              this.visitorId = (res as any).result[0].ProductVisitorId;
              let visitorInfo = (res as any).result[0].VisitorExhibitionInfoId;
              this.StepsList = this.teachingDetails.CourseList;
              this.PicList = (res as any).result[0].PicList;
              // this.loadingController.dismiss({
              // })
              if (this.teachingDetails.ProductVisitorId === VisitorRecordId) {
                this.isOwn = true;
              } else {
                this.isOwn = false;
              }
              this.checkNum = (res as any).result[0].PVNumber;
              this.productVisitId = (res as any).result[0].ProductVisitorId;
              // remark分解
              if (visitorInfo.Remark) {
                let remark = visitorInfo.Remark;
                if (remark.length < 44) {
                  this.remark1 = remark;
                  this.remark2 = remark;
                  this.isIcon = false;
                } else {
                  this.isIcon = true;
                  this.remark1 = remark.substr(0, 44);
                  this.remark2 = remark;
                }
              }
              if (this.teachingDetails.connectCourses && this.teachingDetails.connectCourses.length > 0) {
                this.queryCourseList();
              }
              if (this.teachingDetails.connectProducts && this.teachingDetails.connectProducts.length > 0) {
                this.queryGoodsList();
              }
            }
          });
      }
    );
  }
  // 点赞
  goToAddLike() {
    this.isLike = true;
  }

  // 去商品详情页
  goToGoodsDetail(id) {
    this.router.navigateByUrl('/goods-details/' + id);
  }

  // 去课程详情页
  goToCourseDetail(id) {
    Promise.all([
      this.storage.get('VisitorRecordId')
    ]).then(([VisitorRecordId]) => {
      if (VisitorRecordId && VisitorRecordId.length == 24) {
        this.router.navigateByUrl('/course-details/' + id);
      } else {
        this.presentToast('登录后才可以使用哦！');
      }
    });
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
            userId,
            tenantId,
            params: {
              record: {
                ProductVisitInfoId: '',
                ExhibitorId: '',
                Logo,
                Name: NickName,
                NickName,
                UserId: userId,
                TenantId: tenantId,
                Content: this.commentsInfo,
                ProductId: this.teachingId,
                VisitorId: VisitorRecordId,
                ExhibitionId: exhibitionId,
                IsEvaluate: true,
                ProductType: '教程',
                SourceType: '商城'
              }
            }
          };
          if (undefined === this.commentsInfo || '' === this.commentsInfo) {
            this.presentToast('请填写评论内容');
          } else {
            this.http
              .post(
                AppComponent.apiUrl + 'v2/data/insert/ProductVisitInfoMessage',
                teachingData
              )
              .subscribe(res => {
                if ((res as any).resCode === 0) {
                  const result_info = (res as any).result;
                  this.getCommentList();
                  this.commentsInfo = '';
                  this.getCommentNum();
                  this.presentToast('评论成功');
                  this.insertMsgInfo('评论');
                }
              });
          }
        } else {
          this.presentToast('登录后才可以使用哦！');
        }
      }
    );
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
        tenantId,
        userId,
        params: {
          condition: {
            ExhibitionId,
            ProductId: this.teachingId,
            IsEvaluate: true,
            ProductType: '教程',
            SourceType: '商城'
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
                const element = (res as any).result[index];
                a.push(element);
              }
              this.commentList = a;
              this.showMoreBtn = true;
            } else {
              this.commentList = (res as any).result;
              this.showMoreBtn = false;
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
        tenantId,
        userId,
        params: {
          condition: {
            ExhibitionId,
            ProductId: this.teachingId,
            IsEvaluate: true,
            ProductType: '教程',
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
    this.router.navigateByUrl(
      '/comments-of-teaching/' + this.teachingId + '&' + this.productVisitId
    );
  }

  // 查询关联商品，关联课程
  queryGoodsList() {
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
        ExhibitionId,
        VisitorRecordId,
        VisitorExhibitionInfoId
      ]) => {
        const courseData = {
          tenantId,
          userId,
          params: {
            condition: {
              ExhibitionId,
              CourseId: '',
              LessonId: this.teachingId,
              // VisitorId: VisitorRecordId,
            },
            properties: ['ProductId.Product.___all']
          }
        };

        this.http
          .post(
            AppComponent.apiUrl + 'v2/data/queryList/LessonCourseProduct',
            courseData
          )
          .subscribe(res => {
            if ((res as any).resCode === 0) {
              // this.connGoodsList = (res as any).result;
              let arr = (res as any).result;
              let arr1 = [];
              arr.forEach(element => {
                if (element.ProductId) {
                  arr1.push(element);
                }
              });
              this.connGoodsList = arr1;
              this.isConnGoods = false;
            } else {
              this.connGoodsList = [];
              this.isConnGoods = true;
            }
          });
      }
    );
  }

  // 查询关联课程
  queryCourseList() {
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
        ExhibitionId,
        VisitorRecordId,
        VisitorExhibitionInfoId
      ]) => {
        const courseData = {
          tenantId,
          userId,
          params: {
            condition: {
              ExhibitionId: ExhibitionId,
              LessonId: this.teachingId,
              ProductId: ''
            },
            properties: ['CourseId.Product.___all']
          }
        };
        this.http
          .post(
            AppComponent.apiUrl + 'v2/data/queryList/LessonCourseProduct',
            courseData
          )
          .subscribe(res => {
            if ((res as any).resCode === 0) {
              this.connCourseList = (res as any).result;
              let arr = (res as any).result;
              let arr1 = [];
              arr.forEach(element => {
                if (element.CourseId) {
                  arr1.push(element);
                }
              });
              this.connCourseList = arr1;
              this.isConnCourse = false;
            } else {
              this.connCourseList = [];
              this.isConnCourse = true;
            }
          });
      }
    );
  }

  insertMsgInfo(type) {
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
            ExhibitionId,
            VisitorSender: VisitorRecordId,
            VisitorReceiver: this.productVisitId,
            Type: type,
            ProductId: this.teachingId
          }
        }
      };
      this.http
        .post(AppComponent.apiUrl + 'v2/data/insert/MsgInfo', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
          }
        });
    });
  }

  // 展开全部简介
  goToAllRemark() {
    this.isAllRemark = !this.isAllRemark;
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
      if (this.commentList[index].VisitorId === VisitorRecordId) {
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
              this.commentList.splice(index, 1);
              this.presentToast('删除成功');
              this.getCommentList();
              this.getCommentNum();
            } else {
              this.presentToast('删除失败');
            }
          },
          err => {
            console.log('==========hahha======');
            console.log(err);
            console.log(err.status);
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
            ProductId: this.teachingId
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
  // 举报
  goToReport() {
    this.presentAlert1();
  }
  async presentAlert1() {
    const alert = await this.alertController.create({
      header: '',
      subHeader: '',
      message: '确定要举报该教程么',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            console.log('=====');
          }
        },
        {
          text: '确定',
          role: 'Ok',
          cssClass: 'secondary',
          handler: blah => {
            this.presentToast('系统已收到您的举报，稍后为您核实处理');
          }
        }
      ]
    });
    await alert.present();
  }

  test() {
    alert('============fdfsfs==');
  }

  async presentModalShare() {
    Promise.all([this.storage.get('VisitorRecordId')]).then(
      async ([VisitorRecordId]) => {
        if (VisitorRecordId && VisitorRecordId.length == 24) {
          const modal = await this.modalController.create({
            component: MySharePage,
            cssClass: 'myShare',
            componentProps: {
              type: '教程',
              ProductId: this.teachingId
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
          this.presentToast('登录后才可以使用哦！');
        }
      }
    );
  }
}
