import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router";
import { ToastController, ActionSheetController } from "@ionic/angular";
import { NavController } from "@ionic/angular";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { ModalController } from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";
import { AlertController } from "@ionic/angular";
import { $, $$ } from "protractor";
// import { ToastController } from 'ionic/angular';
import { NavParams } from "@ionic/angular";
import { LoadingController } from "@ionic/angular";
import { AppComponent } from "../app.component";
import { ESdkObsService } from "../esdk-obs.service";
import { Subscription } from "rxjs";
@Component({
  selector: "app-my-add-teaching",
  templateUrl: "./my-add-teaching.page.html",
  styleUrls: ["./my-add-teaching.page.scss"]
})
export class MyAddTeachingPage implements OnInit {
  public courList;
  public title;
  public UserId;
  public TenantId;
  public ExhibitionId;
  public StepsList;
  public VisitorRecordId;
  public ProductName;
  public FirstPic;
  public CategoriesFirstList;
  public categorySelect;
  public selectOptions;
  public selecText;
  public list;
  public testPicUrl;
  public videoUrl;
  public videoPoster;
  public PicList;
  public videoFile;
  public album;
  public isFirsrNull;
  public addSource; // 0首页 1 详情页
  public teachingId;
  public selecProductId;
  public selecCourseId;
  public ChooseCourseList;
  public chooseProductList;
  public isStore;
  videos: string;
  public isUplodaing;
  public progress;
  public progress1;
  public rate;
  public progressIndex;
  public isPoster;

  // 上传视频中，返回键停止请求
  public videoUploadRate = 0;
  public subscription: Subscription = Subscription.EMPTY;
  constructor(
    public navParams: NavParams,
    public alertController: AlertController,
    public modalController: ModalController,
    public nav: NavController,
    public toastController: ToastController,
    public router: Router,
    private http: HttpClient,
    public storage: Storage,
    private camera: Camera,
    private esdkObsService: ESdkObsService,
    public loadingController: LoadingController,
    private actionSheetController: ActionSheetController,
    public _d: DomSanitizer // 图片路径转换使用，使用见HMTL文件
  ) {
    this.addSource = this.navParams.data.source;
    if (this.addSource == "1") {
      this.teachingId = this.navParams.data.teachingId;
    }
  }

  ngOnInit() {
    this.isPoster = false;
    this.selecCourseId = [];
    this.selecProductId = [];
    this.isFirsrNull = true;
    this.album = [];
    this.PicList = [];
    this.rate = 0;
    // console.log('=====new=====this.PicList====' + this.PicList.length + '======')

    this.selecText = "";
    this.FirstPic = "";

    // this.goToNextCategory()
    this.ProductName = "";
    this.StepsList = [
      {
        title: "",
        picList: [
          // 'https://img.huizhanren.cn/upload/image/20171228/1AC63030-9B3D-4720-A2FC-4F69C43C0965.png',
          // 'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/bd600dbf-bb70-441e-8b12-3a4e1f584659.jpg',
          // 'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/f2169cd7-c311-47ea-83f9-9032d938d1f0.jpg',
          // 'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/4350ed29-c706-47f2-82aa-d45d4f6d8f5a.jpg',
          // 'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/e81cd536-86be-478f-9e43-dbfd2d1a0d65.jpg',
          // 'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/ef14ad51-9d8f-4ee1-885c-75f96a1722bf.jpg',
          //      'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/ebfd9d8b-aa30-4484-88ee-e43f260514f0.jpg'
        ],
        desc: "",
        video: [
          // { 'url': 'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/1557737410811-0.419-video.mp4', 'img':'https://1047.cdn-vod.huaweicloud.com/asset/88bb645d3432f94af14c99660a9c2637/cover/Cover0.jpg'},
          // { 'url': 'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/1557737410811-0.419-video.mp4', 'img': 'https://1047.cdn-vod.huaweicloud.com/asset/88bb645d3432f94af14c99660a9c2637/cover/Cover0.jpg' },
          // { 'url': 'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/1557737410811-0.419-video.mp4', 'img': 'https://1047.cdn-vod.huaweicloud.com/asset/88bb645d3432f94af14c99660a9c2637/cover/Cover0.jpg' }
        ]
      }
    ];
  }
  ionViewWillEnter() {
    this.queryIsLogin();
    this.goToNextCategory();
    this.getProductsList();
    this.getCourseList();
    this.queryIsStore();
  }

  // 判断用户是否登录
  queryIsLogin() {
    Promise.all([
      this.storage.get("VisitorRecordId")
      // this.storage.get('ExhibitionId')
    ]).then(
      ([VisitorRecordId]) => {
        if (null == VisitorRecordId) {
          this.modalController.dismiss({
            // 'result': value
            // 'testhaha': 'hahahhaha2222'
          });
          this.presentAlertTips();
          // this.presentToast('请先注册登录', 3000);
          //  跳登录注册
          // this.router.navigateByUrl('/login-by-phone');
        } else {
        }
      },
      function(error) {
        // do something when failure
      }
    );
  }

  async presentAlertTips() {
    const alert = await this.alertController.create({
      header: "",
      subHeader: "",
      message: "请先注册登录",
      buttons: [
        {
          text: "取消",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {}
        },
        {
          text: "去登录",
          role: "Ok",
          cssClass: "secondary",
          handler: blah => {
            this.router.navigateByUrl("/login-by-phone");
          }
        }
      ]
    });
    await alert.present();
  }

  // 上传封面弹窗
  async presentActionSheet(type, index) {
    const actionSheet = await this.actionSheetController.create({
      header: "上传图片",
      buttons: [
        {
          text: "拍照",
          icon: "camera",
          handler: () => {
            let sourceType = this.camera.PictureSourceType.CAMERA;
            if (type == 1) {
              // 教程封面
              this.uploadForFirstImg(sourceType);
            } else if (type == 3) {
              // 步骤的视频封面
              this.uploadForVideoPoster(sourceType, index);
            } else {
              // 步骤的图片
              this.fileChange3(sourceType, index);
            }
          }
        },
        {
          text: "相册",
          icon: "image",
          handler: () => {
            let sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
            if (type == 1) {
              // 教程封面
              this.uploadForFirstImg(sourceType);
            } else if (type == 3) {
              // 步骤的视频封面
              if (this.videoPoster != "") {
                this.isPoster = true;
              }
              //  this.uploadForVideoPoster(sourceType, index)
              this.videoPoster =
                "https://meishang-mobile-bucket.obs.cn-east-2.myhuaweicloud.com/1635cdc7-be1e-4962-b4e1-8bc62256232ce";
              this.StepsList[index].video[0].img =
                "https://meishang-mobile-bucket.obs.cn-east-2.myhuaweicloud.com/1635cdc7-be1e-4962-b4e1-8bc62256232ce";
            } else {
              // 步骤的图片
              this.fileChange3(sourceType, index);
            }
          }
        },
        {
          text: "取消",
          icon: "close",
          role: "cancel",
          handler: () => {}
        }
      ]
    });
    await actionSheet.present();
  }

  // 确认弹框
  async presentAlertMultipleButtons() {
    const alert = await this.alertController.create({
      header: "Alert",
      subHeader: "Subtitle",
      message: "This is an alert message.",
      buttons: ["Cancel", "Open Modal", "Delete"]
    });
    await alert.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: "",
      subHeader: "",
      message: "确定要离开吗",
      buttons: [
        {
          text: "取消",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {}
        },
        {
          text: "确定",
          role: "Ok",
          cssClass: "secondary",
          handler: blah => {
            if (this.subscription) {
              var test = document.getElementById("feature") as HTMLInputElement;
              test.value = "";
              this.subscription.unsubscribe();
              // this.isUplodaing = false
            }
            this.modalController.dismiss({
              // 'result': value
              // 'testhaha': 'hahahhaha2222'
            });
            // if (this.addSource == '0') {
            // } else {
            //   this.router.navigateByUrl('/lessons-details/' + this.teachingId);
            // }
          }
        }
      ]
    });
    await alert.present();
  }

  // 返回上一页
  canGoBack() {
    this.presentAlert();
    // this.modalController.dismiss({
    //   // 'result': value
    //   // 'testhaha': 'hahahhaha2222'
    // })
  }

  // 新增步骤
  goToAddSteps() {
    let size = this.StepsList.length + 1;
    let arr_step = {
      title: "",
      picList: [
        // 'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/6ea10864-3f35-44ab-b333-8e313061b1ba.png'
      ],
      desc: "",
      video: []
    };
    this.StepsList.push(arr_step);
  }

  // 删除步骤
  deleteSteps(index) {
    this.StepsList.splice(index, 1);
  }

  // 删除图片
  goToDeleteImg(i, k) {
    this.StepsList[i].picList.splice(k, 1);
  }

  // 删除视频
  goToDeleteVideo(i, k) {
    this.StepsList[i].video.splice(k, 1);
    this.videoPoster = "";
  }

  goToAddPicture() {}

  // 设置封面
  goToSetFirst(i, k) {
    // this.FirstPic = this.StepsList[i].picList[0]
    // PicList[0].PicPath=
    this.FirstPic = this.StepsList[i].picList[k];
    let a = {
      PicPath: this.StepsList[i].picList[k]
    };
    this.PicList[0] = a;
    this.presentToast("设置成功", 3000);
  }

  // 草稿箱
  goToSave() {
    Promise.all([
      this.storage.get("TenantId"),
      this.storage.get("UserId"),
      this.storage.get("ExhibitionId"),
      this.storage.get("VisitorRecordId"),
      this.storage.get("VisitorExhibitionInfoId")
    ]).then(
      ([
        tenantId,
        userId,
        exhibitionId,
        VisitorRecordId,
        VisitorExhibitionInfoId
      ]) => {
        // 判断教程封面 赋值默认值
        // if (this.PicList.length == 0) {
        //   this.presentToast('请先上传教程封面', 3000)
        // }
        let teachingData = {
          userId: userId,
          tenantId: tenantId,
          params: {
            record: {
              UserId: userId,
              TenantId: tenantId,
              ProductNumber: "12345677",
              ExhibitionId: exhibitionId,
              ExhibitorId: "",
              ProId: "323232",
              SourceType: "商城",
              ProductType: "教程",
              StepsAlbum: this.album,
              connectCourses: this.selecCourseId,
              connectProducts: this.selecProductId,
              ProductVisitorId: VisitorRecordId,
              CategoryFirstId: this.selecText,
              CategorySecondId: "",
              IsShow: false,
              VisitorExhibitionInfoId: VisitorExhibitionInfoId,
              PicList: this.PicList,
              CourseList: this.StepsList,
              IsRelease: false,
              AuthorId: VisitorRecordId,
              ProductName: this.ProductName,
              CourseTitle: "秒杀全场只需一秒",
              ProductDescription:
                "观众数据集中管理平台，将全部观众的基础、需求、行为、社交等信息进行集中归类管理，提供营销方案集成。",
              InTime: "2019-04-10T22:12:26.463"
            }
          }
        };
        // if (this.PicList.length == 0) {
        //   this.presentToast('请先上传教程封面', 3000)
        // } else if (this.ProductName == '') {
        //   this.presentToast('请填写教程名称', 3000)
        // } else if (this.selecText == '') {
        //   this.presentToast('请先选择分类', 3000)
        // } else {
        this.presentLoading2("正在保存...");
        this.http
          .post(AppComponent.apiUrl + "v2/data/insert/Product", teachingData)
          .subscribe(res => {
            if ((res as any).resCode == 0) {
              let result_info = (res as any).result;
              this.presentToast("已成功加入草稿箱", 2000);
              this.modalController.dismiss({});
              // if (this.addSource == '0') {
              //   this.router.navigateByUrl('');
              // } else {
              //   this.router.navigateByUrl('/lessons-details/' + this.teachingId);
              // }
              // 循环update被选中的product
            }
          });
        // }
      }
    );
  }

  setTest() {
    this.FirstPic =
      "https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/141be1ba-a4a9-4058-9036-e1338c0f413b.png";
    if (this.FirstPic != "") {
      this.isFirsrNull = false;
    }
    // }else{
    //     this.isFirsrNull = true
    // }
  }

  // 新增教程
  goToAddTeaching() {
    // let arr = []
    // this.selecProductId.forEach(element => {
    //   arr.push(element)
    // });
    // this.selecCourseId.forEach(element => {
    //   arr.push(element)
    // });
    Promise.all([
      this.storage.get("TenantId"),
      this.storage.get("UserId"),
      this.storage.get("ExhibitionId"),
      this.storage.get("VisitorRecordId"),
      this.storage.get("VisitorExhibitionInfoId"),
      this.storage.get("token")
    ]).then(
      ([
        tenantId,
        userId,
        exhibitionId,
        VisitorRecordId,
        VisitorExhibitionInfoId,
        token
      ]) => {
        // 判断教程封面 赋值默认值
        // if (this.PicList.length == 0) {
        //   console.log('=====教程封面kong==============')
        //   this.presentToast('请先上传教程封面',3000)
        //   // let aa = {
        //   //   PicPath: 'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/141be1ba-a4a9-4058-9036-e1338c0f413b.png'
        //   // }
        //   // this.PicList.push(aa)
        //   // // console.log(JSON.stringify(this.PicList))
        // }
        // console.log(JSON.stringify(this.PicList))
        let teachingData = {
          userId: userId,
          tenantId: tenantId,
          params: {
            record: {
              UserId: userId,
              TenantId: tenantId,
              ProductNumber: "12345677",
              ExhibitionId: exhibitionId,
              ExhibitorId: "",
              ProId: "323232",
              SourceType: "商城",
              StepsAlbum: this.album,
              ProductType: "教程",
              connectCourses: this.selecCourseId,
              connectProducts: this.selecProductId,
              ProductVisitorId: VisitorRecordId,
              CategoryFirstId: this.selecText,
              CategorySecondId: "",
              VisitorExhibitionInfoId: VisitorExhibitionInfoId,
              PicList: this.PicList,
              CourseList: this.StepsList,
              IsRelease: true,
              IsShow: false,
              AuthorId: VisitorRecordId,
              ProductName: this.ProductName,
              CourseTitle: "秒杀全场只需一秒",
              ProductDescription:
                "观众数据集中管理平台，将全部观众的基础、需求、行为、社交等信息进行集中归类管理，提供营销方案集成。",
              InTime: "2019-04-10T22:12:26.463"
            }
          }
        };
        if (this.PicList.length == 0) {
          this.presentToast("请先上传教程封面", 3000);
          // let aa = {
          //   PicPath: 'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/141be1ba-a4a9-4058-9036-e1338c0f413b.png'
          // }
          // this.PicList.push(aa)
          // // console.log(JSON.stringify(this.PicList))
        } else if (this.ProductName == "") {
          this.presentToast("请填写教程名称", 3000);
        } else if (this.selecText == "") {
          this.presentToast("请先选择分类", 3000);
        } else {
          if (this.StepsList.length > 0) {
            for (let index = 0; index < this.StepsList.length; index++) {
              const element = this.StepsList[index];
              if (element.title == "") {
                this.presentToast("请完善步骤" + (index+1) + "的信息", 3000);
                return;
              }
            }
          }

          this.presentLoading2("正在发布...");
          this.http
            .post(AppComponent.apiUrl + "v2/data/insert/Product", teachingData)
            .subscribe(res => {
              if ((res as any).resCode == 0) {
                let result_info = (res as any).result;
                //关联产品
                let goodsIdList = [];
                if (this.selecProductId.length > 0) {
                  this.selecProductId.forEach(element => {
                    let info = {
                      CourseId: "",
                      ExhibitionId: exhibitionId,
                      ProductId: element,
                      LessonId: result_info.RecordId,
                      VisitorExhibitionInfoId: VisitorExhibitionInfoId
                    };
                    goodsIdList.push(info);
                  });
                  let connGoods = {
                    tenantId: tenantId,
                    userId: userId,
                    params: {
                      records: goodsIdList
                    }
                  };
                  this.http
                    .post(
                      AppComponent.apiUrl +
                        "v2/data/insertList/LessonCourseProduct",
                      connGoods,
                      { headers: { Authorization: "Bearer " + token } }
                    )
                    .subscribe(res => {
                      if ((res as any).resCode == 0) {
                        let result_info = res as any;
                      }
                    });
                }
                // 关联课程
                let courseIdList = [];
                if (this.selecCourseId.length > 0) {
                  this.selecCourseId.forEach(element => {
                    let info = {
                      ProductId: "",
                      ExhibitionId: exhibitionId,
                      CourseId: element,
                      LessonId: result_info.RecordId,
                      VisitorExhibitionInfoId: VisitorExhibitionInfoId
                    };
                    courseIdList.push(info);
                  });
                  let connCourse = {
                    tenantId: tenantId,
                    userId: userId,
                    params: {
                      records: courseIdList
                    }
                  };
                  this.http
                    .post(
                      AppComponent.apiUrl +
                        "v2/data/insertList/LessonCourseProduct",
                      connCourse,
                      { headers: { Authorization: "Bearer " + token } }
                    )
                    .subscribe(res => {
                      if ((res as any).resCode == 0) {
                        let result_info = res as any;
                      }
                    });
                }
              }
            });
        }
      }
    );
  }

  async presentToast(msg, time) {
    const toast = await this.toastController.create({
      message: msg,
      duration: time,
      cssClass: "toast-wrapper",
      position: "middle"
    });
    toast.present();
  }

  goToNextCategory() {
    Promise.all([
      this.storage.get("TenantId"),
      this.storage.get("UserId"),
      this.storage.get("ExhibitionId")
    ]).then(([tenantId, userId, exhibitionId]) => {
      let teachingData = {
        UserId: userId,
        TenantId: tenantId,
        params: {
          record: {
            ExhibitionId: exhibitionId
          }
        }
      };
      this.http
        .post(
          AppComponent.apiUrl + "v2/data/queryList/CategoryFirst",
          teachingData
        )
        .subscribe(res => {
          this.CategoriesFirstList = (res as any).result;
        });
    });
  }

  haha(e) {}

  go() {}

  haha1() {}

  // 上传图片视频
  fileChange3(Type, index) {
    const that = this;
    const options: CameraOptions = {
      quality: 80,
      sourceType: Type,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    that.presentLoading("图片上传中...");
    that.camera.getPicture(options).then(
      file => {
        try {
          const base64Image = "data:image/jpeg;base64," + file;
          that.esdkObsService.uploadImage(base64Image).subscribe(
            location => {
              that.StepsList[index].picList.push(location);
              that.presentToast("上传成功", 1500);
              that.loadingController.dismiss({});
            },
            e => {
              that.loadingController.dismiss({});
            }
          );
        } catch (error) {
          that.loadingController.dismiss({});
        }
      },
      err => {
        that.loadingController.dismiss({});
      }
    );
  }

  // 上传教程封面
  uploadForFirstImg(Type) {
    const that = this;
    // 重点说一下 sourceType，这个参数设置为 PHOTOLIBRARY 就会从相册取图，设置为 CAMERA 会拍照，设置为 SAVEDPHOTOALBUM 会保存图片。
    // mediaType        PICTURE、VIDEO、ALLMEDIA
    const options: CameraOptions = {
      quality: 80,
      sourceType: Type,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    that.presentLoading("图片上传中...");
    that.camera.getPicture(options).then(
      file => {
        try {
          const base64Image = "data:image/jpeg;base64," + file;
          that.esdkObsService.uploadImage(base64Image).subscribe(
            location => {
              that.FirstPic = location;
              that.isFirsrNull = false;
              let a = {
                PicPath: location
              };
              that.PicList[0] = a;
              that.presentToast("上传成功", 1500);
              that.loadingController.dismiss({});
            },
            e => {
              that.loadingController.dismiss({});
            }
          );
        } catch (error) {
          that.loadingController.dismiss({});
        }
      },
      err => {
        that.loadingController.dismiss({});
      }
    );
  }

  // 上传视频封面
  uploadForVideoPoster(Type, index) {
    const that = this;
    // 重点说一下 sourceType，这个参数设置为 PHOTOLIBRARY 就会从相册取图，设置为 CAMERA 会拍照，设置为 SAVEDPHOTOALBUM 会保存图片。
    // mediaType        PICTURE、VIDEO、ALLMEDIA
    const options: CameraOptions = {
      quality: 80,
      sourceType: Type,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    that.presentLoading("图片上传中...");
    that.camera.getPicture(options).then(
      file => {
        try {
          const base64Image = "data:image/jpeg;base64," + file;
          that.esdkObsService.uploadImage(base64Image).subscribe(
            location => {
              if (typeof location === "string") {
                that.videoPoster = location;
                if (that.videoPoster != "") {
                  that.isPoster = true;
                }
                that.StepsList[index].video[0].img = location;
                that.presentToast("上传成功", 1500);
                that.loadingController.dismiss({});
              }
            },
            e => {
              that.loadingController.dismiss({});
            }
          );
        } catch (error) {
          that.loadingController.dismiss({});
        }
      },
      err => {
        that.loadingController.dismiss({});
      }
    );
  }

  test() {
    let arr = "hhahahah1";
    this.StepsList[0].picList.push("hahaha1");
  }

  // 上传视频
  fileChange(e, i) {
    const that = this;
    that.progressIndex = i;
    const file = e.srcElement.files[0];
    this.videos = window.URL.createObjectURL(file);
    // if (file.size <= 10 * 1024 * 1024) {
    //   that.presentLoading('视频上传中...');
    // }
    this.rate = 0;
    that.subscription = that.esdkObsService.uploadFile(file).subscribe(
      location => {
        if (typeof location === "string") {
          this.isUplodaing = false;
          that.presentToast("上传成功", 1500);
          that.loadingController.dismiss({});
          let videoPer = {
            url: location,
            img: that.videoPoster
          };
          that.StepsList[i].video[0] = videoPer;
          e.target.value = "";
        } else {
          this.isUplodaing = true;
          if (location < this.rate) {
            return;
          }
          this.rate = location;
          let locations = this.rate / 100;
          that.progress1 = parseInt(this.rate + "");
          let progressStr = locations + "";
          that.progress = progressStr.substring(0, 4);
        }
      },
      err => {
        that.loadingController.dismiss({});
      }
    );
  }

  // 查询课程
  getCourseList() {
    Promise.all([
      this.storage.get("TenantId"),
      this.storage.get("UserId"),
      this.storage.get("ExhibitionId"),
      this.storage.get("VisitorRecordId"),
      this.storage.get("ExhibitorId")
    ]).then(
      ([tenantId, userId, exhibitionId, VisitorRecordId, ExhibitorId]) => {
        let courseData = {
          UserId: userId,
          TenantId: tenantId,
          params: {
            condition: {
              ExhibitionId: exhibitionId,
              SourceType: "商城",
              ProductType: "课程",
              IsShow: true,
              IsCourseApprove: "1",
              ExhibitorId: ExhibitorId
            },
            properties: ["ProductId.Product.___all"]
            // options: {
            //   pageIndex: 1,
            //   pageSize: 12
            // }
          }
        };
        this.http
          .post(AppComponent.apiUrl + "v2/data/queryList/Product", courseData)
          .subscribe(res => {
            if ((res as any).resCode == 0) {
              this.ChooseCourseList = (res as any).result;
              // this.isCourseNull = false
            } else {
              // this.isCourseNull = true
            }
          });
      }
    );
  }
  // 查询商品
  getProductsList() {
    Promise.all([
      this.storage.get("TenantId"),
      this.storage.get("UserId"),
      this.storage.get("ExhibitionId"),
      this.storage.get("VisitorRecordId"),
      this.storage.get("ExhibitorId")
    ]).then(
      ([tenantId, userId, exhibitionId, VisitorRecordId, ExhibitorId]) => {
        let courseData = {
          UserId: userId,
          TenantId: tenantId,
          params: {
            condition: {
              ExhibitionId: exhibitionId,
              SourceType: "商城",
              ProductType: "商品",
              IsRecycled: false,
              IsShow: true,
              ExhibitorId: ExhibitorId
            },
            properties: ["ProductId.Product.___all"]
            // options: {
            //   pageIndex: 1,
            //   pageSize: 10
            // }
          }
        };
        this.http
          .post(AppComponent.apiUrl + "v2/data/queryList/Product", courseData)
          .subscribe(res => {
            if ((res as any).resCode == 0) {
              this.chooseProductList = (res as any).result;
            } else {
            }
          });
      }
    );
  }

  // 查询用户是否是商家
  queryIsStore() {
    Promise.all([
      this.storage.get("TenantId"),
      this.storage.get("ExhibitionId"),
      this.storage.get("UserId"),
      this.storage.get("Phone")
    ]).then(([tenantId, exhibitionId, UserId, Phone]) => {
      // 查询手机号是否已注册
      // let Phone='13612207521'
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
      this.http
        .post(
          AppComponent.apiUrl + "v2/data/queryList/ExhibitorExhibitionInfo",
          queryIsSign
        )
        .subscribe(res => {
          if ((res as any).resCode == 0) {
            // 已注册 弹出提示
            this.isStore = true;
            let storeId = (res as any).result[0].ExhibitorId;
            this.storage.set("ExhibitorId", storeId);
          } else {
            this.isStore = false;
          }
        });
    });
  }

  async presentLoading(msg) {
    const loading = await this.loadingController.create({
      message: msg
      // duration: 1500
    });
    await loading.present();
    // const { role, data } = await loading.onDidDismiss();
    loading.onDidDismiss().then(
      () => {
        // this.presentToast('上传成功', 1500)
      },
      () => {}
    );
  }

  async presentLoading2(msg) {
    const loading = await this.loadingController.create({
      message: msg,
      duration: 2500
    });
    await loading.present();
    loading.onDidDismiss().then(
      () => {
        this.presentToast("发布成功", 1500);
        this.modalController.dismiss({});
        this.router.navigateByUrl("/audit-my-teaching");
      },
      () => {}
    );
  }

  // 取消上传视频
  goToCancel() {
    var test = document.getElementById("feature") as HTMLInputElement;
    test.value = "";
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.isUplodaing = false;
    }
  }
}
