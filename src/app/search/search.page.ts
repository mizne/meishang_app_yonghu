import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss']
})
export class SearchPage implements OnInit {
  public UserId;
  public TenantId;
  public ExhibitionId;
  public CategoriesFirstList;
  public CategoriesSecondList;
  public VisitorRecordId;
  public firstCategoryId;
  public toastCtrl;
  public isGoods1;
  public isGoods2;
  public searchValue;
  public coursesList;
  public searchType;
  public isSerach;
  constructor(public nav: NavController,
              public alertController: AlertController,
              public toastController: ToastController,
              public router: Router, private loc: Location,
              private http: HttpClient,
              public storage: Storage) { }

  ngOnInit() {
    // 1，教程
    // 2，课程
    // 3，商品
    // 4，分类
    const aa = this.router.url;
    const arr = aa.split('/');
    this.isSerach = true;
    if (arr[2] === '1') {
      this.searchType = '教程';
    } else if (arr[2] === '2') {
      this.searchType = '课程';
    } else if (arr[2] === '3') {
      this.searchType = '商品';
    } else if (arr[2] === '4') {
      // 商品
      this.searchType = '商品';
    }
    this.searchValue = '';
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  getItems(e) {
    // e.data 只记录最后输入的内容，而不是全部的，用ng-model
    const searchData = this.searchValue + e.detail.data;
    // 搜索分类
    this.goToSearch();
  }

  blurInput(e) {
    // e.data 只记录最后输入的内容，而不是全部的，用ng-model
  }

  // 点击教程查看详情
  goToTeachingDetails(id) {
    this.router.navigateByUrl('/lessons-details/' + id);
  }

  // 点击查看课程详情
  goToCourseDetails(id) {
    this.router.navigateByUrl('/course-details/' + id);
  }

  // 点击查看商品详情
  goToGoodsDetails(id) {
    this.router.navigateByUrl('/goods-details/' + id);
  }

  // 弹框提示
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'middle',
      cssClass: 'toast-wrapper'
    });
    toast.present();
  }

  // 搜索
  goToSearch() {
    if (this.searchValue === '' || this.searchValue === null || this.searchValue === undefined) {
      this.presentToast('请输入名称搜索');
      return;
    }
    // 查询教程
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, userId, ExhibitionId]) => {
      this.UserId = userId;
      this.TenantId = tenantId;
      this.ExhibitionId = ExhibitionId;
      const courseData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
          },
          properties: ['ProductId.Product.___all'],
          // options: {
          //   pageIndex: 1,
          //   pageSize: 10
          // }
        }
      };
      if (this.searchType === '教程') {
        // 先查询是否有输入的分类
        const categoryFistQuery = {
          tenantId: tenantId,
          userId: userId,
          params: {
            condition: {
              Name: '/' + this.searchValue + '/'
            }
          }
        };
        this.http.post(AppComponent.apiUrl + 'v2/data/queryList/CategoryFirst', categoryFistQuery)
          .subscribe(res => {
            if ((res as any).resCode === 0) {
              let categoryId = (res as any).result[0];
              this.isSerach = true;
            } else {
              this.coursesList = [];
              this.isSerach = false;
            }
          });

        courseData.params.condition = {
          ExhibitionId: ExhibitionId,
          SourceType: '商城',
          IsRecycled: false,
          ProductType: this.searchType,
          ProductName: '/' + this.searchValue + '/'
        };
        courseData.params.properties = ['ProductId.Product.___all', 'VisitorExhibitionInfoId.VisitorExhibitionInfo.___all'];
      } else if (this.searchType === '课程') {
        courseData.params.condition = {
          ExhibitionId: ExhibitionId,
          SourceType: '商城',
          IsCourseApprove: '1',
          ProductType: this.searchType,
          CourseTitle: '/' + this.searchValue + '/',
          IsShow: true,

        };
        courseData.params.properties = ['ProductId.Product.___all', 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'];
      } else if (this.searchType === '商品') {
        // productTitle
        courseData.params.condition = {
          ExhibitionId: ExhibitionId,
          SourceType: '商城',
          IsShow: true,
          ProductType: this.searchType,
          productTitle: '/' + this.searchValue + '/'
        };
        courseData.params.properties = ['ProductId.Product.___all', 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'];
      }
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Product', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            this.coursesList = (res as any).result;
            this.isSerach = true;
          } else {
            this.coursesList = [];
            this.isSerach = false;
          }
        });
    });
  }
}
