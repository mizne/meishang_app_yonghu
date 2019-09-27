import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-my-comments',
  templateUrl: './my-comments.page.html',
  styleUrls: ['./my-comments.page.scss'],
})
export class MyCommentsPage implements OnInit {

  public evaluateId;
  public commentsInfo;
  public commentList;
  public isComment;
  public commentNum;
  public checkExhibitorId;
  constructor(public router: Router, private loc: Location,
              public http: HttpClient,
              public storage: Storage,
              public nav: NavController,
              public toast: ToastController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    const aa = this.router.url;
    const arr = aa.split('/');
    this.evaluateId = arr[2];
    this.commentList = [];
    Promise.all([
      this.storage.get('ExhibitorId')
    ]).then(([exhibitorId]) => {
      this.checkExhibitorId = exhibitorId;
    });
    this.queryCommentsList();
    this.queryCommentsNum();
    this.queryPvNumber();
  }

  canGoBack() {
    this.loc.back();
  }

  queryCommentsList() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, recordId, visitorId]) => {
      const requestData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            ExhibitionId: recordId,
            ProductVisitInfoMessageId: this.evaluateId
          }
        }
      };
      this.http.post(AppComponent.apiUrl + '/v2/data/queryList/VisitInfoMessageComment', requestData)
        .subscribe(res => {
          if ((res as any).resMsg === 'success') {
            this.commentList = (res as any).result;
            this.isComment = true;
          } else {
            this.commentList = [];
            this.isComment = false;
          }
        }, error => {
        });
    });
  }

  sendComments() {
    if (this.commentsInfo === '' || this.commentsInfo === null || this.commentsInfo === undefined) {
      this.successToast('请填写评论');
      return;
    }
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('Logo'),
      this.storage.get('NickName')
    ]).then(([tenantId, userId, recordId, VisitorId, logo, name]) => {
      const requestData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          record: {
            VisitorId: VisitorId,
            ExhibitionId: recordId,
            ProductVisitInfoMessageId: this.evaluateId,
            Content: this.commentsInfo,
            Logo: logo,
            Name: name
          }
        }
      };
      this.http.post(AppComponent.apiUrl + '/v2/data/insert/VisitInfoMessageComment', requestData)
        .subscribe(res => {
          if ((res as any).resMsg === 'success') {
            this.successToast('评论成功');
            this.commentsInfo = '';
            this.queryCommentsNum();
            this.queryCommentsList();
          }
        }, error => {
        });
    });
  }

  queryCommentsNum() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId'),
    ]).then(([tenantId, userId, recordId, VisitorRecordId]) => {
      const requestData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            // ExhibitorId: VisitorRecordId,
            ExhibitionId: recordId,
            ProductVisitInfoMessageId: this.evaluateId
          }
        }
      };
      this.http.post(AppComponent.apiUrl + '/v2/data/queryCount/VisitInfoMessageComment', requestData)
        .subscribe(res => {
          if ((res as any).resMsg === 'success') {
            this.commentNum = (res as any).result;
          }
        }, error => {
        });
    });
  }

  // 提示函数封装
  async successToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      duration: 2000,
      position: 'top',
      color: 'dark',
      cssClass: 'msg-tip',
    });
    toast.present();
  }

  deleteComment(recordId) {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),

      this.storage.get('token')
    ]).then(([tenantId, userId, token]) => {
      const requestData = {
        tenantId,
        userId,
        params: {
          recordId: recordId
        }
      };
      this.http.post(AppComponent.apiUrl + '/v2/data/delete/VisitInfoMessageComment', requestData,
        { headers: { Authorization: 'Bearer ' + token } })
        .subscribe(res => {
          if ((res as any).resMsg === 'success') {
            this.successToast('删除成功');
            this.queryCommentsNum();
            this.queryCommentsList();
          }
        }, (err) => {
        });
    });
  }

  // 浏览量更新
  updatePvnumber(num) {

    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),

      this.storage.get('token')
    ]).then(([tenantId, userId]) => {
      this.http.post(AppComponent.apiUrl + 'v2/data/update/ProductVisitInfoMessage', {
        tenantId: tenantId,
        userId: userId,
        params: {
          recordId: this.evaluateId,

          setValue: {
            PVNumber: num + 1
          }
        }
      })
        .subscribe(ress => {
          let res = (ress as any);
          if (res.resCode == 0) {
          }
        }
        )


    })
  }

  // 查询浏览量
  queryPvNumber() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),

      this.storage.get('token')
    ]).then(([tenantId, userId]) => {
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/ProductVisitInfoMessage', {
        tenantId: tenantId,
        userId: userId,
        params: {

          condition: {
            RecordId: this.evaluateId
          }
        }
      })
        .subscribe(ress => {
          let res = (ress as any);
          if (res.resCode == 0) {
            let num = 0
            if (res.result[0].PVNumber) {
              num = res.result[0].PVNumber

            }
            this.updatePvnumber(num)
          }
        }
        )
    })
  }

}
