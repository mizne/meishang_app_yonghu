import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-my-logistics',
  templateUrl: './my-logistics.page.html',
  styleUrls: ['./my-logistics.page.scss'],
})
export class MyLogisticsPage implements OnInit {

  constructor(public router: Router, public http: HttpClient,
              public nav: NavController, public storage: Storage,
              private loc: Location) { }
  routesList: any;
  routesInfo: any;
  public params;
  public detail;
  public orderId;
  ngOnInit() {
    let str = this.router.url;
    this.orderId = str.substring(str.length - 24);
  }
  ionViewWillEnter() {
    this.info();
    // this.getRouteInfo()
  }

  canGoBack() {
    this.loc.back();
  }

  // 查看物流接口
  getRouteInfo() {
    //时间
    let time = new Date();
    let mon = time.getMonth() + 1
    //物流运单号 测试：3914855547508
    let nu = "3914855547508"
    let com = "auto"
    let showapi_timestamp = "" + time.getFullYear() + mon + time.getDate() + time.getHours() + time.getMinutes() + time.getSeconds()
    console.log("==========showapi_timestamp========" + showapi_timestamp)
    let senderPhone = ""
    let receiverPhone = ""
    // let showapi_appid="91960"
    let showapi_appid = "93622"
    // let showapi_sign = "826b824d42204275b0aec642662605ad"
    let showapi_sign = "9d7b3ef5b485441281530bc1d76c4fd5"

    this.http
      .post(
        "https://route.showapi.com/64-19?showapi_appid=" + showapi_appid + "&showapi_sign=" + showapi_sign + "&showapi_timestamp=" + showapi_timestamp + "&com=" + com + "&nu=" + nu + "&senderPhone=&receiverPhone=", {}
      )
      .subscribe(
        res => {

          console.log("================查看物流进度========")
          this.routesList = (res as any).showapi_res_body;
          this.routesInfo = (this.routesList as any).data;
          // console.log("======" + JSON.stringify(this.routesList))
          // console.log("======" + JSON.stringify(this.routesInfo))
        }
      )
  }

  // 查询物流信息
  info() {
    Promise.all([this.storage.get('TenantId'), this.storage.get('UserId'), this.storage.get('ExhibitorId'), this.storage.get('RecordId')])
      .then(([tenantId, userId, exhibitorId, recordId]) => {
        this.params = {
          "tenantId": tenantId,
          "userId": userId,
          "params":
          {
            "condition":
            {
              "ExhibitionId": recordId,
              "RecordId": this.orderId
            }
          }
        }
        this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Order', this.params).subscribe(res => {
          if (res) {
            this.detail = (res as any).result[0]
          }

        })
      })
  }

}
