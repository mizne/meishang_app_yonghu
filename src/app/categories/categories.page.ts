import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
// import { AlertController } from '@ionic/angular';
// import { NavController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
// import { Camera } from '@ionic-native/camera';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss']
})
export class CategoriesPage implements OnInit {
  public UserId;
  public TenantId;
  public ExhibitionId;
  public CategoriesFirstList;
  public CategoriesFirstImage;
  public CategoriesSecondList;
  public VisitorRecordId;
  public firstCategoryId;
  public toastCtrl;
  public isGoods1;
  public isGoods2;
  public searchValue;
  public moreclass;
  public leftStyle;
  public leftid;

  constructor(
    public nav: NavController,
    // public alertController: AlertController,
    public router: Router,
    private http: HttpClient,
    public storage: Storage,
    private loc: Location
  ) { }

  ngOnInit() {
    // this.getCategoriesFirst()
    this.isGoods1 = true;
    this.isGoods2 = false;
    this.searchValue = '';
    this.moreclass = 'test';
    this.leftStyle = 'perStyle';
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  ionViewWillEnter() {
    this.getCategoriesFirst();
  }

  goToDetails(item) {
    var type = '';
    if (item.Name === '全部') {
      type = 'first';
    } else {
      type = 'second';
    }
    this.router.navigateByUrl('/every-cateory/' + item.RecordId + '&' + type);
  }

  // 搜索
  getSearch(searchValue) {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, userId, exhibitionId]) => {
      let queryCategoriesFirst = {
        UserId: userId,
        TenantId: tenantId,
        params: {
          condition: {
            Name: '/' + searchValue + '/'
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/CategorySecond', queryCategoriesFirst)
        .subscribe(res => {
          this.CategoriesFirstList = (res as any).result;
        });
    });
  }

  getItems(e) {
    let searchData =
    this.searchValue + e.detail.data;
    // 搜索分类
    this.getSearch(searchData);
  }

  blurInput(e) {
    // e.data 只记录最后输入的内容，而不是全部的，用ng-model
  }
  // async presentAlertConfirm() {
  //   const alert = await this.alertController.create({
  //     header: 'Confirm!',
  //     message: 'Message <strong>text</strong>!!!',
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: blah => {
  //           console.log('Confirm Cancel: blah');
  //         }
  //       },
  //       {
  //         text: 'Okay',
  //         handler: () => {
  //           console.log('Confirm Okay');
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }

  gotoGet1(item) {
    this.firstCategoryId = item.RecordId;
    this.CategoriesFirstImage = item.Image;
    this.getCategoriesSecond();
    // this.leftStyle ='perStyleActive'
    // this.isGoods1 = !this.isGoods1;
    this.leftid = item.RecordId;
  }

  gotoGet2() {
    this.isGoods2 = !this.isGoods2;
  }

  gotoClick() {
    // let toast = this.toastCtrl.create({
    //   message: '点击了' + name, //提示消息
    //   duration: 3000, //3秒后自动消失
    //   position: 'bottom', //位置top,bottom
    //   showCloseButton: true, //是否显示关闭按钮
    //   closeButtonText: '关闭' //关闭按钮字段
    // });
  }

  // 查询一级分类
  getCategoriesFirst() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, userId, exhibitionId]) => {
      let queryCategoriesFirst = {
        UserId: userId,
        TenantId: tenantId,
        params: {
          condition: {
            ExhibitionId: exhibitionId
          },
          options: {
            // pageIndex: 1,
            // pageSize: 9
            sort: {
              Sort: 1
            }
          }
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/queryList/CategoryFirst',
          queryCategoriesFirst
        )
        .subscribe(res => {
          this.CategoriesFirstList = (res as any).result;
          this.CategoriesFirstImage = (res as any).result[0].Image;
          this.firstCategoryId = this.CategoriesFirstList[0].RecordId;
          this.leftid = this.CategoriesFirstList[0].RecordId;
          this.getCategoriesSecond();
        });
    });
  }

  // 去搜索页面
  goToSearch() {
    this.router.navigateByUrl('/search/4');
  }

  // 查询二级分类
  getCategoriesSecond() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, userId, exhibitionId]) => {
      let queryCategoriesSecond = {
        UserId: userId,
        TenantId: tenantId,
        params: {
          condition: {
            ExhibitionId: exhibitionId,
            CategoryFirstId: this.firstCategoryId
          },
          options: {
            sort: {
              Sort: 1
            }
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/CategorySecond', queryCategoriesSecond)
        .subscribe(res => {
          this.CategoriesSecondList = (res as any).result;
          this.CategoriesSecondList.unshift({
            Name: '全部',
            RecordId: this.firstCategoryId,
            Image: this.CategoriesFirstImage
          });
        });
    });
  }
}
