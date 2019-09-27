import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-active-foot',
  templateUrl: './active-foot.page.html',
  styleUrls: ['./active-foot.page.scss'],
})
export class ActiveFootPage implements OnInit {
  public allVisitList;
  public teachList;
  public lessonList;
  public productList;
  public isTeachingType;
  constructor(public router: Router, public toastController: ToastController,
              public nav: NavController, private http: HttpClient,
              public storage: Storage, private loc: Location) { }

  ngOnInit() {
    this.allVisitList = [];
    this.teachList = [];
    this.lessonList = [];
    this.productList = [];
    this.isTeachingType = '0';
  }

  ionViewWillEnter() {
    this.queryTeachVisit('0');
  }

  goToChange1(i) {
    if (i === '0') {
      this.queryTeachVisit(i);
    } else if (i === '1') {
      this.queryLessonVisit(i);
    } else if (i === '2') {
      this.queryProductVisit(i);
    } else {
      this.queryTeachVisit('0');
    }
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  queryTeachVisit(i) {
    this.isTeachingType = i;
    this.allVisitList = [];
    this.teachList = [];
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
            VisitorId: VisitorRecordId
          },
          properties: ['ProductId.Product.___all', 'VisitorId.Visitor.___all', 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all',
            'ProductVisitorId.Visitor.___all'],
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/ProductVisitInfo', courseData)
        .subscribe(res => {
          if ((res as any).resMsg === 'success') {
            if ((res as any).resCode == 0) {

            }
            this.allVisitList = (res as any).result;
            this.allVisitList.forEach(element => {
              if (element.ProductId) {
                if (element.ProductId.ProductType === '教程') {
                  this.teachList.push(element);
                }
              }
            });
          }
        });
    });
  }

  queryLessonVisit(i) {
    this.isTeachingType = i;
    this.allVisitList = [];
    this.lessonList = [];
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
            VisitorId: VisitorRecordId
          },
          properties: ['ProductId.Product.___all', 'VisitorId.Visitor.___all', 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all',
            'ProductVisitorId.Visitor.___all'],
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/ProductVisitInfo', courseData)
        .subscribe(res => {
          if ((res as any).resMsg === 'success') {
            this.allVisitList = (res as any).result;
            this.allVisitList.forEach(element => {
              if (element.ProductId) {
                if (element.ProductId.ProductType === '课程' && element.ProductId.IsShow == true) {
                  this.lessonList.push(element);
                }
              }
            });
          }
        });
    });
  }

  queryProductVisit(i) {
    this.isTeachingType = i;
    this.allVisitList = [];
    this.productList = [];
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
            VisitorId: VisitorRecordId
          },
          properties: ['ProductId.Product.___all', 'VisitorId.Visitor.___all', 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all',
            'ProductVisitorId.Visitor.___all'],
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/ProductVisitInfo', courseData)
        .subscribe(res => {
          if ((res as any).resMsg === 'success') {
            this.allVisitList = (res as any).result;
            this.allVisitList.forEach(element => {
              if (element.ProductId) {
                if (element.ProductId.ProductType === '商品' && element.ProductId.IsShow == true && element.ProductId.IsRecycled == false) {
                  this.productList.push(element);
                  console.log(this.productList);
                }
              } else {

              }

            });
          }
        });
    });
  }

  // 
  goToGoodsDetails(id) {
    this.router.navigateByUrl('/goods-details/' + id)

  }

  goToTeachingDetails(id) {
    this.router.navigateByUrl('/lessons-details/' + id)
  }
  goToCourseDetails(id) {
    this.router.navigateByUrl('/course-details/' + id)

  }

  // 删除互动足迹
  goToDelete(id, index) {
    // 
    console.log("=====index=========" + index)
    console.log(this.lessonList)

    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('token')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId, token]) => {
      // debugger





      let info = {
        userId: userId,
        tenantId: tenantId,

        params: {
          recordId: id
        }
      }

      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/delete/ProductVisitInfo',
          info, { headers: { Authorization: 'Bearer ' + token } }
        )
        .subscribe(res => {
          let result_info = (res as any).result;
          if ((res as any).resCode == 0) {
            console.log('=================');


            // this.presentToast('删除成功')
            if (this.isTeachingType == '0') {
              // this.queryTeachVisit('0');
              this.teachList.splice(index, 1);
            } else if (this.isTeachingType == '1') {
              // this.queryLessonVisit('1');
              this.lessonList.splice(index, 1);
            } else if (this.isTeachingType == '2') {
              // this.queryProductVisit('2');
              this.productList.splice(index, 1);
            } else {
              // this.queryTeachVisit('0');
              this.teachList.splice(index, 1);
            }


          }


        }, (err) => {
          console.log("==========hahha======")
          console.log(err);
          console.log(err.status);
          if (err.status == 403) {
            this.presentToast('登录已过期，请重新登录')

            this.storage.set(
              'VisitorExhibitionInfoId',
              ''
            );
            this.storage.set('VisitorRecordId', '');
            this.router.navigateByUrl('/login-by-password')
          }
        });



    }
    )
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      color: 'dark',
      cssClass: 'toast-wrapper',
      position: 'middle'
    });
    toast.present();
  }
}
