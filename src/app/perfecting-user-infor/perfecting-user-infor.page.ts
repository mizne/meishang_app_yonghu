import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, AlertController, LoadingController, ToastController, ActionSheetController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { AppComponent } from '../app.component';
import { ESdkObsService } from '../esdk-obs.service';

@Component({
  selector: 'app-perfecting-user-infor',
  templateUrl: './perfecting-user-infor.page.html',
  styleUrls: ['./perfecting-user-infor.page.scss'],
})
export class PerfectingUserInforPage implements OnInit {
  public UserId;
  public TenantId;
  public ExhibitionId;
  public StepsList;
  public VisitortName;
  public userLogo;
  public newLogo;
  public VisitortRemark;
  public sex;
  public VistiorInfoId;
  public VisitortJob;
  public VisitortAddress;
  public birthday;
  public maxDate;
  constructor(public alertController: AlertController, public modalController: ModalController,
              private camera: Camera,
              public toastController: ToastController,
              public _d: DomSanitizer, // 图片路径转换使用，使用见HMTL文件
              public nav: NavController,
              public loadingController: LoadingController,
              private esdkObsService: ESdkObsService,
              private actionSheetController: ActionSheetController,
              public router: Router, private http: HttpClient, public storage: Storage) { }

  ngOnInit() {
    this.sex = '';
    this.birthday = '2019-05-26';
    this.VisitortAddress = '';
    this.VisitortJob = '';
    let time = new Date();
    let mon = time.getMonth() + 1;
    if (mon < 10) {
      this.birthday = time.getFullYear() + '-0' + mon + '-' + time.getDate();
    } else {
      this.birthday = time.getFullYear() + '-' + mon + '-' + time.getDate();
    }
  }

  ionViewWillEnter() {
    this.getVisitorIn();
    this.maxDate = this.getMaxDate();
  }

  getMaxDate() {
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth() + 1 < 10 ? '0' + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
    const day = nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate();
    return year + '-' + month + '-' + day;
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

  async presentToast(msg, time) {
    const toast = await this.toastController.create({
      message: msg,
      duration: time,
      cssClass: 'toast-wrapper',
      position: 'middle'
    });
    toast.present();
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
            this.newLogo = location;
            that.presentToast('上传成功', 1500);
            that.loadingController.dismiss({
            });
          }, (e) => {
            that.loadingController.dismiss({
            });
            alert(`upload image failure: ${e.message}`)

          });
      } catch (error) {
        that.loadingController.dismiss({
        });
      }
    }, (err) => {
      that.loadingController.dismiss({
      });
      // Handle error
    });
  }

  gotoSet() {
    let userSex = '';
    if (this.sex == 'f') {
      userSex = '2';
    } else {
      userSex = '1';
    }
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId'),
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      // debugger

      let a1 = this.birthday + '';
      let birth = a1.substring(0, 10);
      let queryVisitorData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          recordId: this.VistiorInfoId,
          setValue: {
            NickName: this.VisitortName,
            Logo: this.newLogo,
            // Logo: 'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/eba5d991-414c-4e4e-837a-ca0a15fe2af0.jpg',
            // Name: '101201',
            Birthday: birth,
            CompAddr: this.VisitortAddress,
            Job: this.VisitortJob,
            Sex: userSex,
            Remark: this.VisitortRemark
          }
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/update/VisitorExhibitionInfo',
          queryVisitorData
        )
        .subscribe(res => {
          let visitorInfo = (res as any).result;
          if ((res as any).resCode == 0) {
            this.storage.set(
              'NickName',
              this.VisitortName
            );
            this.storage.set(
              'Logo',
              this.newLogo
            );
            this.storage.set(
              'sex',
              this.sex
            );
            // 更新visitor
            let queryVisitorData1 = {
              tenantId: tenantId,
              userId: userId,
              params: {
                recordId: VisitorRecordId,
                setValue: {
                  NickName: this.VisitortName,
                  Logo: this.newLogo,
                  // Logo: 'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/eba5d991-414c-4e4e-837a-ca0a15fe2af0.jpg',
                  // Name: '101201',
                  Birthday: birth,
                  CompAddr: this.VisitortAddress,
                  Job: this.VisitortJob,
                  Sex: userSex,
                  Remark: this.VisitortRemark
                }
              }
            };
            this.http
              .post(
                AppComponent.apiUrl + 'v2/data/update/Visitor',
                queryVisitorData1
              )
              .subscribe(res => {
                let visitorInfo = (res as any).result;
                if ((res as any).resCode == 0) {
                  this.presentToast('保存成功', 1500);
                  const type = '0';
                  this.router.navigateByUrl('/set-password/' + type);
                } else {
                  this.presentToast('保存失败', 1500);
                }
              });
          }
        });
    });
  }

  getVisitorIn() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId'),
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      let queryVisitorData = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            ExhibitionId: exhibitionId,
            VisitorId: VisitorRecordId
          }, options: { 'pageIndex': 1, 'pageSize': 10 }
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + 'v2/data/queryList/VisitorExhibitionInfo',
          queryVisitorData
        )
        .subscribe(res => {
          let visitorInfo = (res as any).result;
          this.VistiorInfoId = visitorInfo[0].RecordId;
        });
    });
  }
}
