import { Component, OnInit } from '@angular/core';
import { NavParams, ActionSheetController, ToastController, NavController, ModalController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Wechat } from '@ionic-native/wechat/ngx';
import { forkJoin } from 'rxjs'
import { SelectAddressPage } from '../select-address/select-address.page';
import { AppComponent } from '../app.component';
// import { Alipay } from '@ionic-native/alipay/ngx';
declare let cordova;
@Component({
  selector: 'app-confirm-order-for-course',
  templateUrl: './confirm-order-for-course.page.html',
  styleUrls: ['./confirm-order-for-course.page.scss'],
})
export class ConfirmOrderForCoursePage implements OnInit {

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
  public courseDetailsInfo;
  public banner;
  public courseId;
  public isIos;
  public storeId;
  public storeInfoId;
  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    public toastController: ToastController,
    public router: Router,
    private http: HttpClient,
    public storage: Storage,
    public nav: NavController,
    private wechat: Wechat,
    public plt: Platform,
    // public alipay: Alipay,
    public actionSheetController: ActionSheetController,
  ) {
    this.courseDetailsInfo = this.navParams.data.courseDetailsInfo;
    this.banner = this.navParams.data.banner;
    this.courseId = this.navParams.data.courseId;
    // console.log('========== this.banner===' + JSON.stringify(this.courseDetailsInfo))
    if (this.courseDetailsInfo.ExhibitorExhibitionInfoId) {

      this.storeInfoId = this.courseDetailsInfo.ExhibitorExhibitionInfoId.RecordId

    } else {
      this.storeInfoId = ''
    }

    if (this.courseDetailsInfo.ExhibitorId) {
      this.storeId = this.courseDetailsInfo.ExhibitorId
    } else {
      this.storeId = ''
    }

  }

  ngOnInit() {
    console.log('-----------');
    console.log(this.shopcart);
    console.log(this.SumPrice);
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
    modal.onDidDismiss().then(() => {
      // this.getAddress();

    }, () => { });
    return await modal.present(
    );
  }

  ionViewWillEnter() {
    if (this.plt.is('ios')) {
      this.isIos = true
    } else {
      this.isIos = false
    }

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
    this.modalController.dismiss({
    });
  }

  getAddress() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('token'),
      this.storage.get('MyAddress'),

    ]).then(([tenantId, exhibitionId, userId, VisitorId, token, MyAddress]) => {

      if (undefined == MyAddress || null == MyAddress) {
        this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Address', {
          tenantId: tenantId,
          userId: userId,
          params: {
            condition: {
              ExhibitionId: exhibitionId,
              VisitorId: VisitorId,
              IsShow: true
              // isDef:1,
            },
            'properties': [
              'VisitorId.Visitor.___all',
            ],
          }
        })
          .subscribe(ress => {
            let res = (ress as any);
            if (res.resCode == 0) {
              this.AddressInfo = res.result;

              this.isAddressSet = true
              this.addressFirst = res.result[0];
              this.storage.set(
                'MyAddress', res.result[0].RecordId

              );

            } else {
              this.AddressInfo = []
              this.isAddressSet = false
            }
          });
      } else {

        this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Address', {
          tenantId: tenantId,
          userId: userId,
          params: {
            condition: {
              RecordId: MyAddress,

            },
            'properties': [
              'VisitorId.Visitor.___all',
            ],
          }
        })
          .subscribe(ress => {
            let res = (ress as any);
            if (res.resCode == 0) {

              this.AddressInfo = res.result;

              this.isAddressSet = true
              this.addressFirst = res.result[0];


            } else {
              this.AddressInfo = []
              this.isAddressSet = false
            }
          });

      }

    })
  }

  // goToaddAddress() {
  //   // 新增地址
  //   this.router.navigateByUrl('/address')
  // }
  goToStore(id) {
    this.router.navigateByUrl('/store-home/' + id);
  }
  submitOrder() {

    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('token'),
      // this.storage.get('MyAddress'),
    ]).then(([tenantId, exhibitionId, userId, VisitorId, token]) => {

      let result = [];
      let amount = this.courseDetailsInfo.ProductPrice;
      // for (let index = 0; index < this.shopcart.length; index++) {
      //   const element = this.shopcart[index];
      //   if (element.shops.isSelect == true) {
      //     result.push(element.shops.ShoppingCartInfo)
      //   }
      // }
      // console.log('result')
      // console.log(result)
      let shopcart = [];
      // for (let index = 0; index < result.length; index++) {
      //   const element = result[index];
      //   let prise = 0;
      //   let Specification = '默认规格';
      //   if (element.ProductId) {
      //     prise = Number(element.Price || element.ProductId.Specifications[Number(element.Type)].price || element.ProductId.Price);
      //   } else {
      //     prise = Number(element.Price || '0');
      //   }

      //   amount += prise;

      //   if (element.ProductId && element.ProductId.Specifications[0]) {
      //     Specification = element.ProductId.Specifications[0].size || '默认规格';
      //   }

      //   let IsRept = false;
      //   let IsReptIndex = 0;

      // for (let i = 0; i < shopcart.length; i++) {
      //   const ie = shopcart[i];
      //   if (ie.Orderinfo.ExhibitorId == element.ExhibitorId) {
      //     IsRept = true;
      //     IsReptIndex = i
      //     // if(){

      //     // }
      //   }
      // }
      // if (IsRept) {
      //   shopcart[IsReptIndex].Productinfo.push({
      //     'ProductId': element.ProductId ? element.ProductId.RecordId : '',
      //     'ProductNum': element.Number,
      //     'ProductName': element.ProductId ? element.ProductId.productTitle : '',
      //     'Price': prise + '',
      //     // 'CouponTemplateId':'优惠卷Id'
      //   });
      //   shopcart[IsReptIndex].Orderinfo.Sum = Number(shopcart[IsReptIndex].Orderinfo.Sum) + prise + '';
      //   shopcart[IsReptIndex].Orderinfo.OrderLineNumber = Number(shopcart[IsReptIndex].Orderinfo.OrderLineNumber) + Number(element.Number) + '';

      // } else {
      shopcart.push({
        'AppType': '商城',
        'Orderinfo': {
          'myAddress': '',
          'ExhibitionId': exhibitionId,
          'ExhibitorExhibitionInfoId': this.storeInfoId,
          'ExhibitorId': this.storeId,
          'VisitorId': this.VisitorId,
          'ProductId': this.courseId ? this.courseId : '',
          'OrderType': '课程',

          'OrderLineNumber': '1',
          'OrderName': '购买课程',

          'Sum': this.courseDetailsInfo.ProductPrice,

          'state': '101',
          'BallanceAccountState': false,

          'Receiver': '收货人',
          'Logistics': '1',        //1快递发货 2同城配送   3到店自取

          'PayWay': '微信支付',
          'OrderSource': '订单来源',
          'Remark': '留言备注',

          // 'PostSale': '售后',
          // 'PayTime': '1557109731567',
          // 'ExpressNum': '快递单号',
        },
        'Productinfo': [
          {
            'ProductId': this.courseId ? this.courseId : '',
            'ProductNum': '1',
            'ProductName': this.courseDetailsInfo.CourseTitle ? this.courseDetailsInfo.CourseTitle : '',
            'Price': this.courseDetailsInfo.ProductPrice + '',
            // 'CouponTemplateId':'优惠卷Id'
          }
        ]

      })



      let params = {
        amount: amount,
        OrderName: '',
        OrderId: [],
        OrdersInfo: []
      };

      forkJoin(shopcart.map(e => this.http
        .post(AppComponent.apiUrl + 'v2/data/insert/Order', {
          tenantId: tenantId,
          userId: userId,
          params: {
            record: e
          }
        }
          , { headers: { Authorization: 'Bearer ' + token } }))
      )
        .subscribe((results) => {
          console.log('-----订单生成-------');
          console.log(results);


          for (let index = 0; index < results.length; index++) {
            const element = (results[index] as any).result;
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
          this.createOrder(params, params.OrderId);
        }, (err) => {
          console.log('==========hahha======')
          console.log(err);
          console.log(err.status);
          if (err.status == 403) {
            this.presentToast('登录已过期，请重新登录')

            this.storage.set(
              'VisitorExhibitionInfoId',
              ''
            );
            this.storage.set('VisitorRecordId', '');
            this.router.navigateByUrl('/login-by-password')
          }
        })



    })
  }

  async createOrder(params, OrderIdList) {
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
              role: '#00bd0b',
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
                      // this.loadingController.dismiss({});
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
              role:'#03a9f4',
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
              icon: 'close',
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
      // let params = {
      //   mch_id: result.mch_id, // merchant id
      //   prepay_id: result.prepay_id, // prepay id returned from server
      //   nonce: result.nonce_str, // nonce string returned from server
      //   timestamp: result.timestamp, // timestamp
      //   sign: result.sign, // signed string
      // }

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
          let res = response;
          if (res == 'OK' || Number(res.errCode) == 0) {
            this.paySuccess(urlPath, OrderIdList, '微信支付');
          } else {
            this.presentToast('支付失败，清除重试');
            setTimeout(() => {
              this.payError(urlPath);
            }, 1500);
          }
        })
        .catch(reason => {
          this.presentToast('已取消支付');
          setTimeout(() => {
            this.payError(urlPath);
          }, 1500);
        });
    } else {
      this.presentToast('已取消支付');
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
          // this.router.navigateByUrl('/order-detail/' + urlPath)
          // 新增一条购买记录

          let teachingData = {
            userId: userId,
            tenantId: tenantId,

            params: {
              record: {

                ExhibitionId: exhibitionId,

                'ProductId': this.courseId,
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
                this.router.navigateByUrl('/my-order');
                this.canGoBack();
              } else {
              }
            });
        });
    });
  }
  payError(urlPath) {
    // this.router.navigateByUrl('/order-detail/' + urlPath)
    this.router.navigateByUrl('/my-order');
    this.canGoBack();
  }



}
