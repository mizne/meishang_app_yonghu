import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NavController, ToastController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-comments-of-teaching',
  templateUrl: './comments-of-teaching.page.html',
  styleUrls: ['./comments-of-teaching.page.scss'],
})
export class CommentsOfTeachingPage implements OnInit {
  dis: boolean;
  TenantId: string;
  UserId: string;
  ExhibitorId: string;
  RecordId: string;
  public params;
  public params1;
  public data;
  public params2;
  public chatArr;
  public isComment;
  goodsID: string;
  // goodsList: [] = [];
  public messageGoods;
  replyMsg: string;
  isreply: boolean;
  isShow: boolean;
  msgId: string;

  public teachingId;
  public commentList;
  public ProductType;
  public commentNum;
  public commentsInfo;
  public productVisitId;
  constructor(
    public http: HttpClient,
    public router: Router,
    public storage: Storage,
    public nav: NavController,
    public alertController: AlertController,
    public toastController: ToastController,
    private loc: Location
  ) {
    this.replyMsg = '';
  }

  ngOnInit() {
    const aa = this.router.url;
    const arr = aa.split('/');
    const str = arr[2];
    if (str.includes('&')) {
      this.ProductType = '教程';
      const arr1 = str.split('&');
      this.teachingId = arr1[0];
      this.productVisitId = arr1[1];
    } else {
      this.ProductType = '课程';
      this.teachingId = str;
    }
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
            ProductType: this.ProductType,
            SourceType: '商城'
          }
        }
      };
      if (undefined === this.commentsInfo || '' === this.commentsInfo) {
        this.presentToast('请填写评论内容');
      } else {
        this.http.post(AppComponent.apiUrl + 'v2/data/insert/ProductVisitInfoMessage', teachingData)
          .subscribe(res => {
            if ((res as any).resCode === 0) {
              let result_info = (res as any).result;
              this.getCommentList();
              this.commentsInfo = '';
              this.getCommentNum();
              this.presentToast('评论成功');
              this.insertMsgInfo('评论');
            }
          });
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
            ProductType: this.ProductType,
            SourceType: '商城'
            // VisitorId: VisitorRecordId,
          },
          properties: ['ProductId.Product.___all', 'ProductVisitInfoId.VisitorExhibitionInfo.___all'],
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/ProductVisitInfoMessage', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            this.commentList = (res as any).result;
            this.isComment = true;
          } else {
            this.commentList = [];
            this.isComment = false;
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
      let courseData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            ExhibitionId: ExhibitionId,
            ProductId: this.teachingId,
            IsEvaluate: true,
            ProductType: this.ProductType,
            SourceType: '商城'
            // VisitorId: VisitorRecordId,
          },
          properties: ['ProductId.Product.___all'],
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryCount/ProductVisitInfoMessage', courseData)
        .subscribe(res => {
          this.commentNum = (res as any).result;
        });
    });
  }

  canGoBack() {
    this.loc.back();
  }

  ionViewWillEnter() {
    // this.detail()
    this.getCommentList();
    this.getCommentNum();
  }

  blurInput() {
    // this.isreply=!this.isreply
  }

  op() {
    this.dis = !this.dis;
  }

  // 显示留言输入框兵获取留言Id
  editMsg(i) {
    this.isreply = !this.isreply;
    this.msgId = i;
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
          this.deleteComments(index, id);
        }
      }],
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
      this.http.post(AppComponent.apiUrl + 'v2/data/delete/ProductVisitInfoMessage',
        info, { headers: { Authorization: 'Bearer ' + token } }
      )
        .subscribe(res => {
          let result_info = (res as any).result;
          if ((res as any).resCode === 0) {
            this.commentList.splice(index, 1);
            this.presentToast('删除成功');
            this.getCommentList();
            this.getCommentNum();
          } else {
            this.presentToast('删除失败');
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
      this.http.post(AppComponent.apiUrl + 'v2/data/insert/MsgInfo', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
          }
        });
    });
  }

  // // 删除评论
  // goTodelete1(index, id) {
  //   console.log('=====id====' + id)
  //   // console.log(JSON.stringify(this.commentList))
  //   // console.log(JSON.stringify(this.commentList[index]))
  //   console.log('===========删除评论========')
  //   // 查询是不是自己的评论 是自己的可以删除 不是的不做任何操作
  //   Promise.all([
  //     this.storage.get('TenantId'),
  //     this.storage.get('UserId'),
  //     this.storage.get('ExhibitionId'),
  //     this.storage.get('VisitorRecordId')
  //   ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
  //     if (this.commentList[index].VisitorId == VisitorRecordId) {
  //       // 是自己的
  //       this.presentAlert(index, id)
  //     } else {
  //       // 不是自己的
  //     }
  //   })
  // }

  // async presentAlert(index, id) {
  //   const alert = await this.alertController.create({
  //     header: '',
  //     subHeader: '',
  //     message: '确定要删除这条评论吗?',
  //     buttons: [{
  //       text: '取消',
  //       role: 'cancel',
  //       cssClass: 'secondary',
  //       handler: (blah) => {
  //       }
  //     }, {
  //       text: '确定',
  //       role: 'Ok',
  //       cssClass: 'secondary',
  //       handler: (blah) => {
  //         this.deleteComments(index, id)
  //       }
  //     }],
  //   });
  //   await alert.present();
  // }

  // // 删除
  // deleteComments(index, id) {
  //   Promise.all([
  //     this.storage.get('TenantId'),
  //     this.storage.get('UserId'),
  //     this.storage.get('ExhibitionId'),
  //     this.storage.get('VisitorRecordId'),
  //     this.storage.get('token')
  //   ]).then(([tenantId, userId, exhibitionId, VisitorRecordId, token]) => {
  //     // debugger
  //     let info = {
  //       userId: userId,
  //       tenantId: tenantId,
  //       params: {
  //         recordId: id
  //       }
  //     }
  //     this.http
  //       .post(
  //         AppComponent.apiUrl + 'v2/data/delete/ProductVisitInfoMessage',
  //         info, { headers: { Authorization: 'Bearer ' + token } }
  //       )
  //       .subscribe(res => {
  //         let result_info = (res as any).result;
  //         if ((res as any).resCode == 0) {
  //           this.commentList.splice(index, 1);
  //           this.presentToast('删除成功')
  //           this.getCommentList()
  //           this.getCommentNum()
  //         } else {
  //           this.presentToast('删除失败')
  //         }
  //       });
  //   }
  //   )
  // }

  goToVisitorHome(id) {
    Promise.all([
      this.storage.get('VisitorRecordId'),
    ]).then(([VisitorRecordId]) => {
      if (id == VisitorRecordId) {
        this.router.navigateByUrl('/tabs/tabs/my-collection');
      } else {
        this.router.navigateByUrl('/others-page/' + id);
      }
    });
  }
}
