import { Component, OnInit } from '@angular/core';
import {
  NavParams,
  ActionSheetController,
  ToastController,
  NavController,
  ModalController,
  Platform,
  LoadingController
} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Wechat } from '@ionic-native/wechat/ngx';
import { forkJoin } from 'rxjs';
import { SelectAddressPage } from '../select-address/select-address.page';
import { AppComponent } from '../app.component';
// import { Alipay } from '@ionic-native/alipay/ngx';
declare let cordova;
@Component({
  selector: 'app-settle-accounts-create-order',
  templateUrl: './settle-accounts-create-order.page.html',
  styleUrls: ['./settle-accounts-create-order.page.scss']
})
export class SettleAccountsCreateOrderPage implements OnInit {
  public shopcart;
  public SumPrice;
  public result;
  public tenantId;
  public userId;
  public token;
  public exhibitionId;
  public VisitorId;
  public AddressInfo;
  public isAddressSet;
  public addressFirst;
  public isIos;
  constructor(
    public actionSheetController: ActionSheetController,
    public modalController: ModalController,
    public navParams: NavParams,
    public toastController: ToastController,
    public router: Router,
    private http: HttpClient,
    public storage: Storage,
    public nav: NavController,
    private wechat: Wechat,
    public loadingController: LoadingController,
    public plt: Platform,
    // public alipay: Alipay,
  ) {
    this.shopcart = this.navParams.data.shopcart;
    console.log(this.shopcart);
    let SumPrice1 = this.navParams.data.SumPrice;
    console.log(SumPrice1 + '================================');
    this.SumPrice = SumPrice1;
    console.log(
      this.SumPrice + '==================this.SumPrice=============='
    );
    this.result = this.navParams.data.result;
  }

  ngOnInit() {
    console.log('hello,i am ios,haha' + this.plt.is('ios'));
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
  }

  // 加载框
  async presentLoading(msg) {
    const loading = await this.loadingController.create({
      message: msg
      // duration: 1500
    });
    await loading.present();
    // const { role, data } = await loading.onDidDismiss();
    loading.onDidDismiss().then(() => {}, () => {});
  }

  ionViewWillEnter() {
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
    this.getAddress();
    if (this.plt.is('ios')) {
      this.isIos = true;
    } else {
      this.isIos = false;
    }
  }

  // 选择地址
  async goToChoose() {
    // if (!type) {
    //   type = 'add';
    // }
    const modal = await this.modalController.create({
      component: SelectAddressPage,
      // cssClass: 'addMyCart',
      componentProps: {
        //  id:id
      }
    });
    modal.onDidDismiss().then(
      () => {
        this.getAddress();
      },
      () => {}
    );
    return await modal.present();
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

  // 返回上一页
  canGoBack() {
    this.modalController.dismiss({});
  }

  getAddress() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('token'),
      this.storage.get('MyAddress')
    ]).then(([tenantId, exhibitionId, userId, VisitorId, token, MyAddress]) => {
      if (undefined == MyAddress || null == MyAddress || MyAddress == '') {
        this.http
          .post(AppComponent.apiUrl + 'v2/data/queryList/Address', {
            tenantId: tenantId,
            userId: userId,
            params: {
              condition: {
                ExhibitionId: exhibitionId,
                VisitorId: VisitorId,
                IsShow: true
                // isDef:1,
              },
              properties: ['VisitorId.Visitor.___all']
            }
          })
          .subscribe(ress => {
            let res = ress as any;
            if (res.resCode == 0) {
              this.AddressInfo = res.result;
              this.isAddressSet = true;
              this.addressFirst = res.result[0];
              this.storage.set('MyAddress', res.result[0].RecordId);
              this.storage.set('MyAddressName', res.result[0].Name);
            } else {
              this.AddressInfo = [];
              this.isAddressSet = false;
              this.storage.set('MyAddress', '');
              this.storage.set('MyAddressName', '');
            }
          });
      } else {
        this.http
          .post(AppComponent.apiUrl + 'v2/data/queryList/Address', {
            tenantId: tenantId,
            userId: userId,
            params: {
              condition: {
                RecordId: MyAddress,
                IsShow: true
              },
              properties: ['VisitorId.Visitor.___all']
            }
          })
          .subscribe(ress => {
            let res = ress as any;
            if (res.resCode == 0) {
              this.AddressInfo = res.result;
              this.isAddressSet = true;
              this.addressFirst = res.result[0];
            } else {
              this.AddressInfo = [];
              this.isAddressSet = false;
              this.storage.set('MyAddress', '');
              this.storage.set('MyAddressName', '');
            }
          });
      }
    });
  }

  goToaddAddress() {
    // 新增地址
    this.router.navigateByUrl('/address');
  }

  submitOrder() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('token'),
      this.storage.get('MyAddress'),
      this.storage.get('MyAddressName')
    ]).then(
      async ([
        tenantId,
        exhibitionId,
        userId,
        VisitorId,
        token,
        MyAddress,
        MyAddressName
      ]) => {
        if (MyAddress == '') {
          this.presentToast('请先选择收货地址');
        } else {
          // this.presentLoading('正在提交订单...');
          let result = [];
          let amount1 = 0;
          for (let index = 0; index < this.shopcart.length; index++) {
            const element = this.shopcart[index];
            if (element.shops.isSelect == true) {
              result.push(element.shops.ShoppingCartInfo);
            }
          }
          console.log(result);
          // console.log(this.SumPrice + '=================' + this.SumPrice.toFixed(2))
          // amount = this.SumPrice.toFixed(2)
          let sum1 = Number(Number(this.SumPrice).toFixed(2));
          console.log(sum1);
          console.log('=============================hhahah');
          let shopcart = [];
          for (let index = 0; index < result.length; index++) {
            console.log('===================11111111===================');
            const element = result[index];
            if (
              element.ProductId.StockNumber == 0 ||
              element.ProductId.StockNumber == '0'
            ) {
              setTimeout(() => {
                this.loadingController.dismiss({});
                this.presentToast(
                  (element.ProductId.ProductName ||
                    element.ProductId.productTitle) + ' 已经卖完了！'
                );
              }, 1000);
              return;
            }

            let prise = 0;
            let UnitPrice = 0;
            let Specification = '默认规格';
            if (element.ProductId) {
              if (element.ProductId.Specifications[0]) {
                Specification =
                  element.ProductId.Specifications[0].size || '默认规格';
                prise =
                  parseFloat(
                    element.Price ||
                      element.ProductId.ProductPrice ||
                      element.ProductId.Specifications[parseFloat(element.Type)]
                        .price
                  ) * parseFloat(element.Number);
                UnitPrice = parseFloat(
                  element.Price ||
                    element.ProductId.ProductPrice ||
                    element.ProductId.Specifications[parseFloat(element.Type)]
                      .price
                );
                console.log(
                  '=====ggggg=========================================' + prise
                );
              } else {
                prise =
                  parseFloat(element.Price || element.ProductId.ProductPrice) *
                  parseFloat(element.Number);
                UnitPrice = parseFloat(
                  element.Price || element.ProductId.ProductPrice
                );
                console.log(
                  '====lalallal========================================' + prise
                );
              }
            } else {
              console.log('========!========element.ProductId=========');
              prise = Number(
                Number(element.Price * Number(element.Number)).toFixed(2)
              );
              UnitPrice = element.Price;
            }
            let orderSum = Number(Number(prise).toFixed(2));
            amount1 += prise;

            console.log(
              amount1 + '============================================='
            );

            let IsRept = false;
            let IsReptIndex = 0;
            console.log('===============chacha=======================');
            console.log(shopcart);

            for (let i = 0; i < shopcart.length; i++) {
              console.log('=======yuhuahauhauhuahauhda=============');
              const ie = shopcart[i];
              if (ie.Orderinfo.ExhibitorId == element.ExhibitorId) {
                IsRept = true;
                IsReptIndex = i;
                // if(){
                // }
              }
            }

            if (IsRept) {
              console.log('======IsRept=========' + IsRept);
              let sumSameStore = 0;
              shopcart[IsReptIndex].Productinfo.push({
                ProductId: element.ProductId ? element.ProductId.RecordId : '',
                ProductNum: element.Number,
                ProductName: element.ProductId
                  ? element.ProductId.productTitle
                  : '',
                Price: prise + '',
                UnitPrice: UnitPrice + ''
                // 'CouponTemplateId':'优惠卷Id'
              });
              sumSameStore = sumSameStore + prise;
              console.log('===========sumSameStore==========' + sumSameStore);
              console.log('======================sum1=====' + sum1);
              console.log(
                IsReptIndex +
                  '=============shopcart[IsReptIndex].Orderinfo.Sum==========' +
                  shopcart[IsReptIndex].Orderinfo.Sum +
                  '=============' +
                  prise
              );
              // shopcart[IsReptIndex].Orderinfo.Sum = parseFloat(shopcart[IsReptIndex].Orderinfo.Sum) + prise ;
              // shopcart[IsReptIndex].Orderinfo.Sum = parseFloat(shopcart[IsReptIndex].Orderinfo.Sum) + prise;
              shopcart[IsReptIndex].Orderinfo.Sum = Number(
                (shopcart[IsReptIndex].Orderinfo.Sum + orderSum).toFixed(2)
              );
              console.log(
                '======================sum1=====' +
                  shopcart[IsReptIndex].Orderinfo.Sum
              );
              shopcart[IsReptIndex].Orderinfo.OrderLineNumber =
                parseFloat(shopcart[IsReptIndex].Orderinfo.OrderLineNumber) +
                parseFloat(element.Number) +
                '';
            } else {
              const newAddress =
                this.addressFirst.Province +
                '-' +
                this.addressFirst.City +
                '-' +
                this.addressFirst.Area +
                '-' +
                this.addressFirst.AddressDetail;
              shopcart.push({
                AppType: '商城',
                Orderinfo: {
                  Receiver: this.addressFirst.Name,
                  ReceiverPhone: this.addressFirst.Phone,
                  ReceiverAddress: newAddress,
                  myAddress: MyAddress,
                  ExhibitorExhibitionInfoId:
                    element.ExhibitorExhibitionInfoId.RecordId,
                  ExhibitorId: element.ExhibitorId,
                  VisitorId: VisitorId,
                  ProductId: element.ProductId
                    ? element.ProductId.RecordId
                    : '',
                  OrderType: '商品',
                  ExhibitionId: this.exhibitionId,
                  OrderLineNumber: element.Number + '',
                  OrderName: element.Name,

                  // Sum: sum1,
                  Sum: orderSum,

                  state: '101',
                  BallanceAccountState: false,
                  // Receiver: MyAddressName,
                  Logistics: '1', // 1快递发货 2同城配送   3到店自取
                  PayWay: '微信支付',
                  OrderSource: '订单来源',
                  Remark: '留言备注'
                  // 'PostSale': '售后',
                  // 'PayTime': '1557109731567',
                  // 'ExpressNum': '快递单号',
                },
                Productinfo: [
                  {
                    ProductId: element.ProductId
                      ? element.ProductId.RecordId
                      : '',
                    ProductNum: element.Number,
                    ProductName: element.ProductId
                      ? element.ProductId.productTitle
                      : '',
                    Price: prise + '',
                    UnitPrice: UnitPrice + ''
                    // SpecificationsIndex:0,
                    // 'CouponTemplateId':'优惠卷Id'
                  }
                ]
              });
            }
          }
          let params = {
            amount: Number(Number(this.SumPrice).toFixed(2)),
            OrderName: '',
            OrderId: [],
            OrdersInfo: []
          };
          console.log(shopcart);
          console.log('==========================hhhaahha======');
          //
          console.log(
            '=================shopcart=======================' + shopcart.length
          );

          forkJoin(
            shopcart.map(e =>
              this.http.post(
                AppComponent.apiUrl + 'v2/data/insert/Order',
                {
                  tenantId: tenantId,
                  userId: userId,
                  params: {
                    record: e
                  }
                },
                { headers: { Authorization: 'Bearer ' + token } }
              )
            )
          ).subscribe(
            async results => {
              console.log(results);
              for (let index = 0; index < results.length; index++) {
                const element = (results[index] as any).result;
                let OrdersInfo = {
                  ExhibitionId: this.exhibitionId,
                  ExhibitorId: element.ExhibitorId,
                  ExhibitorExhibitionInfoId: element.ExhibitorExhibitionInfoId,
                  OrderId: element.RecordId,
                  Sum: element.Sum
                };
                params.OrdersInfo.push(OrdersInfo);
                params.OrderId.push(element.RecordId);
                params.OrderName = element.OrderName;
                this.goToCutStockNumber(element.RecordId, '0');
              }
              // this.loadingController.dismiss({});
              // this.presentToast('提交订单成功请选择付款方式');
              // const actionSheet = await this.actionSheetController.create({
              //   header: '请选择支付方式',
              //   buttons: [
              //     {
              //       text: '微信支付',
              //       // role: '#00bd0b',
              //       // icon: '',
              //       handler: () => {
                      console.log('Delete clicked');
                      this.createOrder(params, params.OrderId);
              //       }
              //     },
              //     {
              //       text: '支付宝支付',
              //       // icon: 'arrow-dropright-circle',
              //       handler: () => {
              //         console.log('Play clicked');
              //       }
              //     },
              //     {
              //       text: '取消',
              //       // icon: 'close',
              //       role: 'cancel',
              //       handler: () => {
              //         console.log('Cancel clicked');
              //       }
              //     }
              //   ]
              // });
              // await actionSheet.present();

              this.deleteShoppingCart(result);
            },
            err => {
              if (err.status == 403) {
                this.storage.set('VisitorExhibitionInfoId', '');
                this.storage.set('VisitorRecordId', '');
                this.presentToast('登录已过期，请重新登录');
                this.router.navigateByUrl('/login-by-password');
              }
            }
          );
        }
      }
    );
  }

  createOrder(params, OrderIdList) {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('token'),
      this.storage.get('MyAddress')
    ]).then(
      async ([tenantId, exhibitionId, userId, VisitorId, token, MyAddress]) => {

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
                  AppComponent.apiUrl + 'v2/data/custom/meishanghui/wechat/payment',
                  {
                    tenantId: tenantId,
                    userId: userId,
                    params: params
                  },
                  { headers: { Authorization: 'Bearer ' + token } }
                )
                .subscribe(
                  (res: any) => {
                    if (res.resCode == 0) {
                      this.loadingController.dismiss({});
                      let result = res.result;
                      this.OrderPay(result, OrderIdList);
                    } else {
                      this.presentToast('生成订单失败');
                    }
                  },
                  err => {
                    if (err.status == 403) {
                      this.presentToast('登录已过期，请重新登录');
      
                      this.storage.set('VisitorExhibitionInfoId', '');
                      this.storage.set('VisitorRecordId', '');
                      this.router.navigateByUrl('/login-by-password');
                    }
                  }
                );
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
                      tenantId: tenantId,
                      userId: userId,
                      params: params
                    },
                    { headers: { Authorization: 'Bearer ' + token } }
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
    );
  }
  deleteShoppingCart(result) {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('token'),
      this.storage.get('MyAddress')
    ]).then(([tenantId, exhibitionId, userId, VisitorId, token, MyAddress]) => {
      let params = [];
      result.forEach(element => {
        params.push({
          recordId: element.RecordId
        });
      });
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/deleteList/ShoppingCart',
          {
            tenantId: tenantId,
            userId: userId,
            params: params
          },
          { headers: { Authorization: 'Bearer ' + token } }
        )
        .subscribe(
          (res: any) => {
            if (res.resCode == 0) {
            }
          },
          err => {
            if (err.status == 403) {
              this.presentToast('登录已过期，请重新登录');
              this.storage.set('VisitorExhibitionInfoId', '');
              this.storage.set('VisitorRecordId', '');
              this.router.navigateByUrl('/login-by-password');
            }
          }
        );
    });
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
      this.wechat
        .sendPaymentRequest(params)
        .then(response => {
          let res = response;
          if (res == 'OK' || Number(res.errCode) == 0) {
            this.paySuccess(urlPath, OrderIdList, '微信支付');
          } else {
            this.presentToast('支付失败，请重试');
            setTimeout(() => {
              this.payError(urlPath);
            }, 1500);
          }
        })
        .catch(reason => {
          this.presentToast('支付失败');
          setTimeout(() => {
            this.payError(urlPath);
          }, 1500);
        });
    } else {
      this.presentToast('支付失败');
    }
  }

  paySuccess(urlPath, OrderIdList, payMode) {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('token')
    ]).then(([tenantId, exhibitionId, userId, VisitorId, token]) => {
      forkJoin(
        OrderIdList.map(e =>
          this.http.post(
            AppComponent.apiUrl + 'v2/data/update/Order',
            {
              tenantId: tenantId,
              userId: userId,
              params: {
                recordId: e,
                setValue: {
                  PayTime: '' + new Date().getTime(),
                  state: '201',
                  PayWay: payMode,
                }
              }
            },
            { headers: { Authorization: 'Bearer ' + token } }
          )
        )
      ).subscribe(results => {
        let result = results as any;
        console.log(results);
        for (let index = 0; index < OrderIdList.length; index++) {
          const element = OrderIdList[index];
          this.goToCutStockNumber(element, '1');
        }
        // this.router.navigateByUrl('/order-detail/' + urlPath)
        this.router.navigateByUrl('/my-order');
        this.canGoBack();
      });
    });
  }

  payError(urlPath) {
    // this.presentToast
    // this.router.navigateByUrl('/order-detail/' + urlPath)
    this.router.navigateByUrl('/my-order');
    this.canGoBack();
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
        .subscribe((res: any) => {});
    });
  }
}
