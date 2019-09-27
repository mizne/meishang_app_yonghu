import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-appointment-msg',
  templateUrl: './appointment-msg.page.html',
  styleUrls: ['./appointment-msg.page.scss'],
})
export class AppointmentMsgPage implements OnInit {

  constructor(public nav: NavController,
              public toastController: ToastController,
              public router: Router, private loc: Location,
              private http: HttpClient, public storage: Storage) { }
  public promotionsList;
  public isListEmpty;

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getPromotionList();
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  // 查询营销活动
  getPromotionList() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId'),
      this.storage.get('Phone'),
    ]).then(([tenantId, exhibitionId, UserId, Phone]) => {
      const queryIsSign = {
        tenantId,
        userId: UserId,
        params: {
          condition: {
            ExhibitionId: exhibitionId,
            Type: '营销活动',
            ToAllVisitor: true
          },
          properties: ['PromotionId.Promotion.___all',]
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/MsgInfo', queryIsSign)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            // this.promotionsList = (res as any).result;
            let arr = (res as any).result;
            let arr1 = []
            arr.forEach(element => {
              if (element.PromotionId) {
                arr1.push(element)
              }

            });
            this.promotionsList = arr1
            if (arr1.length > 0) {
              this.isListEmpty = false
            } else {
              this.isListEmpty = true
            }


          } else {
            this.isListEmpty = true
          }
        });
    });
  }

  // 查看营销活动详情
  goToDetail(id) {
    this.router.navigateByUrl('/appointment-msg-detail/' + id);
  }
}
