import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-like-list',
  templateUrl: './like-list.page.html',
  styleUrls: ['./like-list.page.scss'],
})
export class LikeListPage implements OnInit {
  public messageList;
  public isMsgListEmpty;
  constructor(public router: Router, public nav: NavController,
              private http: HttpClient, public storage: Storage,
              private loc: Location) { }

  ngOnInit() {
    this.queryMsgInfo();
  }
  goToProduct(id) {
    this.router.navigateByUrl('/lessons-details/' + id);
  }

  goToProduct1(id, type) {
    if (type == "关注") {
      this.router.navigateByUrl('/my-followers');

    } else {
      this.router.navigateByUrl('/lessons-details/' + id);

    }
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  queryMsgInfo() {
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
            VisitorReceiver: VisitorRecordId
          },
          properties: ['VisitorSender.Visitor.___all', 'ProductId.Product.___all']
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/MsgInfo', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            const allDataList = (res as any).result;

            var commentList = [];
            var followList = [];
            var collectionList = [];
            allDataList.forEach(element => {
              if (element.Type === '收藏') {
                if (element.ProductId) {
                  collectionList.push(element);
                }

              } else if (element.Type === '关注') {
                followList.push(element);
              } else if (element.Type === '评论') {
                if (element.ProductId) {
                  commentList.push(element);
                }

              }
            });

            collectionList = this.unique(collectionList);
            followList = this.unique(followList);
            console.log(collectionList);
            console.log(followList);
            console.log(commentList);
            this.messageList = [...commentList, ...collectionList, ...followList];
            console.log(this.messageList);
            if (this.messageList.length > 0) {
              this.isMsgListEmpty = false
            } else {
              this.isMsgListEmpty = true
            }
          } else {
            this.isMsgListEmpty = true
          }
        });
    });
  }

  unique(arr1) {
    const res = new Map();
    return arr1.filter((a) => !res.has(a.Type) && res.set(a.Type, 1));
  }

  chooseType(type) {
    if (type === '评论') {
      return '评论';
    } else if (type === '收藏') {
      return '收藏';
    } else if (type === '关注') {
      return '关注';
    }
  }
}
