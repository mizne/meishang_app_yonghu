import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-my-course-list',
  templateUrl: './my-course-list.page.html',
  styleUrls: ['./my-course-list.page.scss'],
})
export class MyCourseListPage implements OnInit {

  public courseId;
  public index;
  public goodsList;
  public courseDetails;
  public isVideo;
  public videourl;
  public courseImage;
  public courseTitle;
  public courseDesc;
  public isImage;
  public isOver;
  public isBuy;
  constructor(public toastController: ToastController, public nav: NavController, public router: Router,
              private http: HttpClient, public storage: Storage, private loc: Location) { }

  ngOnInit() {
    const aa = this.router.url;
    const arr = aa.split('/');
    this.courseId = arr[2];

  }
  canGoBack() {
    this.loc.back();
  }

  ionViewWillEnter() {
    this.getCourseDetails();
  }

  ionViewDidEnter() {
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
          properties: ['ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'],
          // options: { pageIndex: 1, pageSize: 10 },
          // childObjects: [
          //   {
          //     fieldName: 'Product',
          //     reference: {
          //       object: 'Product',
          //       field: 'ProductId'
          //     }
          //   }
          // ]
        }
      };
      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            let result = (res as any).result[0];
            this.goodsList = (res as any).result[0];
            let arr = (this.goodsList as any).CourseList
            this.courseDetails = (this.goodsList as any).CourseList;
            for (let index = 0; index < arr.length; index++) {
              const element = arr[index];
              if (element.video) {

                this.isVideo = true;
              } else {
                this.isVideo = false;
              }

              if (element.image) {

                this.isImage = true;
              } else {
                this.isImage = false;
              }

            }

          }
        });
    });
  }

}
