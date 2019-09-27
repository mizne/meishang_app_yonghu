import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { AppComponent } from '../app.component';
import { ESdkObsService } from '../esdk-obs.service';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-businessman',
  templateUrl: './businessman.page.html',
  styleUrls: ['./businessman.page.scss'],
})
export class BusinessmanPage implements OnInit {
  public UserId;
  public TenantId;
  public ExhibitionId;
  public StepsList;
  public VisitorRecordId;
  public storeName;
  public storeLogo;
  public storeDesc;
  public Phone;

  constructor(public _d: DomSanitizer, // 图片路径转换使用，使用见HMTL文件
              private camera: Camera, public nav: NavController,
              public toastController: ToastController,
              public router: Router,
              public loadingController: LoadingController,
              private esdkObsService: ESdkObsService,
              private actionSheetController: ActionSheetController,
              private http: HttpClient,
              public storage: Storage,
              private loc: Location
  ) { }

  ngOnInit() {
    this.storeLogo = 'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/67dd5ff7-a1aa-4fa1-8593-513764d0cf01.png';
    Promise.all([
      this.storage.get('Phone'),
    ]).then(([Phone]) => {
      this.Phone = Phone;
    });
  }
  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  async presentLoading(msg) {
    const loading = await this.loadingController.create({
      message: msg,
      // duration: 1500
    });
    await loading.present();

    // const { role, data } = await loading.onDidDismiss();
    loading.onDidDismiss().then(() => {
      // this.presentToast('上传成功', 1500)
    }, () => { });
    console.log('Loading dismissed!');
  }
  // 上传封面弹窗
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: '上传Logo',
      buttons: [{
        text: '拍照',
        icon: 'camera',
        handler: () => {
          let sourceType = this.camera.PictureSourceType.CAMERA;
          this.fileChange3(sourceType);
        }
      }, {
        text: '相册',
        icon: 'image',
        handler: () => {
          let sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
          this.fileChange3(sourceType);
        }
      }, {
        text: '取消',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }
  // 上传图片视频
  fileChange3(Type) {
    const that = this;

    const options: CameraOptions = {
      quality: 80,
      sourceType: Type,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    that.presentLoading('图片上传中...');
    that.camera.getPicture(options).then((file) => {
      try {
        const base64Image = 'data:image/jpeg;base64,' + file;
        that.esdkObsService.uploadImage(base64Image)
          .subscribe(location => {
            this.storeLogo = location;
            that.presentToast('上传成功', 1500);
            that.loadingController.dismiss({
            });
          }, (e) => {
            that.loadingController.dismiss({
            });
            alert(`upload image failure: ${e.message}`)

          });
      } catch (error) {
        alert('error');
        alert(JSON.stringify(error));
        that.loadingController.dismiss({
        });
      }
    }, (err) => {
      console.log(err);
      that.loadingController.dismiss({
      });
      // Handle error
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

  // 入驻商家
  gotoSet() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId'),
      this.storage.get('Phone'),
    ]).then(([tenantId, exhibitionId, UserId, Phone]) => {
      // 查询手机号是否已注册
      let queryIsSign = {
        tenantId: tenantId,
        userId: UserId,
        params: {
          condition: {
            ExhibitionId: exhibitionId,
            Tel: Phone
          }
        }
      };
      // 查询用户表
      // alert(JSON.stringify(queryIsSign))
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/queryList/ExhibitorExhibitionInfo',
          queryIsSign
        )
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            // 已注册 弹出提示
            this.presentToast('您已经是商家啦，登录商家端App查看', 2000);
          } else {
            // 注册
            let queryVisitorData = {
              tenantId: tenantId,
              userId: UserId,
              params: {
                IsExcelImport: true,
                records: [
                  {
                    ExhibitionHallId: '',
                    ProductTypeInfoId: '',
                    ExhibitionId: exhibitionId,
                    CompId: '',
                    StockName: this.storeName,
                    StockIntroduce: this.storeDesc,
                    Introduction: this.storeDesc,
                    CompanyName: this.storeName,
                    ShortName: this.storeName,
                    CompanyNameEn: 'Synair soft',
                    ShortNameEn: 'synair',
                    Type: '1',
                    LinkList: [
                      {
                        LinkId: '',
                        LinkName: this.storeName,
                        LinkMob: Phone,
                        admin: 1,
                        UserName: Phone,
                        UserPassword: '888888',
                        Id: '',
                        Job: '12部长'
                      }
                    ],
                    ProductList: [],
                    StartTime: '',
                    EndTime: '',
                    Logo: this.storeLogo,
                    JoinDate: '2017-12-09T00:00:00',
                    Addr: '上海金沙江西路155弄慧创国际19号2层',
                    Tel: Phone,
                    Fax: '021-60530405',
                    Website: 'www.huizhanren.com',
                    Email: 'info@huizhanren.com',
                    Province: '上海',
                    City: '上海',
                    ExHall: 'H2',
                    BoothNo: 'H2001',
                    Categories: '互联网',
                    Categories2: '互联网',
                    Product: 'BPM、CEP、DMC',
                    ShowArea: 88,
                    YunState: '0'
                  }
                ]
              }
            };
            this.http
              .post(
                AppComponent.apiUrl + 'v2/data/syncDatas/Exhibitor',
                queryVisitorData
              )
              .subscribe(res => {
                let visitorInfo = (res as any).result;
                if ((res as any).resCode == 0) {
                  // this.presentToast('入驻成功,可在商家端App登录', 2000)
                  this.router.navigateByUrl('/apply-success');
                }
              });
          }
        });
    });
  }
}
