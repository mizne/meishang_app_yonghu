import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-order-pay-success',
  templateUrl: './order-pay-success.page.html',
  styleUrls: ['./order-pay-success.page.scss'],
})
export class OrderPaySuccessPage implements OnInit {

  constructor(
    public router: Router,
    private http: HttpClient,
    public storage: Storage,
    public nav: NavController,
    private loc: Location
  ) { }

  ngOnInit() {
    this.getOrderInfo();
  }
  // 返回上一页
  canGoBack() {
    this.loc.back();
  }
  getOrderInfo() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('token')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId, token]) => {
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
        .post(AppComponent.apiUrl + 'v2/data/queryList/Order', goodsData)
        .subscribe(res => {

        });
    });
  }
}
