import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-logistics-info',
  templateUrl: './logistics-info.page.html',
  styleUrls: ['./logistics-info.page.scss'],
})
export class LogisticsInfoPage implements OnInit {

  constructor(public router: Router, public http: HttpClient,
              public nav: NavController, public storage: Storage,
              private loc: Location) { }
  routesList: any;
  routesInfo: any;
  public params;
  public detail;
  public orderId;
  public ExpressNum;
  public Logistics;
  ngOnInit() {
    const str = this.router.url;
    this.orderId = str.substring(str.length - 24);
  }
  ionViewWillEnter() {
    this.info();
    // this.getRouteInfo();
  }

  back() {
    this.loc.back();
  }

  // 查看物流接口
  getRouteInfo() {
    // 时间
    const time = new Date();
    const mon = time.getMonth() + 1;
    // 物流运单号 测试：3914855547508
    const nu = this.ExpressNum;
    const com = 'auto';
    const showapi_timestamp = '' + time.getFullYear() + mon + time.getDate() + time.getHours() + time.getMinutes() + time.getSeconds();
    const showapi_appid = '98211';
    const showapi_sign = 'ecc1c4e6948f4d5eb4de331a76ba4d55';

    this.http.post('https://route.showapi.com/64-19?showapi_appid='
      + showapi_appid + '&showapi_sign='
      + showapi_sign + '&showapi_timestamp='
      + showapi_timestamp + '&com='
      + com + '&nu=' + nu + '&senderPhone=&receiverPhone=', {})
      .subscribe(res => {
        this.routesList = (res as any).showapi_res_body;
        this.routesInfo = (this.routesList as any).data;
        this.Logistics = (res as any).showapi_res_body.expTextName;
      });
  }

  // 查询物流信息
  info() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitorId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, userId, exhibitorId, recordId]) => {
      this.params = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            ExhibitionId: recordId,
            RecordId: this.orderId
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Order', this.params)
        .subscribe(res => {
          if (res) {
            this.detail = (res as any).result[0];
            this.ExpressNum = (res as any).result[0].ExpressNum;
            this.getRouteInfo();
          }
        });
    });
  }
}
