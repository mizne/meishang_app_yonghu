import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { TabService } from '../tab.service';
import { AppComponent } from '../app.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AppUpdate } from '@ionic-native/app-update/ngx';
import { Platform } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import * as parser from 'fast-xml-parser';
declare var cordova;
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  public actPage;
  constructor(
    public alertController: AlertController,
    // private wechat: Wechat,
    public toastController: ToastController,
    public router: Router,
    private http: HttpClient,
    public storage: Storage,
    public nav: NavController,
    private tabService: TabService,
    public iab: InAppBrowser,
    private appUpdate: AppUpdate,
    private platform: Platform,
    // private splashScreen: SplashScreen
    private appVersion: AppVersion
  ) { }

  ionViewDidEnter() {
    let aa = this.router.url;
    let arr = aa.split('/');
    if (arr[2] == 'tab1') {
      // 首页教程
      this.tabService.emitTabEnter(1);
    } else if (arr[2] == 'tab2') {
      // 课程
      this.tabService.emitTabEnter(2);
    } else if (arr[2] == 'tab3') {
      // 商城
      this.tabService.emitTabEnter(3);
    } else if (arr[2] == 'my-collection') {
      // 我的
      this.tabService.emitTabEnter(4);
    } else {
      this.tabService.emitTabEnter(1);
    }
  }

  change(event) {
    console.log(event.detail.tab);
    this.actPage = event.detail.tab;
  }

  ionViewWillEnter() {
    this.quertIsLogin();
    this.getInofomation();
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
  }

  quertIsLogin() {
    Promise.all([
      this.storage.get('VisitorRecordId'),
      this.storage.get('sex')
    ]).then(([VisitorRecordId, sex]) => {
      // 未登录
      if (null == VisitorRecordId || undefined == VisitorRecordId) {
        this.presentAlert();
      } else if (null == sex || undefined == sex) {
        // this.presentAlert1()
      }
      if (VisitorRecordId) {
        // const browser = this.iab.create('http://www.meishangyunxun.com/app/msuser.apk', '_system');
        // const browser = this.iab.create('https://itunes.apple.com/cn/app/id1470917735?mt=8', '_system');
        // browser.show();
        const isAndroid = this.platform.is('android');
        const isIOS = this.platform.is('ios');
        if (isAndroid) {
          const updateUrl = 'http://www.meishangyunxun.com/app/update.xml';
          this.appUpdate.checkAppUpdate(updateUrl).then(() => {
          });
        }
        if (isIOS) {
          cordova.getAppVersion.getVersionNumber().then((version) => {
            this.http.get('http://www.meishangyunxun.com/app/update.xml',
              { headers: new HttpHeaders({ Accept: 'text/html,application/xhtml+xml,application/xml' }),
                responseType: 'text'
              }).subscribe(text => {
                if (parser.validate(text) === true) {
                  const jsonObj = parser.parse(text);
                  const stringVer = version;
                  const test = stringVer.replace('.', '0');
                  const test1 = test.replace('.', '0');
                  const test2 = parseInt(test1, 10);
                  if (test2 < jsonObj.update.version) {
                    this.presentAlertIOSUpdate();
                  }
                }
              });
          });
        }
      }
    });
  }

  async presentAlert1() {
    const alertTest1 = await this.alertController.create({
      header: '',
      subHeader: '',
      message: '快去完善你的信息吧',
      buttons: [{
        text: '取消',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
        }
      }, {
        text: '去完善',
        role: 'Ok',
        cssClass: 'secondary',
        handler: (blah) => {
          this.router.navigateByUrl('/personal-data');
        }
      }],
    });
    await alertTest1.present();
  }

  async presentAlert() {
    const alertTest2 = await this.alertController.create({
      header: '',
      subHeader: '',
      message: '请先注册登录',
      buttons: [{
        text: '取消',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          this.getInofomation();
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
    await alertTest2.present();
  }

  async presentAlertIOSUpdate() {
    const alertTest3 = await this.alertController.create({
      header: '',
      subHeader: '',
      message: '美尚荟有更新啦！是否更新？',
      buttons: [{
        text: '取消',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          this.getInofomation();
        }
      }, {
        text: '更新',
        role: 'Ok',
        cssClass: 'secondary',
        handler: (blah) => {
          const browser = this.iab.create('https://itunes.apple.com/cn/app/id1470917735?mt=8', '_system');
          browser.show();
        }
      }],
    });
    await alertTest3.present();
  }

  // 获取展会信息 存缓存
  getInofomation() {
    // 查询展会
    // 缓存如果有就不做操作，没有的话就查询存缓存
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, exhibitionId]) => {
      if (null == tenantId || null == exhibitionId) {
        let exData = {
          params: {
            condition: {
              ExName: '美尚云讯'
            }
          }
        };
        this.http
          .post(AppComponent.apiUrl + 'v2/data/queryList/Exhibition', exData)
          .subscribe(res => {
            // debugger
            if ((res as any).resCode == 0) {
              let resultInfo = (res as any).result;
              this.storage.set('TenantId', resultInfo[0].TenantId);
              this.storage.set('ExhibitionId', resultInfo[0].RecordId);
              this.storage.set('UserIdOfEx', resultInfo[0].UserId);
            }
          });
      }
    });
  }
}
