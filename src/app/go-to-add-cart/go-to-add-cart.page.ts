import { Component, OnInit, Input } from '@angular/core';
import { NavParams, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { SettleAccountsCreateOrderPage } from '../settle-accounts-create-order/settle-accounts-create-order.page';
import { SettleAccountsCreateOrderPageModule } from '../settle-accounts-create-order/settle-accounts-create-order.module';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-go-to-add-cart',
  templateUrl: './go-to-add-cart.page.html',
  styleUrls: ['./go-to-add-cart.page.scss'],
})
export class GoToAddCartPage implements OnInit {
  public goodsDetaiInfo;
  public goodsPrice;
  public goodsVolum;
  public sizeId;
  public numBuy1;
  public numBuy;
  public isSpec;
  public goodsId;
  public source;
  public ProductStockNumber;
  @Input() value: number;
  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    public toastController: ToastController,
    public router: Router,
    private http: HttpClient,
    public storage: Storage,
    public alertController: AlertController,
  ) {
    this.source = this.navParams.data.sourceType;
    this.goodsDetaiInfo = this.navParams.data.goodsDetaiInfo;
    this.goodsPrice = this.navParams.data.goodsPrice || this.goodsDetaiInfo.ProductPrice;
    this.goodsVolum = this.goodsDetaiInfo.StockNumber;
    this.goodsId = this.navParams.data.goodsId || this.goodsDetaiInfo.RecordId;
    this.sizeId = this.navParams.data.sizeId;
    // this.numBuy = this.navParams.data.numBuy
    this.numBuy = 1;
  }

  ngOnInit() {
    // this.isSpec=true
  }

  ionViewWillEnter() {
  }

  async presentToast1(msg, time) {
    const toast = await this.toastController.create({
      message: msg,
      duration: time,
      color: 'dark',
      cssClass: 'toast-wrapper',
      position: 'middle'
    });
    toast.present();
  }

  goCilic(id) {
    this.sizeId = id;
    this.goodsPrice = this.goodsDetaiInfo.Specifications[id].price || this.goodsDetaiInfo.ProductPrice;
    this.goodsVolum = this.goodsDetaiInfo.Specifications[id].total;
  }

  async presentAlertTips() {
    const alert = await this.alertController.create({
      header: '',
      subHeader: '',
      message: '请先注册登录',
      buttons: [{
        text: '取消',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
        }
      }, {
        text: '去登录',
        role: 'Ok',
        cssClass: 'secondary',
        handler: (blah) => {
          this.router.navigateByUrl('/login-by-phone');
        }
      }],
    });
    await alert.present();
  }

  // 确定加入购物车 调接口
  confirmCart() {
    if (this.numBuy > this.goodsVolum) {
      this.presentToast('超出库存');
      this.numBuy = 0;
      return;
    }
    // 判断是否登录 没登录的话跳登录
    Promise.all([
      this.storage.get('VisitorRecordId')
    ]).then(([VisitorRecordId]) => {
      if (null == VisitorRecordId) {
        this.modalController.dismiss({
          // 'result': value
        });
        this.presentAlertTips();
        // this.presentToast1('请先登录', '2000');
        // this.router.navigateByUrl('/login-by-phone');
      } else {
        Promise.all([
          this.storage.get('TenantId'),
          this.storage.get('UserId'),
          this.storage.get('ExhibitionId'),
          this.storage.get('VisitorRecordId'),
        ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
          // debugger
          let mm = (this.goodsPrice || this.goodsDetaiInfo.ProductPrice) * 100
          let mm1 = this.numBuy * mm
          let mm2 = mm1 / 100
          let addCartData = {
            userId: userId,
            tenantId: tenantId,
            params: {
              record: {
                'Name': this.goodsDetaiInfo.ExhibitorExhibitionInfoId.StockName,
                'Number': this.numBuy + '',
                'Unit': 1,
                Price: this.goodsPrice || this.goodsDetaiInfo.ProductPrice,
                Type: this.sizeId + '',
                SumPrice: mm2,
                'VisitorId': VisitorRecordId,
                'ProductId': this.goodsId,
                'ExhibitionId': exhibitionId,
                'ExhibitorId': this.goodsDetaiInfo.ExhibitorId,
                'ExhibitorExhibitionInfoId': this.goodsDetaiInfo.ExhibitorExhibitionInfoId.RecordId
              }
            }
          };
          this.http.post(
            AppComponent.apiUrl + 'v2/data/queryList/ShoppingCart',
            {
              userId: userId,
              tenantId: tenantId,
              params: {
                condition: {
                  Type: this.sizeId + '',
                  'VisitorId': VisitorRecordId,
                  'ProductId': this.goodsId,
                  'ExhibitionId': exhibitionId,
                  'ExhibitorId': this.goodsDetaiInfo.ExhibitorId,
                  'ExhibitorExhibitionInfoId': this.goodsDetaiInfo.ExhibitorExhibitionInfoId.RecordId
                }
              }
            }
          ).subscribe((res :any) => {
            if (res.resCode == 0) {
              this.http.post(
                AppComponent.apiUrl + 'v2/data/update/ShoppingCart',
                {
                  userId: userId,
                  tenantId: tenantId,
                  params: {
                    recordId: res.result[0].RecordId,
                    setValue: {
                      'Number': Number(this.numBuy) + Number(res.result[0].Number) + '',
                    }
                  }
                }
              ).subscribe(res => {
                if ((res as any).resCode == 0) {
                  this.presentToast1('加入购物车成功', 2000);
                  this.router.navigateByUrl('/cart-list');
                  this.modalController.dismiss({
                    // 'result': value
                  });
                } else {
                  this.presentToast1('加入购物车失败', 2000);
                }
              });
            } else {
              this.http.post(
                AppComponent.apiUrl + 'v2/data/insert/ShoppingCart',
                addCartData
              ).subscribe(res => {
                if ((res as any).resCode == 0) {
                  this.presentToast1('加入购物车成功', 2000);
                  this.router.navigateByUrl('/cart-list');
                  this.modalController.dismiss({
                    // 'result': value
                  });
                } else {
                  this.presentToast1('加入购物车失败', 2000);
                }
              });
            }
          });
        });
      }
    });
  }

  // 取消加入购物车 弹框消失
  canelCart() {
    this.modalController.dismiss({
      // 'result': value
    });
  }

  // 确认购买
  async confirmBuy() {
    // 判断是否登录 没登录的话跳登录
    if (this.numBuy > this.goodsVolum) {
      this.presentToast('超出库存');
      this.numBuy = this.goodsVolum;
      return;
    }
    Promise.all([
      this.storage.get('VisitorRecordId')
    ]).then(([VisitorRecordId]) => {
      if (null == VisitorRecordId) {
        this.modalController.dismiss({
          // 'result': value
        });
        this.presentAlertTips();
        // this.presentToast1('请先登录', '2000');
        // this.router.navigateByUrl('/login-by-phone');
      } else {
        Promise.all([
          this.storage.get('TenantId'),
          this.storage.get('UserId'),
          this.storage.get('ExhibitionId'),
          this.storage.get('VisitorRecordId'),
        ]).then(async ([tenantId, userId, exhibitionId, VisitorRecordId]) => {
          // debugger
          let mm = (this.goodsPrice || this.goodsDetaiInfo.ProductPrice) * 100
          let mm1 = this.numBuy * mm 
          let mm2 = mm1/100
          console.log('====mm1===========' + mm1+'====='+mm)
          let record = {
            'Name': this.goodsDetaiInfo.ExhibitorExhibitionInfoId.StockName,
            'Number': this.numBuy + '',
            'Unit': 1,
            ProductPrice: this.goodsPrice || this.goodsDetaiInfo.ProductPrice,
            Type: this.sizeId + '',
            SumPrice: mm2,
            'VisitorId': VisitorRecordId,
            'ProductId': this.goodsDetaiInfo,
            'ExhibitionId': exhibitionId,
            'ExhibitorId': this.goodsDetaiInfo.ExhibitorId,
            'ExhibitorExhibitionInfoId': this.goodsDetaiInfo.ExhibitorExhibitionInfoId

          };
          let Specification = '默认规格'
          if (this.goodsDetaiInfo && this.goodsDetaiInfo.Specifications[0]) {
            Specification = this.goodsDetaiInfo.Specifications[0].size || '默认规格';
          }
          let SumPrice = record.SumPrice;
          console.log('======SumPrice===========' + SumPrice)
          let result = [];
          let price1 = (this.goodsPrice || this.goodsDetaiInfo.ProductPrice)*100
          let sum1= price1 * this.numBuy
          let sum2=sum1/100
          let shopcart = [
            {
              shops: {
                shop_name: this.goodsDetaiInfo.ExhibitorExhibitionInfoId.StockName,
                isSelect: true,
                id: 0,
                // shop_type: '自营',
                allPrise: sum2,
                prise: this.goodsPrice || this.goodsDetaiInfo.ProductPrice,
                number: this.numBuy + '',
                Specification: Specification,

                ShoppingCartInfo: record,
                products: [{
                  ProductInfo: this.goodsId,
                  name: this.goodsDetaiInfo ? this.goodsDetaiInfo.productTitle : '',
                  RecordId: this.goodsDetaiInfo ? this.goodsDetaiInfo.RecordId : '',
                  PicPath: this.goodsDetaiInfo ? this.goodsDetaiInfo.PicList[0].PicPath : '',
                  price: Number(this.goodsDetaiInfo.ProductPrice || this.goodsDetaiInfo.Specifications[Number(this.sizeId)].price || this.goodsDetaiInfo.ProductPrice),
                  num: Number(this.goodsDetaiInfo.Number),
                  isSelect: false,
                }]
              }
            }
          ];
          if (SumPrice > 0) {
          } else {
            this.presentToast('请选择商品！');
            return;
          }
          this.modalController.dismiss({});
          const modal = await this.modalController.create({
            component: SettleAccountsCreateOrderPage,
            // cssClass: 'addMyCart',
            componentProps: {
              shopcart: shopcart,
              SumPrice: SumPrice,
              result: result,
            }
          });
          return await modal.present();
        });
      }
    });
  }

  // 购物车+
  goToAdd() {
    this.numBuy++;
    if (this.numBuy > this.goodsVolum) {
      this.presentToast('超出库存');
      this.numBuy--;
    }
  }

  // 购物车-
  goToMinus() {
    if (this.numBuy == 1) {
      this.numBuy = 1;
    } else {
      this.numBuy--;
    }
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
