import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, ModalController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AddAddressPage } from '../add-address/add-address.page';
import { AddAddressPageModule } from '../add-address/add-address.module';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.page.html',
  styleUrls: ['./select-address.page.scss'],
})
export class SelectAddressPage implements OnInit {

  public tenantId;
  public userId;
  public token;
  public exhibitionId;
  public VisitorId;
  public AddressInfo;

  constructor(
    public nav: NavController,
    public toastController: ToastController,
    public router: Router,
    private http: HttpClient,
    public storage: Storage,
    public modalController: ModalController,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
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
      this.getAddress();
    });
  }
  // 返回上一页
  canGoBack() {
    this.modalController.dismiss({

    });

  }
  test2() {
    this.router.navigateByUrl('/test2');
  }
  goToChoose(id, Name) {
    // 添加缓存
    this.storage.set(
      'MyAddress',
      id
    );
    this.storage.set(
      'MyAddressName',
      Name
    );
    this.modalController.dismiss({

    });
  }
  getAddress() {
    this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Address', {
      tenantId: this.tenantId,
      userId: this.userId,
      params: {
        condition: {
          ExhibitionId: this.exhibitionId,
          VisitorId: this.VisitorId,
          IsShow: true
        },
        'properties': [
          'VisitorId.Visitor.___all',
        ],
      }
    }, { headers: { Authorization: 'Bearer ' + this.token } })
      .subscribe(ress => {
        let res = (ress as any);
        if (res.resCode == 0) {
          this.AddressInfo = res.result;
        } else {
          this.AddressInfo = [];
        }
      });
  }
  async addAddress(type, item) {
    if (!type) {
      type = 'add';
    }
    const modal = await this.modalController.create({
      component: AddAddressPage,
      // cssClass: 'addMyCart',
      componentProps: {
        type: type,
        item: item,
      }
    });
    modal.onDidDismiss().then(() => {
      this.getAddress();
    }, () => { });
    return await modal.present(
    );
  }

  async delectAddress(item) {
    const alert = await this.alertController.create({
      header: '',
      subHeader: '',
      message: '确定要删除该地址吗？',
      buttons: [{
        text: '取消',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
        }
      }, {
        text: '确定',
        role: 'Ok',
        cssClass: 'secondary',
        handler: (blah) => {
          this.http.post(AppComponent.apiUrl + 'v2/data/update/Address', {
            tenantId: this.tenantId,
            userId: this.userId,
            params: {
              recordId: item.RecordId,
              setValue: {
                IsShow: false
              }
            }
          }
            , { headers: { Authorization: 'Bearer ' + this.token } }
          )
            .subscribe(ress => {

              let res = (ress as any);
              if (res.resCode == 0) {
                this.getAddress();
                this.presentToast('删除成功！')

              } else {
                this.presentToast('删除失败！')
              }
            }, (err) => {
              console.log('==========hahha======')
              console.log(err);
              console.log(err.status);
              console.log(JSON.stringify(err.status));
              if (err.status == 403) {
                this.presentToast('登录已过期，请重新登录')

                this.storage.set(
                  'VisitorExhibitionInfoId',
                  ''
                );
                this.storage.set('VisitorRecordId', '');
                this.router.navigateByUrl('/login-by-password')
              }
              // Handle error
            })

        }
      }],
    });
    await alert.present();
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
