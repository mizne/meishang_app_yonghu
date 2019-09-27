import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { ToastController, LoadingController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-change-tel',
  templateUrl: './change-tel.page.html',
  styleUrls: ['./change-tel.page.scss']
})
export class ChangeTelPage implements OnInit {
  public userPhone;
  public getUserCodePhone;
  public getCode;
  public Code;
  public acess;
  // @Input() value:;
  constructor(
    private http: HttpClient,
    public router: Router,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public storage: Storage,
    public navParams: NavParams,
    public nav: NavController,
    public modalController: ModalController
  ) {
    this.acess = this.navParams.data.acess;
  }

  ngOnInit() {
    this.Code = '';
  }
  // 验证码倒计时
  verifyCode: any = {
    verifyCodeTips: '获取验证码',
    countdown: 60,
    disable: false
  };
  // 倒计时
  settime() {
    if (this.verifyCode.countdown == 1) {
      this.verifyCode.countdown = 60;
      this.verifyCode.verifyCodeTips = '获取验证码';
      this.verifyCode.disable = false;
      return;
    } else {
      this.verifyCode.countdown--;
      this.verifyCode.disable = true;
    }

    this.verifyCode.verifyCodeTips =
      '重新获取(' + this.verifyCode.countdown + 's)';
    setTimeout(() => {
      this.verifyCode.verifyCodeTips =
        '重新获取(' + this.verifyCode.countdown + 's)';
      this.settime();
    }, 1000);
  }

  // 返回上一页
  canGoBack() {
    this.navParams.data.modal.dismiss({});
  }

  goTotest() {
    let testphone = this.userPhone;
    // var testpattern1 = (/^[1][3458][012356789][0-9]+$/).test(testphone);
    var testpattern1 = /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$/.test(
      testphone
    );

    if (testpattern1 == false) {
      // alert('请输入正确的11位手机号')
      this.presentToast('请输入正确的11位手机号');
    } else if (this.Code == '') {
      this.presentToast('请点击获取验证码');
      // alert('请点击获取验证码')
    } else if (
      this.getCode == this.Code &&
      this.getUserCodePhone == this.userPhone
    ) {
    } else {
      this.presentToast('请输入正确的验证码');
    }
  }
  goBackToLogin() {
    let testphone = this.userPhone;
    // var testpattern1 = (/^[1][3458][012356789][0-9]+$/).test(testphone);
    var testpattern1 = /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$/.test(
      testphone
    );

    if (testpattern1 == false) {
      // alert('请输入正确的11位手机号')
      this.presentToast('请输入正确的11位手机号');
    } else if (this.Code == '') {
      this.presentToast('请点击获取验证码');
      // alert('请点击获取验证码')
    } else if (
      this.getCode == this.Code &&
      this.getUserCodePhone == this.userPhone
    ) {
      this.storage.set('phoneWehat', this.userPhone);
      this.wechatLogin(this.acess);
      // this.navParams.data.modal.dismiss({
      //   result: '消失的时候返回的内容'
      // });
    } else {
      this.presentToast('请输入正确的验证码');
    }
  }
  closeModal() {
    this.navParams.data.modal.dismiss({
      result: '消失的时候返回的内容'
    });
  }

  // modalController.dismiss({
  //   'result': value
  // })

  // 获取验证码
  getSmsCode() {
    this.getUserCodePhone = this.userPhone;
    let testphone = this.userPhone;
    // var testpattern1 = (/^[1][3458][012356789][0-9]+$/).test(testphone);
    var testpattern1 = /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$/.test(
      testphone
    );
    if (testpattern1) {
      Promise.all([
        this.storage.get('ExhibitionId')
      ]).then(([exhibitionId]) => {
        let params = {
          params: {
            phoneNumber: this.userPhone,
            ExhibitionId: exhibitionId
          }
        };
        this.http.post(AppComponent.apiUrl + 'v2/data/getsmscode', params)
          .subscribe(res => {
            if ((res as any).resCode == 0) {
              // 成功
              this.presentToast('验证码发送成功');
              this.verifyCode.disable = true;
              this.settime();
              this.getCode = (res as any).result[0].code;
            } else {
              alert((res as any).resMsg);
              this.presentToast((res as any).resMsg);
            }
          });
      });
    } else {
      this.presentToast('请输入正确格式的手机号码');
    }
  }
  wechatLogin(accessTokenResponse) {
    var that = this;
    Promise.all([
      that.storage.get('TenantId'),
      that.storage.get('UserId'),
      that.storage.get('ExhibitionId'),
      that.storage.get('phoneWehat'),
      that.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, phoneWehat, VisitorRecordId]) => {
      // alert(phoneWehat);
      let body1 = {
        tenantId: tenantId,
        userId: userId,
        params: {
          condition: {
            phone: phoneWehat,
            ExhibitionId: exhibitionId
          }
        }
      };
      // phoneWehat
      that.http
        .post(AppComponent.apiUrl + 'v2/data/register/getLoginType', body1)
        .subscribe((res: any) => {
          if ((res as any).resCode == 0) {
            //  用户注册 调用登陆
            let UserId = (res as any).result[0].UserId;
            let VisitorId = (res as any).result[0].VisitorId;
            let visitorExId = (res as any).result[0].RecordId;
            that.storage.set('UserId', UserId);
            // VisitorRecordId
            that.storage.set('VisitorRecordId', VisitorId);
            that.storage.set('Phone', (res as any).result[0].Mob);
            that.storage.set('VisitorExhibitionInfoId', visitorExId);
            // that.router.navigateByUrl('')
            // 根据VisitorRecordId查出
            // update visitorExhibitioninfo
            // openid unionid nickname logo
            let sex = accessTokenResponse.sex;
            let a = 2;
            sex = sex + '';
            let updateVisitor = {
              tenantId: tenantId,
              userId: userId,
              params: {
                recordId: visitorExId,
                setValue: {
                  OpenId: accessTokenResponse.openid,
                  Unicode: accessTokenResponse.unionid,
                  Logo: accessTokenResponse.headimgurl,
                  NickName: accessTokenResponse.nickname
                  // Sex: accessTokenResponse.sex+'',
                }
              }
            };
            that.http
              .post(
                AppComponent.apiUrl + 'v2/data/update/VisitorExhibitionInfo',
                updateVisitor
              )
              .subscribe(res => {
                if ((res as any).resCode == 0) {
                  // let visitorInfo = (res as any).result;
                  that.storage.set('NickName', accessTokenResponse.nickname);
                  that.storage.set('Logo', accessTokenResponse.headimgurl);
                  // 更新visitor
                  let queryVisitorData1 = {
                    tenantId: tenantId,
                    userId: userId,
                    params: {
                      recordId: VisitorRecordId,
                      setValue: {
                        OpenId: accessTokenResponse.openid,
                        Unicode: accessTokenResponse.unionid,
                        Logo: accessTokenResponse.headimgurl,
                        NickName: accessTokenResponse.nickname
                      }
                    }
                  };
                  that.http
                    .post(
                      AppComponent.apiUrl + 'v2/data/update/Visitor',
                      queryVisitorData1
                    )
                    .subscribe(res => {
                      if ((res as any).resCode == 0) {
                        // let visitorInfo = (res as any).result;
                        // that.presentToast('登录成功')
                        //登录接口
                        let loginData = {
                          params: {
                            Type: '2',
                            Phone: phoneWehat,
                            LoginType: '手机号码登录'
                          }
                        };
                        that.presentLoading('登录中...');
                        that.http
                          .post(
                            AppComponent.apiUrl + 'v2/data/Login',
                            loginData
                          )
                          .subscribe(res => {
                            let result2 = res as any;
                            if (result2.resCode == 0) {
                              let resultInfo = result2.result;
                              // 循环取第一个类型为2的
                              resultInfo.forEach(element => {
                                if (element.Type == '2') {
                                  that.storage.set('token', element.token);
                                }
                              });
                              that.loadingController.dismiss({});
                              that.presentToast('登录成功');
                              if (
                                resultInfo &&
                                resultInfo[0] &&
                                resultInfo[0].HasFirstLogin
                              ) {
                                that.router.navigateByUrl(
                                  '/perfecting-user-infor'
                                );
                              } else {
                                that.router.navigateByUrl('/tabs/tabs/tab1');
                              }
                            } else {
                              that.loadingController.dismiss({});
                              that.presentToast('登录失败：' + result2.resMsg);
                            }
                            // 关闭模态框
                            that.closeModal();
                          });
                      } else {
                        let loginData = {
                          params: {
                            Type: '2',
                            Phone: phoneWehat,
                            LoginType: '手机号码登录'
                          }
                        };
                        that.presentLoading('登录中...');
                        that.http
                          .post(
                            AppComponent.apiUrl + 'v2/data/Login',
                            loginData
                          )
                          .subscribe(res => {
                            let result2 = res as any;
                            if (result2.resCode == 0) {
                              let resultInfo = result2.result;
                              // 循环取第一个类型为2的
                              resultInfo.forEach(element => {
                                if (element.Type == '2') {
                                  that.storage.set('token', element.token);
                                }
                              });
                              that.loadingController.dismiss({});
                              that.presentToast('登录成功');
                              if (
                                resultInfo &&
                                resultInfo[0] &&
                                resultInfo[0].HasFirstLogin
                              ) {
                                that.router.navigateByUrl(
                                  '/perfecting-user-infor'
                                );
                              } else {
                                that.router.navigateByUrl('/tabs/tabs/tab1');
                              }
                            } else {
                              that.loadingController.dismiss({});
                              that.presentToast('登录失败：' + result2.resMsg);
                            }
                            // 关闭模态框
                            that.closeModal();
                          });
                      }
                    });
                } else {
                  alert((res as any).resMsg);
                  // 关闭模态框
                  that.closeModal();
                }
              });
          } else {
            //  用户未注册 调用注册
            // let accessTokenResponse = {
            //   openid: 'oiLZC1YulC3O3AdCh--tZO3u5Gc8',
            //   unionid: 'oOP-p1RcjYT4PesACHvA-TRrmarw',
            //   nickname: 'null',
            //   sex: '1',
            //   language: 'zh_CN',
            //   city: '南京',
            //   province: '江苏',
            //   country: '中国',
            //   headimgurl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK1icjnFece9eQurrib6UWJWaKbY0RDf2AWicdyNJudbJ7wdcjy6EQgPpONicp2mHqCX0trHIrp76lkPg/132',
            //   privilege: [],
            // }
            let body = {
              tenantId: tenantId,
              userId: userId,
              params: {
                records: [
                  {
                    ExhibitionId: exhibitionId,
                    Type: '2',

                    UserName: phoneWehat,
                    UserPassword: '888888',

                    OpenId: accessTokenResponse.openid,
                    Unicode: accessTokenResponse.unionid,

                    Logo: accessTokenResponse.headimgurl,
                    NickName: accessTokenResponse.nickname,
                    Sex: accessTokenResponse.sex + '',

                    Country: accessTokenResponse.country,
                    Province: accessTokenResponse.province,
                    City: accessTokenResponse.city,

                    Name: accessTokenResponse.nickname,
                    Mob: phoneWehat
                  }
                ]
              }
            };
            that.http
              .post(AppComponent.apiUrl + 'v2/data/syncDatas/visitor', body)
              .subscribe((res: any) => {
                if (res.resCode == 0) {
                  let UserId = res.result[0].UserId;
                  let VisitorId = res.result[0].VisitorRecordId;
                  that.storage.set('UserId', UserId);
                  // VisitorRecordId
                  that.storage.set('VisitorRecordId', VisitorId);
                  // that.storage.set(
                  //   'Phone',
                  //   phoneWehat
                  // );
                  that.storage.set('NickName', accessTokenResponse.nickname);
                  that.storage.set('Logo', accessTokenResponse.headimgurl);
                  // 查询
                  // 存 VisitorExhibitionInfoId
                  let teachingData = {
                    tenantId: tenantId,
                    userId: res.result[0].VisitorRecordId,
                    params: {
                      condition: {
                        ExhibitionId: exhibitionId,
                        VisitorId: VisitorId
                      },
                      // properties: ['VisitorId.Visitor.___all'],
                      options: { pageIndex: 1, pageSize: 10 }
                    }
                  };
                  that.http
                    .post(
                      AppComponent.apiUrl +
                        'v2/data/queryList/VisitorExhibitionInfo',
                      teachingData
                    )
                    .subscribe(res => {
                      let visitorExInfo = (res as any).result[0];
                      that.storage.set(
                        'VisitorExhibitionInfoId',
                        visitorExInfo.RecordId
                      );
                      //  //登录接口
                      let loginData = {
                        params: {
                          Type: '2',
                          Phone: phoneWehat,
                          LoginType: '手机号码登录'
                        }
                      };
                      that.presentLoading('登录中...');
                      that.http
                        .post(AppComponent.apiUrl + 'v2/data/Login', loginData)
                        .subscribe(res => {
                            let result2 = res as any;
                            if (result2.resCode == 0) {
                              that.loadingController.dismiss({});
                              let resultInfo = result2.result;
                              that.storage.set(
                                'Phone',
                                (res as any).result[0].Phone || (res as any).result[0].Mob
                              );
                              // 循环取第一个类型为2的
                              resultInfo.forEach(element => {
                                if (element.Type == '2') {
                                  that.storage.set('token', element.token);
                                }
                              });

                              that.presentToast('登录成功');
                              if (
                                resultInfo &&
                                resultInfo[0] &&
                                resultInfo[0].HasFirstLogin
                              ) {
                                that.router.navigateByUrl(
                                  '/perfecting-user-infor'
                                );
                              } else {
                                that.router.navigateByUrl('/tabs/tabs/tab1');
                              }
                              // 关闭模态框
                              that.closeModal();
                              // 存入缓存
                            } else {
                              that.loadingController.dismiss({});
                              that.presentToast('登录失败');
                              // 关闭模态框
                              that.closeModal();
                            }
                        });
                    });
                  // that.presentToast('登录成功')
                  // that.router.navigateByUrl('');
                } else {
                  // 关闭模态框
                  that.closeModal();
                }
              }),
              error => {
                // 关闭模态框
                that.closeModal();
              };
          }
        }),
        error => {
        };
    });
  }
  // 加载框
  async presentLoading(msg) {
    const loading = await this.loadingController.create({
      message: msg
      // duration: 1500
    });
    await loading.present();
    loading.onDidDismiss().then(() => {}, () => {});
  }
  // 弹框提示
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'middle',
      cssClass: 'toast-wrapper'
    });
    toast.present();
  }
}
