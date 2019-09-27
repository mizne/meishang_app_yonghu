import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-points-list',
  templateUrl: './points-list.page.html',
  styleUrls: ['./points-list.page.scss'],
})
export class PointsListPage implements OnInit {
  public mypoints;
  public mypointnum;
  constructor(public nav: NavController, public router: Router,
              private http: HttpClient, private loc: Location,
              public storage: Storage) { }

  ngOnInit() {
    // this.getMyPoints()
    // this.accountMyPoints()
    this.mypointnum = '0'
  }
  ionViewWillEnter() {
    this.getMyPoints();
    this.accountMyPoints();
  }
  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  // 总积分
  accountMyPoints() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      // debugger
      let a = new Date()

      let goodsData = {
        UserId: userId,
        TenantId: tenantId,

        params: {
          condition: {

            VisitorId: VisitorRecordId,
            ExhibitionId: exhibitionId,

          }
        }
      };
      //  'ProductId' : ObjectId('5cb5aebdd9754d97704b77c4'),
      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryCount/MyShopPoints', goodsData)
        .subscribe(res => {
          this.mypointnum = (res as any).result;
          this.mypointnum = this.mypointnum * 10

          console.log('========PicList=========' + this.mypointnum);

          //  console.log(JSON.stringify( this.mypoints));
        });
    });
  }

  // 查看积分
  getMyPoints() {
    console.log('=============查看积分===========================')
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      // debugger


      let goodsData = {
        UserId: userId,
        TenantId: tenantId,

        params: {
          condition: {

            VisitorId: VisitorRecordId,
            ExhibitionId: exhibitionId,
            // CreatedAt: '/' + mm+'/'
          }
        }
      };
      //  'ProductId' : ObjectId('5cb5aebdd9754d97704b77c4'),
      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/MyShopPoints', goodsData)
        .subscribe(res => {
          this.mypoints = (res as any).result;

          console.log('========PicList=========');

          // console.log(JSON.stringify( this.mypoints));
        });
    });
  }

}
