import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-test-view-course',
  templateUrl: './test-view-course.page.html',
  styleUrls: ['./test-view-course.page.scss'],
})
export class TestViewCoursePage implements OnInit {
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
  constructor(public toastController: ToastController, public nav: NavController, public router: Router,
              private http: HttpClient, public storage: Storage, private loc: Location) { }

  ngOnInit() {
    const aa = this.router.url;
    const arr = aa.split('/');
    let str = arr[2];
    let arr2 = str.split('&');
    this.courseId = arr2[0];
    this.index = arr2[1];
    this.isOver = false;
  }
  canGoBack() {
    this.loc.back();
  }

  ionViewWillEnter() {
    this.getCourseDetails();
  }

  ionViewDidEnter() {
    // this.trialVideo();
    // const video = document.querySelector('video');
    // video.addEventListener('timeupdate', (event) => {
    //   this.userSeeked();
    // });
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
          if ((res as any).resCode === 0) {
            let result = (res as any).result[0];
            this.goodsList = (res as any).result[0];
            this.courseDetails = (this.goodsList as any).CourseList;

            if (result.CourseList[this.index].video) {
              this.videourl = result.CourseList[this.index].video;
              this.isVideo = true;
            } else {
              this.isVideo = false;
            }

            if (result.CourseList[this.index].image) {
              this.courseImage = result.CourseList[this.index].image;
              this.isImage = true;
            } else {
              this.isImage = false;
            }
            if (result.CourseList[this.index].introduce) {
              this.courseDesc = result.CourseList[this.index].introduce;
            } else {
              this.courseDesc = '该章节暂无描述信息';
            }
            if (result.CourseList[this.index].title) {
              this.courseTitle = result.CourseList[this.index].title;

            } else {
              this.courseTitle = '该章节暂无标题';
            }
          }
        });
    });
  }

  jump() {
    this.loc.back();
  }

  trialVideo() {
    setTimeout(() => {
      this.timeOutEvent();
    }, 60500);
  }

  userSeeked() {
    this.timeOutEvent();
  }

  timeOutEvent() {
    const video = document.querySelector('video');
    if (video.currentTime > 60) {
      this.isOver = true;
      video.pause();
      // setTimeout(() => {
      //   const myVideo = document.getElementById('myVideo');
      //   const dynamicStyle = document.getElementById('dynamicStyle');
      //   dynamicStyle.style.height = myVideo.offsetHeight.toString();
      // }, 500);
    }
  }
}
