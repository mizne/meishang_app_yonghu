import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-comments-of-shop',
  templateUrl: './comments-of-shop.page.html',
  styleUrls: ['./comments-of-shop.page.scss'],
})
export class CommentsOfShopPage implements OnInit {
  public commentList;
  public isComment;
  public commentNum;
  public productId;
  constructor(public http: HttpClient,
              public router: Router,
              public storage: Storage,
              public nav: NavController,
              public alertController: AlertController,
              public toastController: ToastController, private loc: Location) { }

  ngOnInit() {
    const aa = this.router.url;
    const arr = aa.split('/');
    this.productId = arr[2];
  }

  ionViewWillEnter() {
    this.getCommentList();
    this.getCommentNum();
  }

  canGoBack() {
    this.loc.back();
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
            ProductId: this.productId,
            IsEvaluate: true,
            ProductType: '商品',
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
      const courseData = {
        tenantId,
        userId,
        params: {
          condition: {
            ExhibitionId,
            ProductId: this.productId,
            IsEvaluate: true,
            ProductType: '商品',
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
      const info = {
        userId,
        tenantId,
        params: {
          recordId: id
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/delete/ProductVisitInfoMessage',
        info, { headers: { Authorization: 'Bearer ' + token } }
      )
        .subscribe(res => {
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
            this.storage.set('VisitorExhibitionInfoId', '');
            this.storage.set('VisitorRecordId', '');
            this.router.navigateByUrl('/login-by-password');
          }
        }
        );
    });
  }

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
}
