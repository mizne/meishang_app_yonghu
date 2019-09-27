import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { ToastController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { Wechat } from '@ionic-native/wechat/ngx';
import { ChangeTelPage } from '../change-tel/change-tel.page';
@Component({
  selector: 'app-login-by-password',
  templateUrl: './login-by-password.page.html',
  styleUrls: ['./login-by-password.page.scss'],
})
export class LoginByPasswordPage implements OnInit {

  constructor(public storage: Storage, public toastController: ToastController, public modalController: ModalController,
              public nav: NavController, public router: Router, private http: HttpClient,
              public loadingController: LoadingController, private loc: Location, private wechat: Wechat) { }

  public userName;
  public userPassword;
  public params;
  public isFrozen = false;
  public firstLogin = false;
  ngOnInit() {
    this.params = {};
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  // 弹框提示
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'middle',
      cssClass: 'toast-wrapper',
    });
    toast.present();
  }

  toChangeWay() {
    this.router.navigateByUrl('/login-by-phone');
  }

  changeInput() {
  }

  goToUserRules() {
    this.router.navigateByUrl('/user-rules');
  }

  // 登录
  goToLogin() {
    let testphone = this.userName;
    // var testpattern1 = (/^[1][3458][012356789][0-9]+$/).test(testphone);
    var testpattern1 = (/^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$/).test(testphone);

    if (testpattern1 == false) {
      this.presentToast('请输入正确的11位手机号');
    } else {
      // 调用登录接口
      let loginData = {
        params: {
          Type: '2',
          UserName: this.userName + '',
          UserPassword: this.userPassword
        }
      };
      this.presentLoading('登录中...');
      this.http.post(AppComponent.apiUrl + 'v2/data/VisitorLogin', loginData).subscribe(res => {
        let result = res as any;
        if (result.resCode == 0) {
          this.firstLogin = result.result[0].HasFirstLogin;
          this.loadingController.dismiss({
          });
          this.storage.set(
            'Phone',
            (result.result[0] as any).Phone + ''
          );
          this.storage.set(
            'token',
            (result.result[0] as any).token
          );
          this.storage.set(
            'Type',
            (result.result[0] as any).Type
          );

          this.storage.set('UserId', result.result[0].UserId);
          // VisitorRecordId
          this.storage.set(
            'VisitorRecordId',
            result.result[0].VisitorRecordId
          );

          Promise.all([
            this.storage.get('TenantId'),
            this.storage.get('UserId'),
            this.storage.get('ExhibitionId')
          ]).then(([tenantId, userId, ExhibitionId]) => {
            // 存 VisitorExhibitionInfoId
            let teachingData = {
              tenantId,
              userId: result.result[0].UserId,
              params: {
                condition: {
                  ExhibitionId,
                  VisitorId: result.result[0].VisitorRecordId,
                },
                // properties: ['VisitorId.Visitor.___all'],
                // options: { 'pageIndex': 1, 'pageSize': 10 }
              }
            };
            this.http
              .post(
                AppComponent.apiUrl + 'v2/data/queryList/VisitorExhibitionInfo',
                teachingData
              )
              .subscribe(res => {
                if ((res as any).resCode == 0) {
                  let visitorExInfo = (res as any).result[0];
                  this.isFrozen = visitorExInfo.HasFreeZe;
                  this.storage.set(
                    'VisitorExhibitionInfoId',
                    visitorExInfo.RecordId
                  );
                  this.storage.set(
                    'Logo',
                    visitorExInfo.Logo
                  );
                  this.storage.set(
                    'NickName',
                    visitorExInfo.NickName
                  );
                  if (this.firstLogin) {
                    this.presentToast('请完善用户信息');
                    this.router.navigateByUrl('/perfecting-user-infor');
                  } else {
                    if (this.isFrozen) {
                      this.presentToast('账户已被冻结，请联系管理员');
                    } else {
                      this.presentToast('登录成功');
                      this.router.navigateByUrl('/tabs/tabs/tab1');
                      this.updateBuyState();
                    }
                  }
                }
              });
          });
          // this.loadingController.dismiss({
          // });
        } else if (result.resCode == 1005) {
          this.loadingController.dismiss({
          });
          this.presentToast('请输入正确的账号密码');
        } else {
          this.loadingController.dismiss({
          });
          this.presentToast('请输入正确的账号密码');
        }
      });
    }
  }

  // 加载框
  async presentLoading(msg) {
    const loading = await this.loadingController.create({
      message: msg,
      duration: 1500
    });
    await loading.present();
    loading.onDidDismiss().then(() => {
    }, () => { });
  }

  // 模态框 绑定手机号
  async presentModal1(acess) {
    const modal = await this.modalController.create({
      component: ChangeTelPage,
      // cssClass: 'addMyCart',
      componentProps: {
        acess: acess
      }
    });

    modal.onDidDismiss().then(
      () => {
        // this.presentToast('绑定成功')
        // this.wechatLogin(acess);
      },
      () => {}
    );

    return await modal.present();
  }

  wechatLogin2() {
    var that = this;
    // 获取用户是否安装微信
    try {
      let scope = 'snsapi_userinfo',
        state = '_' + +new Date();
      that.wechat
        .isInstalled()
        .then(installed => {
          that.wechat
            .auth(scope, state)
            .then(response => {
              that.presentToast('授权登录中....');
              let res = response;
              // 在调用service的getAccessToken方法获取access_token，和acopenid，
              // 2. 后台获取token，openID, 获取用户信息并返回
              that.http
                .post(
                  AppComponent.apiUrl + 'v2/data/wxGetUserInfoByLoginForMeishang',
                  { code: res.code }
                )
                .subscribe((res1: any) => {
                  if (res1.resCode == 0) {
                    // 用户输入手机号查询是否注册
                    // 注册 调用登陆
                    // 未注册 调用注册
                    let openid = res1.result.openid;
                    let unionid = res1.result.unionid;
                    Promise.all([
                      that.storage.get('TenantId'),
                      that.storage.get('UserId'),
                      that.storage.get('ExhibitionId')
                    ]).then(([tenantId, userId, exhibitionId]) => {
                      let queryIsSign = {
                        tenantId,
                        userId,
                        params: {
                          condition: {
                            ExhibitionId: exhibitionId,
                            OpenId: openid,
                            Unicode: unionid
                          }
                        }
                      };
                      // 查询用户表
                      that.http.post(AppComponent.apiUrl + 'v2/data/queryList/VisitorExhibitionInfo', queryIsSign)
                        .subscribe(res => {
                          if ((res as any).resCode == 0) {
                            // 微信直接登录注册过
                            let userInfo = (res as any).result[0];
                            this.isFrozen = userInfo.HasFreeZe;
                            // 存缓存
                            that.storage.set('VisitorExhibitionInfoId', userInfo.RecordId);
                            that.storage.set('Phone', userInfo.Mob);
                            that.storage.set('VisitorRecordId', userInfo.VisitorId);
                            that.storage.set('NickName', userInfo.NickName);
                            that.storage.set('Logo', userInfo.Logo);
                            // 登录接口
                            let loginData = {
                              params: {
                                Type: '2',
                                Phone: userInfo.Mob,
                                LoginType: '手机号码登录'
                              }
                            };
                            that.presentLoading('登录中...');
                            that.http.post(AppComponent.apiUrl + 'v2/data/Login', loginData)
                              .subscribe(res => {
                                let result2 = res as any;
                                if (result2.resCode == 0) {
                                  let resultInfo = result2.result;
                                  resultInfo.forEach(element => {
                                    if (element.Type == '2') {
                                      that.storage.set('Type', '2');
                                      that.storage.set('token', element.token);
                                    }
                                  });
                                  that.loadingController.dismiss({});
                                  if (this.isFrozen) {
                                    that.presentToast('账户已被冻结，请联系管理员');
                                  } else {
                                    that.presentToast('登录成功');
                                    that.router.navigateByUrl('/tabs/tabs/tab1');
                                    that.updateBuyState();
                                  }
                                } else {
                                  that.loadingController.dismiss({});
                                  that.presentToast('授权登录失败');
                                }
                              });
                          } else {
                            // 微信没有登录过，登陆成功后绑定手机号
                            that.presentModal1(res1.result);
                          }
                        });
                    });
                  }
                }, error => {
                });
            })
            .catch(reason => {
              console.log('微信授权失败');
            });
        })
        .catch(reason => {
          console.log('没有发现微信客户端');
        });
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  updateBuyState() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, VisitorRecordId]) => {
      const courseData = {
        UserId: userId,
        TenantId: tenantId,
        params: {
          condition: {
            ExhibitionId: exhibitionId,
            VisitorRecordId
          }
        }
      };
      this.http
        .post(AppComponent.apiUrl + 'v2/data/custom/ShareCompleted', courseData)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
          }
        });
    });
  }
}
