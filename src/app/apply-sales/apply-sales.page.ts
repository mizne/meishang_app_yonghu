import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-apply-sales',
  templateUrl: './apply-sales.page.html',
  styleUrls: ['./apply-sales.page.scss'],
})
export class ApplySalesPage implements OnInit {
  public tenantId;
  public userId;
  public token;
  public exhibitionId;
  public VisitorId;
  public proId;
  public ProductInfo;
  public OrderInfo;
  public Content;
  public Reason;
  public type;
  public IsReturn;

  constructor(
    public nav: NavController,
    public toastController: ToastController,
    public router: Router,
    private http: HttpClient,
    public storage: Storage,
    private loc: Location
  ) { }

  ngOnInit() {
    this.IsReturn = true;
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('token')
    ]).then(([tenantId, exhibitionId, userId, VisitorId, token]) => {
      this.tenantId = tenantId;
      this.exhibitionId = exhibitionId;
      this.userId = userId;
      this.VisitorId = VisitorId;
      this.token = token;
      const url = this.router.url;
      const splitURL = url.split('/');
      this.proId = splitURL[2];
      this.getProduct();
      this.getSalesServiceRecord();
    });
  }
  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  getProduct() {
    this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Order', {
      tenantId: this.tenantId,
      userId: this.userId,
      params: {
        condition: {
          RecordId: this.proId
        },
        'properties': [
          'ProductId.Product.___all',
        ],
      }
    }, { headers: { Authorization: 'Bearer ' + this.token } })
      .subscribe(ress => {
        let res = (ress as any);
        if (res.resCode == 0) {
          this.OrderInfo = res.result[0];
          this.ProductInfo = res.result[0].ProductId;
        }
      });
  }
  getSalesServiceRecord() {
    this.http.post(AppComponent.apiUrl + 'v2/data/queryList/SalesServiceRecord', {
      tenantId: this.tenantId,
      userId: this.userId,
      params: {
        condition: {
          OrderId: this.proId
        },
      }
    }, { headers: { Authorization: 'Bearer ' + this.token } })
      .subscribe(ress => {
        let res = (ress as any);
        if (res.resCode == 0) {
          this.IsReturn = false;
        }
      });
  }
  sumbit() {

    console.log('000000  Reason  00000000', this.Reason);
    if (this.type == '0') {
      this.return();
    } else if (this.type == '1') {
      this.exchange();
    } else if (this.type == '2') {
      this.returnExchange();
    } else {
      this.return();
    }
  }
  return() {

    this.http.post(AppComponent.apiUrl + 'v2/data/update/Order', {
      tenantId: this.tenantId,
      userId: this.userId,
      params: {
        recordId: this.OrderInfo.RecordId,
        setValue: {
          state: '303',
          'IsPostSale': true
        }
      }
    }, { headers: { Authorization: 'Bearer ' + this.token } })
      .subscribe(ress => {
        let res = (ress as any);
        if (res.resCode == 0) {
          this.http.post(AppComponent.apiUrl + 'v2/data/insert/SalesServiceRecord', {
            tenantId: this.tenantId,
            userId: this.userId,
            params: {
              record: {
                'OrderId': this.OrderInfo.RecordId,
                'ExhibitionId': this.OrderInfo.ExhibitionId,
                'ExhibitorId': this.OrderInfo.ExhibitorId,
                'ExhibitorExhibitionInfoId': this.OrderInfo.ExhibitorExhibitionInfoId,
                'Time': new Date().toLocaleString(),
                'Name': '退款申请',

                'Type': '303',
                'IsApprove': false,
                // 'Operation':'操作类型',

                'Reason': this.Reason,
                'Content': this.Content,
              }
            }
          }, { headers: { Authorization: 'Bearer ' + this.token } })
            .subscribe(ress => {
              let res = (ress as any);
              if (res.resCode == 0) {
                this.presentToast('您的退款申请已提交，请耐心等待审核！');
                setTimeout(() => {
                  this.canGoBack();
                }, 1500);
              } else {
                this.presentToast('您的退款申请提交失败，请重新提交！');
              }
            });
        } else {
          this.presentToast('您的退款申请提交失败，请重新提交！');
        }
      });

  }

  exchange() {
    this.http.post(AppComponent.apiUrl + 'v2/data/update/Order', {
      tenantId: this.tenantId,
      userId: this.userId,
      params: {
        recordId: this.OrderInfo.RecordId,
        setValue: {
          state: '323',
          'IsPostSale': true
        }
      }
    }, { headers: { Authorization: 'Bearer ' + this.token } })
      .subscribe(ress => {
        let res = (ress as any);
        if (res.resCode == 0) {
          this.http.post(AppComponent.apiUrl + 'v2/data/insert/SalesServiceRecord', {
            tenantId: this.tenantId,
            userId: this.userId,
            params: {
              record: {
                'OrderId': this.OrderInfo.RecordId,
                'ExhibitionId': this.OrderInfo.ExhibitionId,
                'ExhibitorId': this.OrderInfo.ExhibitorId,
                'ExhibitorExhibitionInfoId': this.OrderInfo.ExhibitorExhibitionInfoId,
                'Time': new Date().toLocaleString(),
                'Name': '换货申请',

                'Type': '323',
                'IsApprove': false,
                // 'Operation':'操作类型',

                'Reason': this.Reason,
                'Content': this.Content,
              }
            }
          }, { headers: { Authorization: 'Bearer ' + this.token } })
            .subscribe(ress => {
              let res = (ress as any);
              if (res.resCode == 0) {
                this.presentToast('您的换货申请已提交，请耐心等待审核！');
                setTimeout(() => {
                  this.canGoBack();
                }, 1500);
              } else {
                this.presentToast('您的换货申请提交失败，请重新提交！');
              }
            });
        } else {
          this.presentToast('您的换货申请提交失败，请重新提交！');
        }
      });
  }

  returnExchange() {
    this.http.post(AppComponent.apiUrl + 'v2/data/update/Order', {
      tenantId: this.tenantId,
      userId: this.userId,
      params: {
        recordId: this.OrderInfo.RecordId,
        setValue: {
          state: '313',
          'IsPostSale': true
        }
      }
    }, { headers: { Authorization: 'Bearer ' + this.token } })
      .subscribe(ress => {
        let res = (ress as any);
        if (res.resCode == 0) {
          this.http.post(AppComponent.apiUrl + 'v2/data/insert/SalesServiceRecord', {
            tenantId: this.tenantId,
            userId: this.userId,
            params: {
              record: {
                'OrderId': this.OrderInfo.RecordId,
                'ExhibitionId': this.OrderInfo.ExhibitionId,
                'ExhibitorId': this.OrderInfo.ExhibitorId,
                'ExhibitorExhibitionInfoId': this.OrderInfo.ExhibitorExhibitionInfoId,
                'Time': new Date().toLocaleString(),
                'Name': '退款退货申请',

                'Type': '313',
                'IsApprove': false,
                // 'Operation':'操作类型',

                'Reason': this.Reason,
                'Content': this.Content,
              }
            }
          }, { headers: { Authorization: 'Bearer ' + this.token } })
            .subscribe(ress => {
              let res = (ress as any);
              if (res.resCode == 0) {

                this.presentToast('您的退款退货申请已提交，请耐心等待审核！');
                setTimeout(() => {
                  this.canGoBack();
                }, 1500);
              } else {
                this.presentToast('您的退款退货申请提交失败，请重新提交！');
              }
            });
        } else {
          this.presentToast('您的退款退货申请提交失败，请重新提交！');
        }
      });
  }

  // 弹框提示
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'middle'
      // color:'#a2a4ab',
    });
    toast.present();
  }
}
