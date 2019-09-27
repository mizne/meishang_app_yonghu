import { Component, OnInit } from '@angular/core';
import {
  NavController,
  ToastController,
  ActionSheetController,
  Platform,
  AlertController
} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Wechat } from '@ionic-native/wechat/ngx';
import { forkJoin } from 'rxjs';
import { AppComponent } from '../app.component';
import { CallNumber } from '@ionic-native/call-number/ngx';
// import { Alipay } from '@ionic-native/alipay/ngx';
import { Location } from '@angular/common';
declare let cordova;
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss']
})
export class OrderDetailPage implements OnInit {
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

  public AddressInfo;
  public isAddressSet;
  public addressFirst;

  public storeLogo;
  public storeName;
  public storeId;
  public isIos;
  public refuseReason;
  public isShowReason;
  public isPhone;
  public isArea;
  public phone;
  public area;
  public phonearea;
  public createdTime;
  public countDownState;
  public time;
  public countDownTime;
  public countDownTimeStr = '';
  public OrderInfo;
  constructor(
    public actionSheetController: ActionSheetController,
    public nav: NavController,
    public toastController: ToastController,
    private http: HttpClient,
    public storage: Storage,
    public router: Router,
    private wechat: Wechat,
    public plt: Platform,
    public alertController: AlertController,
    private callNumber: CallNumber,
    // public alipay: Alipay,
    private loc: Location
  ) { }

  ngOnInit() {
    if (this.plt.is('ios')) {
      this.isIos = true;
    } else {
      this.isIos = false;
    }
    this.OrderInfo = {};
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
  }

  ionViewWillEnter() {
    if (this.plt.is('ios')) {
      this.isIos = true;
    } else {
      this.isIos = false;
    }
    const url = this.router.url;
    const splitURL = url.split('/');
    this.orderID = splitURL[2].split('-');
    // this.getAddress();
    this.queryOrderDetail();
    this.queryStoreInfo();
    this.queryRefuseReason();
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  // 取消订单 编辑订单状态为402
  goToCancelOrder(id) {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId')
    ]).then(([tenantId, userId]) => {
      const queryOrderData = {
        userId,
        tenantId,
        params: {
          recordId: id,
          setValue: {
            state: '402',
            IsPostSale: false
          }
        }
      };
      this.http
        .post(AppComponent.apiUrl + 'v2/data/update/Order', queryOrderData)
        .subscribe(res => {
          if ((res as any).resMsg === 'success') {
            // this.getAddress();
            this.queryOrderDetail();
            this.queryStoreInfo();
            this.queryRefuseReason();
          }
        });
    });
  }

  queryOrderDetail() {
    let data = [];
    this.orderID.forEach(element => {
      let e = {
        OrderId: element
      };
      data.push(e);
    });
    const queryOrderData = {
      TenantId: this.tenantId,
      UserId: this.userId,
      params: {
        condition: {
          $or: data
          // OrderId: this.orderID
        },
        properties: ['ProductId.Product.___all', 'OrderId.Order.___all']
      }
    };
    this.http
      .post(
        AppComponent.apiUrl + 'v2/data/queryList/OrderLineItem',
        queryOrderData,
        { headers: { Authorization: 'Bearer ' + this.token } }
      )
      .subscribe(ress => {
        let res = ress as any;
        if (res.resCode == 0) {
          this.OrderDetailList = res.result;
          this.totalPrice = res.result[0].OrderId.Sum;
          this.orderNumber = res.result[0].OrderId.RecordId;
          this.orderTime = res.result[0].OrderId.CreatedAt;
        }
      });
  }

  // 根绝订单id查看订单消息
  queryStoreInfo() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId')
    ]).then(([tenantId, userId]) => {
      // 赋值全局
      const courseData = {
        tenantId,
        userId,
        params: {
          condition: {
            // ExhibitionId: ExhibitionId,
            RecordId: this.orderID[0]
          },
          properties: [
            'ProductId.Product.___all',
            'myAddress.Address.___all',
            'ExhibitorId.Exhibitor.___all',
            'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'
          ]
        }
      };
      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/Order', courseData, {
          headers: { Authorization: 'Bearer ' + this.token }
        })
        .subscribe(ress => {
          let res = ress as any;
          if (res.resCode == 0) {
            this.OrderInfo = res.result[0];
            this.storeLogo = res.result[0].ExhibitorExhibitionInfoId.Logo;
            this.storeName = res.result[0].ExhibitorExhibitionInfoId.StockName;
            this.storeId = res.result[0].ExhibitorExhibitionInfoId.RecordId;
            this.createdTime = res.result[0].CreatedAtMesc;
            this.countDownTime =
              this.createdTime + 3 * 24 * 60 * 60 * 1000 - new Date().getTime();
            this.addressFirst = res.result[0].myAddress;
            if (this.countDownTime > 0 && res.result[0].state === '101') {
              this.time = setInterval(() => {
                this.countDownTime = this.countDownTime - 1000;

                const days = Math.floor(
                  this.countDownTime / (1000 * 60 * 60 * 24)
                );
                const hours = Math.floor(
                  (this.countDownTime % (1000 * 60 * 60 * 24)) /
                  (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                  (this.countDownTime % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor(
                  (this.countDownTime % (1000 * 60)) / 1000
                );
                this.countDownTimeStr =
                  days +
                  '天' +
                  hours +
                  '小时' +
                  minutes +
                  '分钟' +
                  seconds +
                  '秒';

                if (this.countDownTime <= 0) {
                  this.countDownTimeStr = '订单超时';
                  window.clearInterval(this.time);
                  if (res.result[0].state !== '402') {
                    this.goToCancelOrder(this.orderID[0]);
                  }
                }
              }, 1000);
            } else {
              this.countDownTimeStr = '订单超时';
              if (
                res.result[0].state !== '402' &&
                res.result[0].state === '101'
              ) {
                this.goToCancelOrder(this.orderID[0]);
              }
            }

            if (res.result[0].state === '101') {
              this.countDownState = true;
            } else {
              this.countDownState = false;
            }
          }
        });
    });
  }

  goToStore() {
    this.router.navigateByUrl('/store-home/' + this.storeId);
  }

  calTotalPrice(num, price) {
    // tslint:disable-next-line:
    console.log(
      '=====parseInt(num) * parseInt(price)======' + num + '===========' + price
    );

    let num1 = (Number(num) * Number(price)).toFixed(2);

    return num1;
    // return parseInt(num) * parseInt(price);
  }

  // 查看物流
  goToLogistics() {
    this.router.navigateByUrl('/logistics-info/' + this.orderNumber);
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

  // 确认收货
  goToReceipt(id) {
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
          recordId: id,
          setValue: {
            // 'PayTime': '' + new Date().getTime(),
            state: '401',
            IsPostSale: false
          }
        }
      };
      this.http
        .post(AppComponent.apiUrl + 'v2/data/update/Order', queryOrderData)
        .subscribe(res => {
          // this.OrderList = (res as any).result;
        });
    });
  }

  goToaddAddress() {
    // 新增地址
    this.router.navigateByUrl('/address');
  }

  comments(proId) {
    this.router.navigateByUrl('/evaluation/' + proId);
  }

  applicationRefund(proId) {
    this.router.navigateByUrl('/apply-sales/' + proId);
  }

  // contactService() {
  //   this.router.navigateByUrl('/help-serve');
  // }

  submitOrder() {
    if (
      this.OrderInfo.ProductId &&
      Number(this.OrderInfo.ProductId.StockNumber) == 0
    ) {
      this.presentToast(
        (this.OrderInfo.ProductId.ProductName ||
          this.OrderInfo.ProductId.productTitle) + ' 已经卖完了！'
      );
      return;
    }
    let params = {
      amount: this.OrderInfo.Sum,
      OrderName: this.OrderInfo.OrderName,
      OrderId: [this.OrderInfo.RecordId],
      OrdersInfo: []
    };
    let OrdersInfo = {
      ExhibitionId: this.OrderInfo.ExhibitionId,
      ExhibitorId: this.OrderInfo.ExhibitorId.RecordId,
      ExhibitorExhibitionInfoId: this.OrderInfo.ExhibitorExhibitionInfoId
        .RecordId,
      OrderId: this.OrderInfo.RecordId,
      Sum: this.OrderInfo.Sum
    };
    params.OrdersInfo.push(OrdersInfo);

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
                  //     console.log(result); // Success
                  //     if (result.resultStatus == '9000') {
                  //     } else {
                  //     }
                  //   })
                  //   .catch(error => {
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
          urlPath = urlPath + element;
        } else {
          urlPath = urlPath + element + '-';
        }
      }

      let params = {};
      if (this.isIos) {
        params = {
          appid: result.appid,
          mch_id: result.mch_id, // merchant id
          prepay_id: result.prepay_id, // prepay id returned from server
          nonce: result.nonce_str, // nonce string returned from server
          timestamp: result.timestamp, // timestamp
          sign: result.sign // signed string
        };
      } else {
        params = {
          mch_id: result.mch_id, // merchant id
          prepay_id: result.prepay_id, // prepay id returned from server
          nonce: result.nonce_str, // nonce string returned from server
          timestamp: result.timestamp, // timestamp
          sign: result.sign // signed string
        };
      }
      // let params = {
      //   mch_id: result.mch_id, // merchant id
      //   prepay_id: result.prepay_id, // prepay id returned from server
      //   nonce: result.nonce_str, // nonce string returned from server
      //   timestamp: result.timestamp, // timestamp
      //   sign: result.sign, // signed string
      // }
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
          this.presentToast('支付失败！');
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
    forkJoin(
      OrderIdList.map(e =>
        this.http.post(
          AppComponent.apiUrl + 'v2/data/update/Order',
          {
            tenantId: this.tenantId,
            userId: this.userId,
            params: {
              recordId: e,
              setValue: {
                PayTime: '' + new Date().getTime(),
                state: '201',
                PayWay: payMode,
              }
            }
          },
          { headers: { Authorization: 'Bearer ' + this.token } }
        )
      )
    ).subscribe(results => {
      let result = results as any;

      for (let index = 0; index < OrderIdList.length; index++) {
        const element = OrderIdList[index];
        this.goToCutStockNumber(element, '1');
      }
      this.ngOnInit();
      // this.router.navigateByUrl('/order-detail/' + urlPath)
    });
  }
  // 下单减库存
  goToCutStockNumber(id, type) {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('token'),
      this.storage.get('MyAddress')
    ]).then(([tenantId, exhibitionId, userId, VisitorId, token, MyAddress]) => {
      this.http
        .post(AppComponent.apiUrl + 'v2/data/custom/reducestocknumber', {
          tenantId: tenantId,
          userId: userId,
          params: {
            condition: {
              OrderId: id,
              StockReduceType: type
            }
          }
        })
        .subscribe((res: any) => { });
    });
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

  queryRefuseReason() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId')
    ]).then(([tenantId, userId]) => {
      const requestData = {
        tenantId,
        userId,
        params: {
          condition: {
            OrderId: this.orderID[0]
          }
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/queryList/SalesServiceRecord',
          requestData
        )
        .subscribe(
          res => {
            if ((res as any).resMsg === 'success') {
              if (
                (res as any).result[0].Type === '303' ||
                (res as any).result[0].Type === '313' ||
                (res as any).result[0].Type === '323'
              ) {
                this.isShowReason = true;
              } else {
                this.refuseReason = (res as any).result[0].Reason;
                this.isShowReason = (res as any).result[0].IsApprove;
              }
            } else {
              this.isShowReason = true;
            }
          },
          error => { }
        );
    });
  }

  contactService() {
    this.presentAlert();
  }

  // 查询客服联系方式
  querySysInfomation() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, userId, ExhibitionId]) => {
      const courseData = {
        tenantId,
        userId,
        params: {
          condition: {
            ExhibitionId
          }
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/queryList/CustomerService',
          courseData
        )
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            let info = (res as any).result[0];
            if (info.ShowServicePhone) {
              this.isPhone = true;
              this.phone = info.Phone;
              this.phonearea = info.PhoneArea;
              this.area = info.Province + '' + info.City + '' + info.Area;
            } else {
              this.isPhone = false;
            }
            if (info.ShowAddress) {
              this.isArea = true;
              this.area = info.Province + info.City + info.Area;
            } else {
              this.isArea = false;
            }
          } else {
            this.isArea = false;
            this.isPhone = false;
          }
        });
    });
  }

  async presentAlert() {
    let phone = this.phonearea + this.phone;
    const alert = await this.alertController.create({
      header: '',
      subHeader: '',
      message: '确定要拨打投诉电话吗',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => { }
        },
        {
          text: '确定',
          role: 'Ok',
          cssClass: 'secondary',
          handler: blah => {
            this.callNumber
              .callNumber(phone, true)
              .then(res => console.log('Launched dialer!', res))
              .catch(err => console.log('Error launching dialer', err));
          }
        }
      ]
    });
    await alert.present();
  }
}
