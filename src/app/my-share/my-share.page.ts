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
import { NavParams } from '@ionic/angular';
@Component({
  selector: 'app-my-share',
  templateUrl: './my-share.page.html',
  styleUrls: ['./my-share.page.scss']
})
export class MySharePage implements OnInit {
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
  public type;
  public ProductId;
  public isReport;
  public wechatSharePersonalURL;
  constructor(
    public loadingController: LoadingController,
    public modalController: ModalController,
    public nav: NavController,
    public toastController: ToastController,
    public router: Router,
    private qq: QQSDK,
    public navParams: NavParams,
    private wechat: Wechat,
    public alertController: AlertController,
    private http: HttpClient,
    public storage: Storage
  ) {
    this.type = this.navParams.data.type;
    this.ProductId = this.navParams.data.ProductId;
  }

  ngOnInit() {
    this.isReport = false;
  }
  ionViewWillEnter() {
    this.queryIsReport();
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

  // 转发朋友圈
  toShareForMoments() {
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
            ShareType: '分享到朋友圈',
            Source: '美尚荟App' + this.type,
            ProductId: this.ProductId
          }
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/insert/ShareHistory',
          courseData
        )
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            // this.queryShareCount()
            // this.presentToast('分享成功');
            // this.queryShareCount();
            this.modalController.dismiss({});
          } else {
            this.modalController.dismiss({});
          }
        });
    });
    this.wechat
      .share({
        message: {
          title:
            '推荐一个' +
            this.type +
            '教程给你们，点开链接下载美尚荟App查看' +
            this.type +
            '教程详情',
          description: '',
          mediaTagName: '',
          thumb:
            'http://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/f8fb78e1-ffd9-4106-b4f5-465488395ffd.png',
          media: {
            type: 7,
            webpageUrl: 'http://reg.xiaovbao.cn/appdownload' // webpage
          }
        },
        // scene: this.wechat.Scene.SESSION  , // share to Timeline
        scene: 1 // share to Timeline
        // SESSION ：分享到微信，TIMELINE：分享到朋友圈
        // text: 'This is just a plain string',
        // scene: this.wechat.Scene.TIMELINE
      })
      .then(res => {
        // 新增一个记录
        this.presentToast('分享成功');
      })
      .catch(e => {
        // this.presentToast(e)
        if (e.includes('cancelled')) {
          this.presentToast('您已取消分享');
        } else {
          this.presentToast(e);
        }
      });
  }

  // 转发给朋友
  toShareForFriends() {
    // 新增一个记录
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
            ShareType: '推荐给朋友',
            Source: '美尚荟App' + this.type,
            ProductId: this.ProductId
          }
        }
      };
      this.http
        .post(AppComponent.apiUrl + 'v2/data/insert/ShareHistory', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            // this.presentToast('分享成功');
            // this.queryShareCount();
            this.modalController.dismiss({});
          }
        });
    });
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
            VisitorSharingId: VisitorRecordId,
            SharedCourseId: this.ProductId
          }
        }
      };
      this.http
        .post(AppComponent.apiUrl + 'v2/data/insert/SharedCourseRecords', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            if (this.type === '课程') {
              this.wechatSharePersonalURL = 'http://www.meishangyunxun.com/app/share.html?RecordId=' + (res as any).result.RecordId;
            } else {
              this.wechatSharePersonalURL = 'http://reg.xiaovbao.cn/appdownload';
            }
            this.wechat
              .share({
                message: {
                  title:
                    '推荐一个' +
                    this.type +
                    '给你，点开链接下载美尚荟App查看' +
                    this.type +
                    '详情',
                  description: '',
                  mediaTagName: '',
                  thumb:
                    'http://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/f8fb78e1-ffd9-4106-b4f5-465488395ffd.png',
                  media: {
                    type: 7,
                    webpageUrl: this.wechatSharePersonalURL // webpage
                  }
                },
                // scene: this.wechat.Scene.SESSION  , // share to Timeline
                scene: 0 // share to Timeline
                // SESSION ：分享到微信，TIMELINE：分享到朋友圈
                // text: 'This is just a plain string',
                // scene: this.wechat.Scene.TIMELINE
              })
              .then(res => {
                this.presentToast('分享成功');
              })
              .catch(e => {
                if (e.includes('cancelled')) {
                  this.presentToast('您已取消分享');
                } else {
                  this.presentToast(e);
                }
                this.modalController.dismiss({});
              });
          }
        });
    });
  }

  // 分享QQ
  goToShareForQQ() {
    // 分享QQ
    // 新增一个记录
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
            ShareType: '分享QQ好友',
            Source: '美尚荟App' + this.type,

            ProductId: this.ProductId
          }
        }
      };
      this.http
        .post(AppComponent.apiUrl + 'v2/data/insert/ShareHistory', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            // this.queryShareCount()
            // this.presentToast('分享成功');
            // this.queryShareCount();
            this.modalController.dismiss({});
          }
        });
    });
    const options: QQShareOptions = {
      client: this.qq.ClientType.QQ,
      scene: this.qq.Scene.QQ,
      title:
        '推荐一个' +
        this.type +
        '给你，点开链接下载美尚荟App查看' +
        this.type +
        '详情',
      url: 'http://reg.xiaovbao.cn/appdownload',
      image:
        'http://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/f8fb78e1-ffd9-4106-b4f5-465488395ffd.png',
      description: '来自美尚荟APP的分享',
      flashUrl: 'http://stream20.qqmusic.qq.com/30577158.mp3'
    };
    this.qq
      .shareNews(options)
      .then(() => {
        console.log('shareNews success');
        this.presentToast('分享成功');
      })
      .catch(error => {
        console.log(error);
        if (error.includes('cancelled')) {
          this.presentToast('您已取消分享');
        } else {
          this.presentToast(error);
        }
        this.modalController.dismiss({});
      });
  }

  // 分享QQ空间
  goToShareForZone() {
    // 分享QQ空间
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
            ShareType: '分享QQ空间',
            Source: '美尚荟App' + this.type,
            ProductId: this.ProductId
          }
        }
      };
      this.http
        .post(AppComponent.apiUrl + 'v2/data/insert/ShareHistory', courseData)
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            // this.queryShareCount()
            // this.queryShareCount();
            const options: QQShareOptions = {
              client: this.qq.ClientType.QQ,
              scene: this.qq.Scene.QQZone,
              title:
                '推荐一个' +
                this.type +
                '给你，点开链接下载美尚荟App查看' +
                this.type +
                '详情',
              url: 'http://reg.xiaovbao.cn/appdownload',
              image:
                'http://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/f8fb78e1-ffd9-4106-b4f5-465488395ffd.png',
              description: '来自美尚荟APP的分享',
              flashUrl: 'http://stream20.qqmusic.qq.com/30577158.mp3'
            };
            this.qq
              .shareNews(options)
              .then(() => {
                console.log('shareNews success');
                // this.presentToast('分享成功!');
              })
              .catch(error => {
                console.log(error);
              });
            this.modalController.dismiss({});
            this.presentToast('分享成功');
          }
        });
    });
  }

  goToCancel() {
    this.modalController.dismiss({});
  }

  // 举报
  goToReport() {
    if (this.isReport) {
      this.presentToast('您已举报过，请勿重复举报');
    } else {
      this.presentAlert1();
    }
  }

  async presentAlert1() {
    const alert = await this.alertController.create({
      header: '',
      subHeader: '确定要举报该' + this.type + '么',
      message: '举报成功后系统会在1-2个工作日核实举报情况进行处理',
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
            this.goToSendMsgInfo();
          }
        }
      ]
    });
    await alert.present();
  }

  // 发送系统消息
  goToSendMsgInfo() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('Logo'),
      this.storage.get('NickName')
    ]).then(
      ([tenantId, userId, ExhibitionId, VisitorRecordId, Logo, NickName]) => {
        const courseData = {
          tenantId,
          userId,
          params: {
            record: {
              ExhibitionId,
              VisitorSender: VisitorRecordId,
              Content: '举报' + this.type,
              Logo: Logo,
              NickName: NickName,
              ProductId: this.ProductId,
              Type: 110
            }
          }
        };
        this.http
          .post(AppComponent.apiUrl + 'v2/data/insert/MsgInfo', courseData)
          .subscribe(res => {
            if ((res as any).resCode == 0) {
              this.presentToast('系统已收到您的举报，稍后为您核实处理');
            } else {
              this.presentToast('您的举报信息提交有误。请重新尝试');
            }
          });
      }
    );
  }

  // 查询是否举报过该产品
  queryIsReport() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('Logo'),
      this.storage.get('NickName')
    ]).then(
      ([tenantId, userId, ExhibitionId, VisitorRecordId, Logo, NickName]) => {
        const courseData = {
          tenantId,
          userId,
          params: {
            condition: {
              ExhibitionId,
              VisitorSender: VisitorRecordId,
              ProductId: this.ProductId,
              Type: 110
            }
          }
        };
        this.http
          .post(AppComponent.apiUrl + 'v2/data/queryList/MsgInfo', courseData)
          .subscribe(res => {
            if ((res as any).resCode == 0) {
              this.isReport = true;
            } else {
              this.isReport = false;
            }
          });
      }
    );
  }
}
