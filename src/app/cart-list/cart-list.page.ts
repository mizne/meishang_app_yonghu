import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { SettleAccountsCreateOrderPage } from '../settle-accounts-create-order/settle-accounts-create-order.page';
import { SettleAccountsCreateOrderPageModule } from '../settle-accounts-create-order/settle-accounts-create-order.module';
import { AppComponent } from '../app.component';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.page.html',
  styleUrls: ['./cart-list.page.scss']
})
export class CartListPage implements OnInit {
  public shopcart;
  public SumPrice;
  public result;
  public selectAll = false;
  public indeterminate = false;
  public clearBodyRequest;
  constructor(
    public nav: NavController,
    private http: HttpClient,
    public storage: Storage,
    public router: Router,
    public modalController: ModalController,
    public toastController: ToastController,
    private loc: Location
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getShoppingCart();
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  // 获取购物车信息
  getShoppingCart() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, exhibitionId, userId, VisitorId]) => {
      let goodsData = {
        UserId: userId,
        TenantId: tenantId,
        params: {
          condition: {
            ExhibitionId: exhibitionId,
            VisitorId: VisitorId
          },
          properties: [
            'ProductId.Product.___all',
            'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'
          ]
        }
      };
      //  'ProductId' : ObjectId('5cb5aebdd9754d97704b77c4'),
      this.http
        .post(AppComponent.apiUrl + 'v2/data/queryList/ShoppingCart', goodsData)
        .subscribe(res => {
          // this.shopcart = (res as any).result[0];
          // let result = (res as any).result;
          // 过滤已经被删除的商品
          let list = (res as any).result;
          let result = [];
          this.SumPrice = 0;
          for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element.ProductId) {
              result.push(element);
              // this.SumPrice += element.SumPrice;
            }
          }

          this.result = result;
          let shopcart = [];

          for (let index = 0; index < result.length; index++) {
            const element = result[index];
            console.log('=============xiaoyang=============');
            console.log(element.ProductId.StockNumber);
            let prise = 0;
            let Specification = '默认规格';
            if (element.ProductId) {
              prise = element.ProductId.ProductPrice;
            } else {
              prise = Number(element.Price || 0);
            }
            if (element.ProductId && element.ProductId.Specifications[0]) {
              Specification =
                element.ProductId.Specifications[0].size || '默认规格';
            }
            let price1 = prise * 100;
            let price2 = price1 * element.Number;
            let sum = price2 / 100;
            shopcart.push({
              shops: {
                shop_name: element.ExhibitorExhibitionInfoId
                  ? element.ExhibitorExhibitionInfoId.StockName
                  : '',
                isSelect: false,
                id: index,
                // shop_type: '自营',
                allPrise: sum,
                prise: prise,
                number: parseFloat(element.Number),
                RecordId: element.RecordId,
                Specification: Specification,
                ShoppingCartInfo: element,
                products: [
                  {
                    stockNumber: element.ProductId.StockNumber,
                    ProductInfo: element.ProductId,
                    name: element.ProductId
                      ? element.ProductId.productTitle
                      : '',
                    RecordId: element.ProductId
                      ? element.ProductId.RecordId
                      : '',
                    PicPath: element.ProductId
                      ? element.ProductId.PicList[0].PicPath
                      : '',
                    price: prise,
                    num: parseFloat(element.Number),
                    isSelect: false
                  }
                ]
              }
            });
          }
          this.shopcart = shopcart;
        });
    });
  }

  // 商品详情
  goDetails(i, products_index) {
    // /goods-details/5cde8a86a8e91756e0a99745
    let proId = this.shopcart[i].shops.products[products_index].RecordId;
    this.router.navigateByUrl('/goods-details/' + proId);
  }

  // 删除商品
  deleteProduct(index1, index2) {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('token')
    ]).then(([tenantId, exhibitionId, userId, VisitorId, token]) => {
      let goodsData = {
        userId: userId,
        tenantId: tenantId,
        params: {
          recordId: this.shopcart[index1].shops.RecordId
        }
      };
      //  'ProductId' : ObjectId('5cb5aebdd9754d97704b77c4'),
      this.http
        .post(AppComponent.apiUrl + 'v2/data/delete/ShoppingCart', goodsData, {
          headers: { Authorization: 'Bearer ' + token }
        })
        .subscribe(
          res => {
            this.shopcart.splice(index1, 1);
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

  // 增加
  addNum(i, product_index) {
    if (
      this.shopcart[i].shops.products[product_index].num >
      this.shopcart[i].shops.products[product_index].stockNumber
    ) {
      if (this.shopcart[i].shops.products[product_index].stockNumber == 0) {
        this.presentToast('该宝贝已经买光了哦！');
        this.shopcart[i].shops.products[product_index].num = 0;
        this.shopcart[i].shops.number = 0;
        this.shopcart[i].shops.allPrise = 0;
        this.result[i].Number = 0;
        this.result[i].SumPrice = 0;
        this.shopcart[i].shops.allPrise = 0;
        // return;
      } else {
        this.presentToast('超出库存');
      }
      return;
    }
    this.shopcart[i].shops.products[product_index].num =
      this.shopcart[i].shops.products[product_index].num + 1;
    this.shopcart[i].shops.number = this.shopcart[i].shops.number + 1;
    this.result[i].Number = Number(this.result[i].Number) + 1 + '';
    this.result[i].SumPrice =
      this.shopcart[i].shops.prise * Number(this.result[i].Number);

    let aa = 100 * this.shopcart[i].shops.prise * this.shopcart[i].shops.number;

    let sum = aa / 100;

    this.shopcart[i].shops.allPrise = sum;

    this.CalTotalPrice();
    this.updateShoppingCart({
      condition: {
        RecordId: this.shopcart[i].shops.RecordId
      },
      setValue: {
        Price: this.shopcart[i].shops.prise,
        Number: String(this.shopcart[i].shops.number),
        SumPrice: this.shopcart[i].shops.allPrise
      }
    });
  }

  // 减少
  reduceNum(i, product_index) {
    if (this.shopcart[i].shops.products[product_index].num == 1) {
      if (this.shopcart[i].shops.products[product_index].stockNumber == 0) {
        this.presentToast('该宝贝已经买光了哦！');
        this.shopcart[i].shops.products[product_index].num = 0;
        this.shopcart[i].shops.number = 0;
        this.shopcart[i].shops.allPrise = 0;
        this.result[i].Number = 0;
        this.result[i].SumPrice = 0;
        this.shopcart[i].shops.allPrise = 0;
        // return;
      } else {
        this.presentToast('该宝贝不能减少了哦！');
      }
      return;
    }
    this.shopcart[i].shops.products[product_index].num =
      this.shopcart[i].shops.products[product_index].num - 1;
    this.shopcart[i].shops.number = this.shopcart[i].shops.number - 1;
    this.shopcart[i].shops.allPrise =
      this.shopcart[i].shops.number * this.shopcart[i].shops.prise;

    this.result[i].Number = Number(this.result[i].Number) - 1 + '';
    this.result[i].SumPrice =
      this.shopcart[i].shops.prise * Number(this.result[i].Number);

    let aa = 100 * this.shopcart[i].shops.prise * this.shopcart[i].shops.number;
    let sum = aa / 100;

    this.shopcart[i].shops.allPrise = sum;

    this.CalTotalPrice();
    this.updateShoppingCart({
      condition: {
        RecordId: this.shopcart[i].shops.RecordId
      },
      setValue: {
        Price: this.shopcart[i].shops.prise,
        Number: String(this.shopcart[i].shops.number),
        SumPrice: this.shopcart[i].shops.allPrise
      }
    });
  }

  // 修改
  updateShoppingCart(body) {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('token')
    ]).then(([tenantId, exhibitionId, userId, VisitorId, token]) => {
      let goodsData = {
        UserId: userId,
        TenantId: tenantId,
        params: body
        // {
        //   condition: {
        //     ExhibitionId: exhibitionId,
        //     VisitorId: VisitorId
        //   },
        // }
      };
      //  'ProductId' : ObjectId('5cb5aebdd9754d97704b77c4'),
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/updateByCondition/ShoppingCart',
          goodsData,
          { headers: { Authorization: 'Bearer ' + token } }
        )
        .subscribe(
          res => {
            // this.shopcart = (res as any).result[0];
            // console.log(res);
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

  // 订单
  async presentOrder() {
    // this.router.navigateByUrl('/goods-details/' + proId)
    if (this.SumPrice > 0) {
    } else {
      this.presentToast('请选择商品！');
      return;
    }

    let shopcart = [];
    for (let index = 0; index < this.shopcart.length; index++) {
      for (let j = 0; j < this.shopcart[index].shops.products.length; j++) {
        let element = this.shopcart[index].shops.products[j];
        if ( this.shopcart[index].shops.isSelect && element.stockNumber == 0) {
          this.presentToast(element.name + ' 已经卖完了！');
          return;
        }
      }
      this.updateShoppingCart({
        condition: {
          RecordId: this.shopcart[index].shops.RecordId
        },
        setValue: {
          Price: this.shopcart[index].shops.prise,
          Number: String(this.shopcart[index].shops.number),
          SumPrice: this.shopcart[index].shops.allPrise
        }
      });
      if (this.shopcart[index].shops.isSelect === true) {
        const element = this.shopcart[index];
        shopcart.push(element);
      }
    }
    // this.shopcart.forEach(element => {
    //   // this.updateShoppingCart(element)
    //   if (element.shops.isSelect) {
    //     this.updateShoppingCart({
    //       condition: {
    //         RecordId: this.shopcart[i].shops.RecordId
    //       },
    //       setValue: {
    //         Price: this.shopcart[i].shops.prise,
    //         Number: String(this.shopcart[i].shops.number),
    //         SumPrice: this.shopcart[i].shops.allPrise,
    //       }
    //     });
    //   }
    // });
    const modal = await this.modalController.create({
      component: SettleAccountsCreateOrderPage,
      // cssClass: 'addMyCart',
      componentProps: {
        shopcart: shopcart,
        SumPrice: this.SumPrice,
        result: this.result
      }
    });
    return await modal.present();
  }

  // 弹框提示
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'middle'
      // color:'#a2a4ab',
    });
    toast.present();
  }

  selectAllChange() {
    this.selectAll = !this.selectAll;

    if (this.selectAll) {
      this.shopcart.forEach(e => {
        e.shops.isSelect = true;
      });
    } else {
      this.shopcart.forEach(e => {
        e.shops.isSelect = false;
      });
    }
    this.CalTotalPrice();
  }

  selectOneChange(item) {
    item.isSelect = !item.isSelect;

    const hasSelectAll =
      this.shopcart.length > 0 && this.shopcart.every(e => !!e.shops.isSelect);
    const hasNotSelectAll =
      this.shopcart.length > 0 && this.shopcart.every(e => !e.shops.isSelect);

    this.selectAll = hasSelectAll;
    this.indeterminate = !hasSelectAll && !hasNotSelectAll;

    this.CalTotalPrice();
  }

  CalTotalPrice() {
    let SumPrice = 0;
    this.shopcart.forEach(element => {
      if (element.shops.isSelect) {
        SumPrice += element.shops.allPrise;
      }
    });
    this.SumPrice = SumPrice.toFixed(2);
    console.log(
      '============ this.SumPrice==========================' + this.SumPrice
    );
  }

  clearCart() {
    if (this.shopcart) {
      this.clearBodyRequest = [];
      this.shopcart.forEach(element => {
        this.clearBodyRequest.push({
          recordId: element.shops.RecordId
        });
      });
      Promise.all([
        this.storage.get('TenantId'),
        this.storage.get('UserId'),
        this.storage.get('token')
      ]).then(([tenantId, userId, token]) => {
        const delData = {
          tenantId,
          userId,
          params: this.clearBodyRequest
        };
        this.http
          .post(
            AppComponent.apiUrl + 'v2/data/deleteList/ShoppingCart',
            delData,
            { headers: { Authorization: 'Bearer ' + token } }
          )
          .subscribe(res => {
            this.getShoppingCart();
            this.SumPrice = 0;
            this.presentToast('已清空购物车');
          });
      });
    } else {
      this.presentToast('快去添加商品吧~');
    }
  }
}
