import { Component, OnInit } from '@angular/core';
import { NavController, ToastController,Platform,ActionSheetController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Wechat } from '@ionic-native/wechat/ngx';
import { forkJoin } from 'rxjs';
import { AppComponent } from '../app.component';
// import { Alipay } from '@ionic-native/alipay/ngx';
import { Location } from '@angular/common';
declare let cordova;
@Component({
  selector: 'app-my-order-of-course-details',
  templateUrl: './my-order-of-course-details.page.html',
  styleUrls: ['./my-order-of-course-details.page.scss'],
})
export class MyOrderOfCourseDetailsPage implements OnInit {
  public tenantId;
  public userId;
  public token;
  public exhibitionId;
  public VisitorId;
  public orderID;
  public OrderDetailList;
  public totalPrice;
  public orderNumber;
  public orderTime;
  public storeLogo;
  public storeName;
  public storeId;
  public isIos;

  constructor(
    public nav: NavController,
    public toastController: ToastController,
    private http: HttpClient,
    public storage: Storage,
    public router: Router,
    private wechat: Wechat,
    public plt: Platform,
    // public alipay: Alipay,
    public actionSheetController: ActionSheetController,
    private loc: Location
  ) { }

  ngOnInit() {

    if (this.plt.is('ios')) {
      this.isIos = true;
    } else {
      this.isIos = false;
    }

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
    });
    const url = this.router.url;
    const splitURL = url.split('/');
    this.orderID = splitURL[2];
    this.queryOrderDetail();
    this.queryStoreInfo();

  }

  ionViewWillEnter() {
    if (this.plt.is('ios')) {
      this.isIos = true;
    } else {
      this.isIos = false;
    }

    const url = this.router.url;
    const splitURL = url.split('/');
    this.orderID = splitURL[2];
    this.queryOrderDetail();
    this.queryStoreInfo();
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  queryOrderDetail() {
    let data = []

    // this.orderID.forEach(element => {
    //   let e = {
    //     OrderId: element
    //   }
    //   data.push(e);
    // });
    const queryOrderData = {
      TenantId: this.tenantId,
      UserId: this.userId,
      params: {
        condition: {
          // $or: data
          OrderId: this.orderID
        },
        properties: ['ProductId.Product.___all', 'OrderId.Order.___all']
      }
    };
    this.http.post(AppComponent.apiUrl + 'v2/data/queryList/OrderLineItem', queryOrderData, { headers: { Authorization: 'Bearer ' + this.token } })
      .subscribe(ress => {
        let res = (ress as any);
        if (res.resCode == 0) {
          this.OrderDetailList = res.result;
          this.totalPrice = res.result[0].OrderId.Sum;
          this.orderNumber = res.result[0].OrderId.RecordId;
          this.orderTime = res.result[0].OrderId.CreatedAt;
        }
      });

  }

  calTotalPrice(num, price) {
    // tslint:disable-next-line:radix
    return parseFloat(num) * parseFloat(price);
  }

  orderState(state) {
    switch (state) {
      case '101':
        return '待付款';
      case '201':
        return '待发货';
      case '202':
        return '待收货';
      case '401':
        return '已完成';
      case '301':
        return '同意退款';
      case '302':
        return '拒绝退款';
      case '303':
        return '退款中';
      case '311':
        return '同意退款退货';
      case '312':
        return '拒绝退款退货';
      case '313':
        return '退款退货中';
      case '321':
        return '同意换货';
      case '322':
        return '拒绝换货';
      case '323':
        return '换货中';
    }
  }

  comments(proId) {
    this.router.navigateByUrl('/evaluation/' + proId);
  }

  applicationRefund(proId) {
    this.router.navigateByUrl('/apply-sales/' + proId);
  }

  contactService() {
    this.router.navigateByUrl('/help-serve');
  }

  submitOrder() {

    let OrderDetailList = this.OrderDetailList;

    let params = {
      amount: 0,
      OrderName: '',
      OrderId: [],
      OrdersInfo: []
    };
    let amount = 0;
    for (let index = 0; index < OrderDetailList.length; index++) {
      const element = (OrderDetailList[index] as any).OrderId;
      amount += parseFloat(element.Sum);
      let OrdersInfo = {
        'ExhibitionId': this.exhibitionId,
        'ExhibitorId': element.ExhibitorId,
        'ExhibitorExhibitionInfoId': element.ExhibitorExhibitionInfoId,
        'OrderId': element.RecordId,
        'Sum': element.Sum,
      }
      params.OrdersInfo.push(OrdersInfo);
      params.OrderId.push(element.RecordId);
      params.OrderName = element.OrderName
    }
    params.amount = amount;
    this.createOrder(params, params.OrderId);
  }

  async createOrder(params, OrderIdList) {
    const actionSheet = await this.actionSheetController.create({
      header: '请选择支付方式',
      buttons: [
        {
          text: '微信支付',
          cssClass: 'weChat',
          // role: '#00bd0b',
          // icon: '',
          handler: () => {
            console.log('微信支付');
            this.http
              .post(
                AppComponent.apiUrl +
                'v2/data/custom/meishanghui/wechat/payment',
                {
                  tenantId: this.tenantId,
                  userId: this.userId,
                  params: params
                },
                { headers: { Authorization: 'Bearer ' + this.token } }
              )
              .subscribe((res: any) => {
                let result = res.result;
                if (res.resCode == 0) {
                  this.OrderPay(result, OrderIdList);
                } else {
                  this.presentToast('生成订单失败');
                  console.log('生成订单失败');
                }
              });
          }
        },
        {
          text: '支付宝支付',
          // icon: 'arrow-dropright-circle',
          handler: () => {
            console.log('支付宝支付');

            this.http
              .post(
                AppComponent.apiUrl +
                'v2/data/finance/appPay',
                {
                  tenantId: this.tenantId,
                  userId: this.userId,
                  params: params
                },
                { headers: { Authorization: 'Bearer ' + this.token } }
              )
              .subscribe((res: any) => {
                // alert(JSON.stringify(res));
                if (res.resCode == 0) {
                  // this.alipay.pay(res.result)
                  //   .then(result => {
                  //     // alert('success ' + JSON.stringify(result));
                  //     console.log(result); // Success
                  //     if (result.resultStatus == '9000') {
                  //     } else {
                  //       // alert(result.memo);
                  //     }
                  //   })
                  //   .catch(error => {
                  //     // alert(JSON.stringify(error));
                  //     console.log(error); // Failed
                  //   });
                  cordova.plugins.alipay.payment(res.result, (e) => {
                    if (e.resultStatus == '9000') {
                      this.paySuccess('', OrderIdList, '支付宝支付');
                    } else {
                    }
                  }, (e) => {
                    console.log('fail' + e.resultStatus);
                  });
                }
              }, (error: any) => {
                setTimeout(() => {
                  this.payError('');
                }, 1500);
                alert('支付失败!')
              });
          }
        },
        {
          text: '取消',
          // icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('取消');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  OrderPay(result, OrderIdList) {
    if (result.result_code == 'SUCCESS') {
      let urlPath = '';
      for (let index = 0; index < OrderIdList.length; index++) {
        const element = OrderIdList[index];
        if (index == OrderIdList.length - 1) {
          urlPath = urlPath + element
        } else {
          urlPath = urlPath + element + '-'
        }
      }

      let params = {}
      if (this.isIos) {

        params = {
          appid: result.appid,
          mch_id: result.mch_id, // merchant id
          prepay_id: result.prepay_id, // prepay id returned from server
          nonce: result.nonce_str, // nonce string returned from server
          timestamp: result.timestamp, // timestamp
          sign: result.sign, // signed string
        };
      } else {
        params = {
          mch_id: result.mch_id, // merchant id
          prepay_id: result.prepay_id, // prepay id returned from server
          nonce: result.nonce_str, // nonce string returned from server
          timestamp: result.timestamp, // timestamp
          sign: result.sign, // signed string
        };
      }



      // alert(JSON.stringify(params));
      this.wechat
        .sendPaymentRequest(params)
        .then(response => {
          // alert('调用微信支付');
          // alert(response);
          // alert(JSON.stringify(response));
          let res = response;
          if (res == 'OK' || parseFloat(res.errCode) == 0) {
            this.paySuccess(urlPath, OrderIdList, '微信支付');
          } else {
            this.presentToast('微信支付失败！');
            setTimeout(() => {
              this.payError(urlPath);
            }, 1500);
          }
        })
        .catch(reason => {
          // alert('调用微信支付失败');
          // alert(reason);
          // alert(JSON.stringify(reason));
          this.presentToast('已取消支付！');
          setTimeout(() => {
            this.payError(urlPath);
          }, 1500);
          console.log('调用微信支付失败');
          console.log(reason);
        });
    }
  }

  paySuccess(urlPath, OrderIdList, payMode) {
    // alert('支付成功');
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('token'),
      this.storage.get('VisitorExhibitionInfoId'),
    ]).then(([tenantId, exhibitionId, userId, VisitorId, token, VisitorExhibitionInfoId]) => {
      forkJoin(OrderIdList.map(e => this.http
        .post(AppComponent.apiUrl + 'v2/data/update/Order', {
          tenantId: tenantId,
          userId: userId,
          params: {
            recordId: e,
            setValue: {
              PayTime: '' + new Date().getTime(),
              state: '401',
              IsPostSale: false,
              PayWay: payMode,
            }
          }
        }, { headers: { Authorization: 'Bearer ' + token } })))
        .subscribe((results) => {
          let result = (results as any);
          let teachingData = {
            userId: userId,
            tenantId: tenantId,

            params: {
              record: {

                ExhibitionId: exhibitionId,
                'ProductId': this.OrderDetailList.ProductId.RecordId,
                'VisitorExhibitionInfoId': VisitorExhibitionInfoId,
                'VisitorId': VisitorId,

              }
            }
          };
          this.http
            .post(
              AppComponent.apiUrl + 'v2/data/insert/CourseByRecords',
              teachingData
            )
            .subscribe(res => {

              if ((res as any).resCode == 0) {
                console.log('=========新增成功===')
                this.ngOnInit();
              } else {

              }
            })

          // this.router.navigateByUrl('/order-detail/' + urlPath)
        })
    })
  }
  payError(urlPath) {
    // alert('取消支付')
    this.ngOnInit();
    // this.router.navigateByUrl('/order-detail/' + urlPath)
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      color: 'dark',
      cssClass: 'toast-wrapper',
      position: 'middle'
    });
    toast.present();
  }
  queryStoreInfo() {



    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),

    ]).then(([tenantId, userId]) => {
      // 赋值全局

      const courseData = {
        tenantId,
        userId,
        params: {
          condition: {
            // ExhibitionId: ExhibitionId,
            RecordId: this.orderID
          },
          properties: ['ProductId.Product.___all', 'ExhibitorId.Exhibitor.___all', 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all']
        },

      }


      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Order', courseData, { headers: { Authorization: 'Bearer ' + this.token } })
        .subscribe(ress => {
          let res = (ress as any);
          if (res.resCode == 0) {
            if (res.result[0].ExhibitorExhibitionInfoId) {
              this.storeLogo = res.result[0].ExhibitorExhibitionInfoId.Logo
              this.storeName = res.result[0].ExhibitorExhibitionInfoId.StockName
              this.storeId = res.result[0].ExhibitorExhibitionInfoId.RecordId
            }

          }
        });
    })
  }
  goToStore() {
    this.router.navigateByUrl('/store-home/' + this.storeId);
  }

  // 取消订单 编辑订单状态为402
  goToCancelOrder1() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      const queryOrderData = {
        userId: userId,
        tenantId: tenantId,
        params: {

          recordId: this.orderID,
          setValue: {
            // 'PayTime': '' + new Date().getTime(),
            'state': '402',
            'IsPostSale': false
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/update/Order', queryOrderData)
        .subscribe(res => {
          // this.OrderList = (res as any).result;
          this.presentToast('取消成功')
          this.queryOrderDetail()
          // this.getOrderList1()
          // this.activeStyle1 = '0'

        });
    });
  }

}

