import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-appointment-msg-detail',
  templateUrl: './appointment-msg-detail.page.html',
  styleUrls: ['./appointment-msg-detail.page.scss'],
})
export class AppointmentMsgDetailPage implements OnInit {
  public requestId;
  public detailTitle;
  public detailPicture;
  public detailIntroduction;
  constructor(public nav: NavController, private http: HttpClient,
              public storage: Storage, public router: Router, private loc: Location) { }

  ngOnInit() {
    const aa = this.router.url;
    const arr = aa.split('/');
    this.requestId = arr[2];

    this.detailTitle = '标题';
    this.detailIntroduction = '详情';
    this.queryDetail();
  }

  canGoBack() {
    this.loc.back();
  }

  queryDetail() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId')
    ]).then(([tenantId, UserId]) => {
      const queryIsSign = {
        tenantId,
        userId: UserId,
        params: {
          condition: {
            RecordId: this.requestId
          },
          properties: ['PromotionId.Promotion.___all',]
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/MsgInfo', queryIsSign)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            this.detailTitle = (res as any).result[0].PromotionId.name;
            this.detailIntroduction = (res as any).result[0].PromotionId.Description;
          }
        });
    });
  }
}
