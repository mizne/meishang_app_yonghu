import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';
@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.page.html',
  styleUrls: ['./my-order.page.scss'],
})

export class MyOrderPage implements OnInit {
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  public UserId;
  public TenantId;
  public ExhibitionId;
  public StepsList;
  public VisitorRecordId;
  public OrderList;
  public activeStyle;
  public activeStyle1;
  public orderType;
  public OrderList1;
  public isOrderNone;
  public isOrderNone1;
  public isTest;
  private pageIndex; // 分页查询
  public isMoreGoods; // 是否 有更多
  private ShowType; // 显示内容的类型
  constructor(public actionSheetController: ActionSheetController, public nav: NavController,
              public router: Router, private http: HttpClient, public storage: Storage,
              public toastController: ToastController, ) { }
  ngOnInit() {
    this.activeStyle = '0';
    this.orderType = '0';
    this.activeStyle1 = '0';
    this.isTest = true;
    this.pageIndex = 1;
    this.isMoreGoods = true;
    this.ShowType = '商品全部';
  }
  ionViewWillLeave() {
    this.activeStyle = '0';
    this.orderType = '0';
    this.activeStyle1 = '0';
    this.isTest = true;
    this.pageIndex = 1;
    this.isMoreGoods = true;
    this.ShowType = '商品全部';
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      buttons: [{
        text: 'Delete',
        role: '哈哈',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked 11111');
          // return false
        },
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Play (open modal)',
        icon: 'arrow-dropright-circle',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }],

    });
    actionSheet.onDidDismiss().then((e) => {
    }, () => { });
    await actionSheet.present();
  }
  // 切换tab
  queryList(index) {
    this.orderType = index;
    this.pageIndex = 1;
    this.isMoreGoods = true;
    if (index === '0') {
      this.activeStyle = '0';
      this.getOrderList();
      this.ShowType = '商品全部';
    } else if (index === '1') {
      this.activeStyle1 = '0';
      this.getOrderList1();
      this.ShowType = '课程全部';
    } else {
      this.activeStyle = '0';
      this.getOrderList();
      this.ShowType = '商品全部';
    }
    console.log(this.ShowType);
  }

  ionViewWillEnter() {
    this.getOrderList();
    this.queryIsTestAccount();
  }

  // 返回上一页
  canGoBack() {
    this.router.navigateByUrl('/tabs/tabs/my-collection');
  }
  // 查看订单 传类型
  // 待付款0 待发货1 待收货2 已完成3 售后4
  // 点击全部商品
  getOrderList() {
    this.activeStyle = '0';
    this.ShowType = '商品全部';
    this.pageIndex = 1;
    this.isMoreGoods = true;
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
          condition: {
            ExhibitionId: exhibitionId,
            VisitorId: VisitorRecordId,
            OrderType: '商品'
          },
          properties: [
            'ProductId.Product.___all',
            // 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'
          ],
          options: {
            pageIndex: 1,
            pageSize: 10
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Order', queryOrderData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            this.OrderList = (res as any).result;
            this.isOrderNone = false;
          } else {
            this.OrderList = [];
            this.isOrderNone = true;
          }
        });
    });
  }
  // 滚动加载全部商品
  LoadOrderList(pageIndex) {
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
        condition: {
          ExhibitionId: exhibitionId,
          VisitorId: VisitorRecordId,
          OrderType: '商品'
        },
        properties: [
          'ProductId.Product.___all',
          // 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'
        ],
        options: {
          pageIndex,
          pageSize: 10
        }
      }
    };
    this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Order', queryOrderData)
      .subscribe(res => {
        if ((res as any).resCode === 0) {
          // 检测是否没有更多
          if ((res as any).result.length < 10) {
            this.isMoreGoods = false;
          }
          this.OrderList = this.OrderList.concat((res as any).result);
          this.isOrderNone = false;
        } else {
          console.log(`queryList Order fail`, (res as any));
        }
      });
    });
  }
  // 点击全部课程
  getOrderList1() {
    this.activeStyle1 = '0';
    this.ShowType = '课程全部';
    this.pageIndex = 1;
    this.isMoreGoods = true;
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
          condition: {
            ExhibitionId: exhibitionId,
            VisitorId: VisitorRecordId,
            OrderType: '课程'
          },
          properties: [
            'ProductId.Product.___all',
            // 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'
          ],
          options: {
            pageIndex: 1,
            pageSize: 10
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Order', queryOrderData)
        .subscribe(res => {
          // this.OrderList1 = (res as any).result;
          if ((res as any).resCode == 0) {
            this.OrderList1 = (res as any).result;
            this.isOrderNone1 = false;
          } else {
            this.OrderList1 = [];
            this.isOrderNone1 = true;
          }
          // console.log(JSON.stringify(this.OrderList ))
        });
    });
  }
  // 滚动加载全部课程
  LoadOrderList1(pageIndex) {
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
          condition: {
            ExhibitionId: exhibitionId,
            VisitorId: VisitorRecordId,
            OrderType: '课程'
          },
          properties: [
            'ProductId.Product.___all',
            // 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'
          ],
          options: {
            pageIndex,
            pageSize: 10
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Order', queryOrderData)
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            // 检测是否没有更多
            if ((res as any).result.length < 10) {
              this.isMoreGoods = false;
            }
            this.OrderList1 = this.OrderList1.concat((res as any).result);
            this.isOrderNone1 = false;
          } else {
            console.log(`queryList Order fail`, (res as any));
          }
        });
    });
  }
  // 点击商品 tab
  getOrderStateList(states) {
    this.activeStyle = states;
    this.ShowType = '商品states';
    this.pageIndex = 1;
    this.isMoreGoods = true;
    console.log(this.ShowType);
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
          condition: {
            ExhibitionId: exhibitionId,
            VisitorId: VisitorRecordId,
            state: states,
            OrderType: '商品'
          },
          properties: [
            'ProductId.Product.___all',
            // 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'
          ],
          options: {
            pageIndex: 1,
            pageSize: 10
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Order', queryOrderData)
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            this.OrderList = (res as any).result;
            this.isOrderNone = false;
          } else {
            this.OrderList = [];
            this.isOrderNone = true;
          }
        });
    });
  }
  // 滚动加载商品订单
  LoadOrderStateList(pageIndex) {
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
          condition: {
            ExhibitionId: exhibitionId,
            VisitorId: VisitorRecordId,
            state: this.activeStyle,
            OrderType: '商品'
          },
          properties: [
            'ProductId.Product.___all',
            // 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'
          ],
          options: {
            pageIndex,
            pageSize: 10
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Order', queryOrderData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            // 检测是否没有更多
            if ((res as any).result.length < 10) {
              this.isMoreGoods = false;
            }
            this.OrderList = this.OrderList.concat((res as any).result);
            this.isOrderNone = false;
          } else {
            console.log(`queryList Order fail`, (res as any));
          }
        });
    });
  }
  // 点击课程 tab
  getOrderStateList1(states) {
    this.activeStyle1 = states;
    this.ShowType = '课程states';
    this.pageIndex = 1;
    this.isMoreGoods = true;
    console.log(this.ShowType);
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
          condition: {
            ExhibitionId: exhibitionId,
            VisitorId: VisitorRecordId,
            state: states,
            OrderType: '课程'
          },
          properties: [
            'ProductId.Product.___all',
            // 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'
          ],
          options: {
            pageIndex: 1,
            pageSize: 10
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Order', queryOrderData)
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            this.OrderList1 = (res as any).result;
            this.isOrderNone1 = false;
          } else {
            this.OrderList1 = [];
            this.isOrderNone1 = true;
          }

        });
    });
  }
  // 滚动加载课程订单
  LoadOrderStateList1(pageIndex) {
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
          condition: {
            ExhibitionId: exhibitionId,
            VisitorId: VisitorRecordId,
            state: this.activeStyle1,
            OrderType: '课程'
          },
          properties: [
            'ProductId.Product.___all',
            // 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'
          ],
          options: {
            pageIndex,
            pageSize: 10
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Order', queryOrderData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            // 检测是否没有更多
            if ((res as any).result.length < 10) {
              this.isMoreGoods = false;
            }
            this.OrderList1 = this.OrderList1.concat((res as any).result);
            this.isOrderNone1 = false;
          } else {
            console.log(`queryList Order fail`, (res as any));
          }
        });
    });
  }
  // 点击售后
  getOrderStateBoolList() {
    this.activeStyle = '300';
    this.ShowType = '商品售后';
    this.pageIndex = 1;
    this.isMoreGoods = true;
    console.log(this.ShowType);
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
          condition: {
            ExhibitionId: exhibitionId,
            VisitorId: VisitorRecordId,
            IsPostSale: true,
            OrderType: '商品'
          },
          properties: [
            'ProductId.Product.___all',
            // 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'
          ],
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Order', queryOrderData)
        .subscribe(res => {

          if ((res as any).resCode == 0) {
            this.OrderList = (res as any).result;
            this.isOrderNone = false;
          } else {
            this.OrderList = [];
            this.isOrderNone = true;
          }
        });
    });
  }
  // 滚动加载售后
  LoadOrderStateBoolList(pageIndex) {
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
          condition: {
            ExhibitionId: exhibitionId,
            VisitorId: VisitorRecordId,
            IsPostSale: true,
            OrderType: '商品'
          },
          properties: [
            'ProductId.Product.___all',
            // 'ExhibitorExhibitionInfoId.ExhibitorExhibitionInfo.___all'
          ],
          options: {
            pageIndex,
            pageSize: 10
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Order', queryOrderData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            // 检测是否没有更多
            if ((res as any).result.length < 10) {
              this.isMoreGoods = false;
            }
            this.OrderList = this.OrderList.concat((res as any).result);
            this.isOrderNone = false;
          } else {
            console.log(`queryList Order fail`, (res as any));
          }
        });
    });
  }
  // 滚动加载时执行
  loadMoreData(event) {
    this.pageIndex = this.pageIndex + 1;
    setTimeout(() => {
      event.target.complete();
      // 根据ShowType 判断执行哪个方法
      if (this.ShowType === '商品全部') {
        this.LoadOrderList(this.pageIndex);
      } else if (this.ShowType === '商品states') {
        this.LoadOrderStateList(this.pageIndex);
      } else if (this.ShowType === '课程全部') {
        this.LoadOrderList1(this.pageIndex);
      } else if (this.ShowType === '课程states') {
        this.LoadOrderStateList1(this.pageIndex);
      } else if (this.ShowType === '商品售后') {
        this.LoadOrderStateBoolList(this.pageIndex);
      } else {
        console.log(`ShowType Error`);
      }
    }, 800);
  }
  changeState(state) {
    switch (state) {
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
  // 查看商品订单详情
  goToDetails(id) {
    this.router.navigateByUrl('/order-detail/' + id);
  }
  // 查看课程订单详情
  goToDetailsForCourse(id) {
    this.router.navigateByUrl('/my-order-of-course-details/' + id);
  }
  // 申请售后
  goToSales(id) {
    this.router.navigateByUrl('/apply-sales/' + id);
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
            'state': '401',
            'IsPostSale': false
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/update/Order', queryOrderData)
        .subscribe(res => {
          // this.OrderList = (res as any).result;
        });
    });
  }
  // 查看物流
  goToLogistics(id) {
    this.router.navigateByUrl('/logistics-info/' + id);
  }
  goToPay() {
  }
  // 取消订单 编辑订单状态为402
  goToCancelOrder(id) {
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
            'state': '402',
            'IsPostSale': false
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/update/Order', queryOrderData)
        .subscribe(res => {
          // this.OrderList = (res as any).result;
          this.presentToast('取消成功', 1500);
          this.getOrderStateList('402');
          // this.getOrderList1()
          this.activeStyle = '402';
        });
    });
  }
  // 取消订单 编辑订单状态为402
  goToCancelOrder1(id) {
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
            'state': '402',
            'IsPostSale': false
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/update/Order', queryOrderData)
        .subscribe(res => {
          // this.OrderList = (res as any).result;
          this.presentToast('取消成功', 1500);
          this.getOrderStateList1('402');
          // this.getOrderList1()
          this.activeStyle1 = '402';
        });
    });
  }
  async presentToast(msg, time) {
    const toast = await this.toastController.create({
      message: msg,
      duration: time,
      cssClass: 'toast-wrapper',
      position: 'middle'
    });
    toast.present();
  }
  // 查询是否是测试账号
  queryIsTestAccount() {
    Promise.all([
      this.storage.get('Phone'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('VisitorExhibitionInfoId')

    ]).then(([phone, VisitorRecordId, VisitorExhibitionInfoId]) => {
      if (phone == '13776410320' || phone == '15651020766' || VisitorRecordId == '5d160c9b8dfa20c84a24fe23' || VisitorExhibitionInfoId == '5d160c9b8dfa20c84a24fe24') {
        this.isTest = true;
      } else {
        this.isTest = false;
      }
    });
  }
}
