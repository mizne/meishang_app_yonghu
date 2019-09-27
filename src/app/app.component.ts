
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { ToastController } from '@ionic/angular';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { Subscription } from 'rxjs';

import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

import { Deeplinks } from '@ionic-native/deeplinks/ngx';

import { CourseDetailsPage } from './course-details/course-details.page';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  // 封装获取图片尺寸的方法
  public static imgReady = (function () {
    var list = [], intervalId = null,
      // 用来执行队列
      tick = function () {
        var i = 0;
        for (; i < list.length; i++) {
          list[i].end ? list.splice(i--, 1) : list[i]();
        };
        !list.length && stop();
      },
      // 停止所有定时器队列
      stop = function () {
        clearInterval(intervalId);
        intervalId = null;
      };
    return function (url, load, error) {
      var onready, width, height, newWidth, newHeight,
        img = new Image();
      img.src = url;
      // 如果图片被缓存，则直接返回缓存数据
      // if (img.complete) {
      //   ready.call(img);
      //   load && load.call(img);
      //   return;
      // };
      width = img.width;
      height = img.height;
      // 加载错误后的事件
      img.onerror = function () {
        error && error.call(img);
        onready.end = true;
        img = img.onload = img.onerror = null;
      };
      // 图片尺寸就绪
      onready = function () {
        newWidth = img.width;
        newHeight = img.height;
        if (newWidth !== width || newHeight !== height || newWidth * newHeight > 1024) {
          // 如果图片已经在其他地方加载可使用面积检测
          // ready.call(img);
          onready.end = true;
        };
      };
      onready();
      // 完全加载完毕的事件
      img.onload = function () {
        // onload在定时器时间差范围内可能比onready快
        // 这里进行检查并保证onready优先执行
        !onready.end && onready();
        load && load.call(img);
        // IE gif动画会循环执行onload，置空onload即可
        img = img.onload = img.onerror = null;
      };
      // 加入队列中定期执行
      if (!onready.end) {
        list.push(onready);
        // 无论何时只允许出现一个定时器，减少浏览器性能损耗
        if (intervalId === null) intervalId = setInterval(tick, 40);
      }
    };
  })();
  public static apiUrl: string = 'http://meishangapi.xiaovbao.cn/'; // 设置全局接口 用于调试
  // public static apiUrl: string = 'https://apiali.xiaovbao.cn/'; // 设置全局接口 用于调试
  public url;
  public url1;
  sideMenuDisabled = true;
  backButtonPressed: boolean = false; // 用于判断返回键是否触发
  customBackActionSubscription: Subscription;
  constructor(
    public toastController: ToastController,
    public navController: NavController, // 导航控制器
    public router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private appMinimize: AppMinimize,
    public storage: Storage,
    public http: HttpClient,
    private loc: Location,
    private deeplinks: Deeplinks
  ) {
    this.initRouterListen();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.initRouterListen();
      // this.statusBar.styleDefault(); // 管理本机状态栏的外观,styleDefault使用默认状态栏（深色文本，浅色背景）。
      // this.splashScreen.hide(); // 显示和隐藏启动画面。
      // 延时隐藏动画
      window.setTimeout(() => {
        this.splashScreen.hide(); // 显示和隐藏启动画面。
      }, 3000);
      this.queryAdPicture();
      // this.registerBackButtonAction();//注册返回按键事件
      // this.platform.resume.subscribe();//弹出框
      this.deeplinks.route({
        '/course-details': CourseDetailsPage,
      }).subscribe(match => {
        this.router.navigateByUrl(match.$link.host + '/' + match.$args.id);
      }, nomatch => {
      });
    });
    this.customBackActionSubscription = this.platform.backButton.subscribe(() => {
      if (this.router.url == '/tabs/tabs/tab1') {
        if (this.backButtonPressed) {
          // alert()
          this.appMinimize.minimize();
          this.backButtonPressed = false;
        } else {
          this.presentToast();
          this.backButtonPressed = true;
          setTimeout(() => this.backButtonPressed = false, 2000);
        }
      } else if (this.router.url == '/tabs/tabs/tab2' ||
                  this.router.url == '/tabs/tabs/tab3' ||
                  this.router.url == '/tabs/tabs/my-collection' ) {
        this.router.navigateByUrl('/tabs/tabs/tab1');
      } else {
        // this.navController.back();
        this.loc.back();
        if (this.backButtonPressed) {
        } else {
        }
      }
    // if (this.backButtonPressed) {
    //   this.appMinimize.minimize();
    //   this.backButtonPressed = false;
    // } else {
    //   this.presentToast()
    //   this.backButtonPressed = true;
    //   setTimeout(() => this.backButtonPressed = false, 2000);
    // }
    });
  }

  registerBackButtonAction() {
    // this.customBackActionSubscription = this.platform.backButton.subscribe(() => {
    if (this.url === '/tabs/tabs/tab1' || this.url === '/tabs/tabs/tab2' || this.url === '/tabs/tabs/tab3') {
      if (this.backButtonPressed) {
        this.appMinimize.minimize();
        console.log('最小化');
        this.backButtonPressed = false;
      } else {
      this.presentToast();
        this.backButtonPressed = true;
        setTimeout(() => this.backButtonPressed = false, 2000);
      }
    } else {
      if (this.backButtonPressed) {
        // this.navController.back();
        this.loc.back();
        // this.appMinimize.minimize();
        // this.backButtonPressed = false;
      } else {
      //  this.presentToast()
      //  this.backButtonPressed = true;
      //  setTimeout(() => this.backButtonPressed = false, 2000);
      }
    }
  // })
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: '再点一次返回即可退出应用',
      duration: 2000,
      color: 'dark',
      cssClass: 'toast-wrapper',
      position: 'bottom'
    });
    toast.present();
  }

  initRouterListen() {
    this.router.events.subscribe(event => { // 需要放到最后一个执行
      if (event instanceof NavigationEnd) {
        this.url = event.url;
      }
    });
  }

  queryAdPicture() {
    const courseData = {
      userId: null,
      tenantId: 'sys',
      params: {
        condition: {
          ExhibitionId: '5d134a9888df65ca9a700569',
          Type: '4'
        }
      }
    };
    this.http.post(AppComponent.apiUrl + 'v2/data/queryList/ExhibitionBanner', courseData)
      .subscribe(res => {
        if ((res as any).resCode === 0) {
          this.storage.set('backGroundPic', (res as any).result[0].Name);
        }
      });
  }
}
