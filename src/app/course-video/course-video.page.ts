import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-course-video',
  templateUrl: './course-video.page.html',
  styleUrls: ['./course-video.page.scss'],
})
export class CourseVideoPage implements OnInit {

  public arr1 = [];

  constructor(public nav: NavController, public router: Router,
              private http: HttpClient, public storage: Storage,
              private loc: Location) { }
  public UserId;
  public TenantId;
  public ExhibitionId;
  public StepsList;
  public VisitorRecordId;
  public courseId;
  public courseDetailsInfo;
  public goodsList;
  public courseDetails;
  public routesInfo;
  public isCollectCourse;
  public isCollectStore;
  public banner;
  public isOwn;
  ngOnInit() {
    let aa = this.router.url;
    let arr = aa.split('/');
    this.courseId = arr[2];
    this.courseDetailsInfo = {};
    // this.getCourseDetails()
    this.arr1 = [
      '时尚焦点小眼影Carbon',
      '柔遮瑕膏/轻亮粉底液',
      'Ultrasun 优佳全效防晒乳',
      '妙巴黎柔护提亮隔离乳',
      'CUIR葵儿红石榴防护喷雾',
      'JMsolution韩国海洋珍珠防晒棒'
    ];
  }

  ionViewWillEnter() {
    this.getCourseDetails();
    this.queryCollectCourse();
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  goToTest() {
    var mm = 'huhu';
    this.arr1.push(mm);
  }
  // 查询详情
  getCourseDetails() {
    // this.courseId
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId')

    ]).then(([tenantId, userId, exhibitionId]) => {
      let courseData = {
        UserId: userId,
        TenantId: tenantId,
        params: {
          condition: {
            RecordId: this.courseId
          },
          properties: ['ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'],
          // options: { 'pageIndex': 1, 'pageSize': 10 },
          // childObjects: [
          //   {
          //     'fieldName': 'Product',
          //     'reference': {
          //       'object': 'Product',
          //       'field': 'ProductId'
          //     }
          //   }
          // ]
        }
      };
      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
        .subscribe(res => {
          this.courseDetailsInfo = (res as any).result;
          this.goodsList = (res as any).result[0];
          this.banner = this.goodsList.CourseFirstImage;
          this.courseDetails = (this.goodsList as any).CourseList;
          this.routesInfo = (this.goodsList as any).Product;
        });
    });
  }

  // 查询是否关注店铺
  queryCollectStore() {
  }

  // 查询是否收藏本课程
  queryCollectCourse() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, ExhibitionId, VisitorRecordId]) => {
      // debugger

      // 赋值全局

      let courseData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            ExhibitionId: ExhibitionId,
            ProductId: this.courseId,
            VisitorId: VisitorRecordId,
            CollectionByWhat: '收藏课程',
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
          console.log('======查询是否收藏===========');
          if ((res as any).resCode == 0) {
            console.log('======是收藏===========');
            this.isCollectCourse = true
            console.log(this.isCollectCourse + '=========')

            // this.collectId = this.teachingDetails.RecordId
          } else {
            console.log('======否收藏===========');
            this.isCollectCourse = false
          }

        });
    });
  }
  // 点击收藏课程
  goToCollectCourse() {

  }
  // 点击收藏店铺
  goToCollectStore() {


  }

}
