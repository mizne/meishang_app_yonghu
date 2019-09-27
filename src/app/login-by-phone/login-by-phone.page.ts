import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { ToastController, LoadingController } from '@ionic/angular';
import { Wechat } from '@ionic-native/wechat/ngx';
import { randomFill } from 'crypto';
// import { NavParams } from '@ionic/angular';
import { ChangeTelPage } from '../change-tel/change-tel.page';
import { ModalController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
declare var Act1Plugin: any;
@Component({
  selector: 'app-login-by-phone',
  templateUrl: './login-by-phone.page.html',
  styleUrls: ['./login-by-phone.page.scss']
})
export class LoginByPhonePage implements OnInit {
  public Code;
  public userPhone;
  public userPasssword;
  public tendId;
  public userId;
  public getCode;
  public getUserCodePhone;
  // public verifyCode
  public firstLogin = true;
  public isFrozen = false;
  constructor(
    // public navParams: NavParams,
    public modalController: ModalController,
    public toastController: ToastController,
    public nav: NavController,
    public router: Router,
    private http: HttpClient,
    private wechat: Wechat,
    public storage: Storage,
    public loadingController: LoadingController,
    private cdr: ChangeDetectorRef,
    private loc: Location
  ) {
    // let fromPhone = this.navParams.data.result
  }

  ngOnInit() {
    this.Code = '';
    this.queryPhone();
    // this.presentModal1({});
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  // 模态框 绑定手机号
  async presentModal1(acess) {
    const modal = await this.modalController.create({
      component: ChangeTelPage,
      // cssClass: 'addMyCart',
      componentProps: {
        acess
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

  // 弹框提示
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom',
      cssClass: 'toast-wrapper'
    });
    toast.present();
  }

  // 验证码倒计时
  verifyCode: any = {
    verifyCodeTips: '获取验证码',
    countdown: 60,
    disable: true
  };
  verifyCodeverifyCodeTips = '获取验证码';
  verifyCodecountdown = 60;
  verifyCodedisable = true;

  // 倒计时
  settime() {
    if (this.verifyCodecountdown == 1) {
      this.verifyCodecountdown = 60;
      this.verifyCodeverifyCodeTips = '获取验证码';
      this.verifyCodedisable = true;
    } else {
      this.verifyCodecountdown--;
      this.verifyCodeverifyCodeTips =
        '重新获取(' + this.verifyCodecountdown + 's)';
      setTimeout(() => {
        this.settime();
      }, 1000);
      this.cdr.markForCheck();
    }
  }

  toChangeWay() {
    this.router.navigateByUrl('/login-by-password');
  }

  // 获取验证码
  getSmsCode() {
    this.getUserCodePhone = this.userPhone;
    const testphone = this.userPhone;
    // var testpattern1 = (/^[1][3458][012356789][0-9]+$/).test(testphone);
    const testpattern1 = /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$/.test(
      testphone
    );
    if (testpattern1) {
      Promise.all([
        this.storage.get('ExhibitionId')
      ]).then(([exhibitionId]) => {
        const params = {
          params: {
            phoneNumber: this.userPhone,
            ExhibitionId: exhibitionId
          }
        };
        this.http
        .post(AppComponent.apiUrl + 'v2/data/getsmscode', params)
        .subscribe(res => {
          if ((res as any).resCode === 0) {
            // 成功
            this.presentToast('验证码发送成功');
            this.verifyCodedisable = false;
            this.settime();
            this.getCode = (res as any).result[0].code;
          } else {
            this.presentToast((res as any).resMsg);
          }
        });
      });
    } else {
      this.presentToast('请输入正确格式的手机号码');
    }
  }

  queryPhone() {
    // 判断手机号
    const testphone = this.userPhone;
    const testpattern1 = /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$/.test(
      testphone
    );
    if (testpattern1) {
      console.log('=======testpattern1=============');
    } else {
      console.log('=======teerror==========');
    }
  }

  gotoLogin1() {
    const data = {
      params: {
        phoneNumber: this.userPhone,
        verifyCode: this.Code
      }
    };

    this.http
      .post(AppComponent.apiUrl + 'v2/data/valismscode', data)
      .subscribe(res => {
        console.log(res as any);
      });
  }

  // 验证验证码
  gotoLogin() {
    const testphone = this.userPhone;
    // var testpattern1 = (/^[1][3458][012356789][0-9]+$/).test(testphone);
    const testpattern1 = /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$/.test(
      testphone
    );
    // 验证验证码
    const data = {
      params: {
        phoneNumber: this.userPhone,
        verifyCode: this.Code
      }
    };

    if (this.Code === '') {
      this.presentToast('请点击获取验证码');
    } else if (testpattern1 === false) {
      this.presentToast('请输入正确的11位手机号');
    } else if (
      this.getCode === this.Code &&
      this.getUserCodePhone === this.userPhone
    ) {
      Promise.all([
        this.storage.get('TenantId'),
        this.storage.get('UserId'),
        this.storage.get('ExhibitionId'),
        this.storage.get('Logo'),
        this.storage.get('NickName'),
        this.storage.get('VisitorRecordId')
      ]).then(
        ([tenantId, userId, exhibitionId, Logo, NickName, VisitorRecordId]) => {
          // 查询手机号时候已注册  VisitorExhibitionInfo
          const queryVisitorExist = {
            tenantId,
            // userId: userId,
            params: {
              condition: {
                ExhibitionId: exhibitionId,
                UserName: this.userPhone + '',
                Mob: this.userPhone + ''
              }
            }
          };
          this.http
            .post(
              AppComponent.apiUrl + 'v2/data/queryList/VisitorExhibitionInfo',
              queryVisitorExist
            )
            .subscribe(res => {
              const result1 = res as any;
              if (result1.resCode === 0) {
                // 已注册 直接调登录
                const resultInfo = (res as any).result[0];
                this.isFrozen = resultInfo.HasFreeZe;
                this.storage.set(
                  'VisitorExhibitionInfoId',
                  resultInfo.RecordId
                );
                this.storage.set('VisitorRecordId', resultInfo.VisitorId);
                this.storage.set('UserId', resultInfo.UserId);

                this.storage.set('NickName', resultInfo.NickName);
                this.storage.set('Logo', resultInfo.Logo);

                const loginData = {
                  params: {
                    Type: '2',
                    Phone: this.userPhone,
                    LoginType: '手机号码登录'
                  }
                };
                this.presentLoading('登录中...');
                this.http
                  .post(AppComponent.apiUrl + 'v2/data/Login', loginData)
                  .subscribe(res => {
                    const result2 = res as any;
                    if (result2.resCode === 0) {
                      this.loadingController.dismiss({});
                      let resultInfo = result2.result;
                      resultInfo.forEach(element => {
                        if (element.Type === '2') {
                          this.storage.set('token', resultInfo.token);
                          this.storage.set('Type', '2');
                          this.firstLogin = element.HasFirstLogin;
                        }
                      });
                      this.storage.set('Phone', this.userPhone + '');
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
                    } else {
                      this.loadingController.dismiss({});
                      this.presentToast('登录失败');
                    }
                  });
              } else {
                // 未注册 先登录
                // if (null == Logo || undefined == Logo) {
                //   Logo =
                //     'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/80dfddb1-a64b-40fc-b53f-14beea5f0b95.png';
                // }
                // if (null == NickName || undefined == NickName) {
                //   NickName = this.userPhone + '';
                // }
                const visiInfo = {
                  tenantId,
                  // userId: userId,
                  params: {
                    records: [
                      {
                        ExhibitionId: exhibitionId,
                        // ExhibitionId: '5cac7e7794eff7216337cbca',
                        Logo:
                          'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/80dfddb1-a64b-40fc-b53f-14beea5f0b95.png',
                        Name: this.userPhone + '',
                        Mob: this.userPhone + '',
                        NickName: '美尚荟新用户',
                        Sex: '2',
                        Remark: '暂无个人介绍',
                        UserName: this.userPhone + '',
                        Type: '2',
                        UserPassword: '888888'
                      }
                    ]
                  }
                };

                this.http
                  .post(
                    AppComponent.apiUrl + 'v2/data/syncDatas/visitor',
                    visiInfo
                  )
                  .subscribe(res => {
                    let result1 = res as any;
                    if (result1.resCode === 0) {
                      this.userId = result1.UserId;
                      this.storage.set(
                        'UserName',
                        (result1.result[0] as any).UserName
                      );
                      this.storage.set('UserId', result1.result[0].UserId);
                      // VisitorRecordId
                      this.storage.set(
                        'VisitorRecordId',
                        result1.result[0].VisitorRecordId
                      );
                      // 存VisitorExhibitionInfoId
                      const teachingData = {
                        tenantId,
                        userId,
                        params: {
                          condition: {
                            ExhibitionId: exhibitionId,
                            VisitorId: result1.result[0].RecordId
                          },
                          // properties: ['VisitorId.Visitor.___all'],
                          options: { pageIndex: 1, pageSize: 10 }
                        }
                      };

                      this.http
                        .post(
                          AppComponent.apiUrl +
                            'v2/data/queryList/VisitorExhibitionInfo',
                          teachingData
                        )
                        .subscribe(res => {
                          if ((res as any).resCode === 0) {
                            const visitorExInfo = (res as any).result[0];
                            this.storage.set(
                              'NickName',
                              visitorExInfo.NickName
                            );
                            this.storage.set('Logo', visitorExInfo.Logo);
                            this.storage.set(
                              'VisitorExhibitionInfoId',
                              visitorExInfo.RecordId
                            );
                            // 注册成功之后登录
                            const loginData = {
                              params: {
                                Type: '2',

                                Phone: this.userPhone,
                                LoginType: '手机号码登录'
                              }
                            };
                            this.presentLoading('登录中...');
                            this.http
                              .post(
                                AppComponent.apiUrl + 'v2/data/Login',
                                loginData
                              )
                              .subscribe(res => {
                                const result2 = res as any;
                                if (result2.resCode == 0) {
                                  var firstLogin = true;
                                  this.loadingController.dismiss({});
                                  const resultInfo = result2.result;
                                  resultInfo.forEach(element => {
                                    if (element.Type == '2') {
                                      this.storage.set('Type', '2');
                                      this.storage.set('token', element.token);
                                      firstLogin = element.HasFirstLogin;
                                    }
                                  });
                                  this.storage.set(
                                    'Phone',
                                    this.userPhone + ''
                                  );
                                  if (firstLogin) {
                                    this.presentToast('请完善用户信息');
                                    this.router.navigateByUrl('/perfecting-user-infor');
                                  } else {
                                    this.presentToast('登录成功');
                                    this.router.navigateByUrl('/tabs/tabs/tab1');
                                    this.updateBuyState();
                                  }
                                } else {
                                  this.loadingController.dismiss({});
                                  this.presentToast('登录失败');
                                }
                              });
                          }
                        });
                    } else {
                      alert(result1.resMsg);
                    }
                  });
              }
            });
        }
      );
    } else {
      // 验证码不正
      this.presentToast('验证码不正确');
    }
  }

  goToUserRules() {
    this.router.navigateByUrl('/user-rules');
  }

  /*
    1.先用获取到的openid unionid 去查询是否有注册，有的话直接用查到的记录的手机号调用登录接口
    2.没查到，跳绑定手机号界面
    3.用户输入手机号查询是否注册
    4.已注册 (补：update接口，更新openid unionid logo nickname)调用登陆
    5.未注册 调用注册,（补充验证码验证）
  */

  wechatLogin(accessTokenResponse) {
    const that = this;
    Promise.all([
      that.storage.get('TenantId'),
      that.storage.get('UserId'),
      that.storage.get('ExhibitionId'),
      that.storage.get('phoneWehat'),
      that.storage.get('VisitorRecordId')
    ]).then(([tenantId, userId, exhibitionId, phoneWehat, VisitorRecordId]) => {
      const body1 = {
        tenantId,
        userId,
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
          if ((res as any).resCode === 0) {
            //  用户注册 调用登陆
            const UserId = (res as any).result[0].UserId;
            const VisitorId = (res as any).result[0].VisitorId;
            const visitorExId = (res as any).result[0].RecordId;
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
            const updateVisitor = {
              tenantId,
              userId,
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
                if ((res as any).resCode === 0) {
                  // let visitorInfo = (res as any).result;
                  that.storage.set('NickName', accessTokenResponse.nickname);
                  that.storage.set('Logo', accessTokenResponse.headimgurl);
                  // 更新visitor
                  const queryVisitorData1 = {
                    tenantId,
                    userId,
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
                      if ((res as any).resCode === 0) {
                        // 登录接口
                        const loginData = {
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
                            const result2 = res as any;
                            if (result2.resCode === 0) {
                              const resultInfo = result2.result;
                              // 循环取第一个类型为2的
                              resultInfo.forEach(element => {
                                if (element.Type === '2') {
                                  that.storage.set('token', element.token);
                                }
                              });
                              that.loadingController.dismiss({});
                              that.presentToast('登录成功');
                              that.router.navigateByUrl('/tabs/tabs/tab1');
                              that.updateBuyState();
                            } else {
                              that.loadingController.dismiss({});
                              that.presentToast('登录失败：' + result2.resMsg);
                            }
                          });
                      } else {
                        const loginData = {
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
                            const result2 = res as any;
                            if (result2.resCode === 0) {
                              const resultInfo = result2.result;
                              // 循环取第一个类型为2的
                              resultInfo.forEach(element => {
                                if (element.Type === '2') {
                                  that.storage.set('token', element.token);
                                }
                              });
                              that.loadingController.dismiss({});
                              that.presentToast('登录成功');
                              that.router.navigateByUrl('/tabs/tabs/tab1');
                              that.updateBuyState();
                            } else {
                              that.loadingController.dismiss({});
                              that.presentToast('登录失败：' + result2.resMsg);
                            }
                          });
                      }
                    });
                } else {
                  alert((res as any).resMsg);
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
            const body = {
              tenantId,
              userId,
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
                if (res.resCode === 0) {
                  const UserId = res.result[0].UserId;
                  const VisitorId = res.result[0].VisitorRecordId;
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
                  const teachingData = {
                    tenantId,
                    userId: res.result[0].VisitorRecordId,
                    params: {
                      condition: {
                        ExhibitionId: exhibitionId,
                        VisitorId
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
                      const visitorExInfo = (res as any).result[0];
                      that.storage.set(
                        'VisitorExhibitionInfoId',
                        visitorExInfo.RecordId
                      );
                      //  //登录接口
                      const loginData = {
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
                          const result2 = res as any;
                          if (result2.resCode == 0) {
                            that.loadingController.dismiss({});
                            const resultInfo = result2.result;
                            that.storage.set(
                              'Phone',
                              (res as any).result[0].Mob
                            );
                            // 循环取第一个类型为2的
                            resultInfo.forEach(element => {
                              if (element.Type == '2') {
                                that.storage.set('token', element.token);
                              }
                            });
                            that.presentToast('登录成功');
                            that.router.navigateByUrl('/tabs/tabs/tab1');
                            that.updateBuyState();
                            // 存入缓存
                          } else {
                            that.loadingController.dismiss({});
                            that.presentToast('登录失败');
                          }
                        });
                    });
                }
              }, error => {
                alert(error + 'error');
              });
          }
        }, error => {
          alert(error + 'error');
        });
    });
  }
  wechatLogin2() {
    const that = this;
    // 获取用户是否安装微信
    try {
      const scope = 'snsapi_userinfo',
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
                  AppComponent.apiUrl +
                    'v2/data/wxGetUserInfoByLoginForMeishang',
                  {
                    code: res.code
                  }
                )
                .subscribe((res1: any) => {
                  if (res1.resCode == 0) {
                    // 用户输入手机号查询是否注册
                    //   注册 调用登陆
                    //   未注册 调用注册
                    // that.presentToast('授权登录中....');
                    const openid = res1.result.openid;
                    const unionid = res1.result.unionid;
                    Promise.all([
                      that.storage.get('TenantId'),
                      that.storage.get('UserId'),
                      that.storage.get('ExhibitionId')
                    ]).then(([tenantId, userId, exhibitionId]) => {
                      const queryIsSign = {
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
                      that.http
                        .post(
                          AppComponent.apiUrl +
                            'v2/data/queryList/VisitorExhibitionInfo',
                          queryIsSign
                        )
                        .subscribe(res => {
                          if ((res as any).resCode === 0) {
                            // 微信直接登录注册过
                            const userInfo = (res as any).result[0];
                            this.isFrozen = userInfo.HasFreeZe;
                            // 存缓存
                            that.storage.set(
                              'VisitorExhibitionInfoId',
                              userInfo.RecordId
                            );
                            that.storage.set('Phone', userInfo.Mob);
                            that.storage.set(
                              'VisitorRecordId',
                              userInfo.VisitorId
                            );
                            that.storage.set('NickName', userInfo.NickName);
                            that.storage.set('Logo', userInfo.Logo);
                            // 登录接口
                            const loginData = {
                              params: {
                                Type: '2',
                                Phone: userInfo.Mob,
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
                                const result2 = res as any;
                                if (result2.resCode === 0) {
                                  const resultInfo = result2.result;
                                  resultInfo.forEach(element => {
                                    if (element.Type === '2') {
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
                  console.log('===========获取token，openID err============');
                });
            })
            .catch(reason => {
              console.log('微信授权失败');
            });
        }).catch(reason => {
          console.log('没有发现微信客户端');
        });
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  // 直播
  live() {
    const resultData = {
      id: '',
      userSig: '',
      token: '',
      title: 'test直播间',
      cover:
        'https://main.qcloudimg.com/raw/18c5ada2476fc2ac7d344350e2ad298e.png',
      uid: 'testjin', // HostID HostName
      roomnum: 10127, // RoomNum
      thumbup: 0, // Admires
      memsize: 1 // Members
    };
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId')
    ]).then(([tenantId, userId]) => {
      // const requestData = {
      //   tenantId,
      //   userId,
      //   params: {
      //     condition: {
      //       RecordId: userId
      //     }
      //   }
      // };

      // 账号1
      const requestData = {
        tenantId: '532ad4c34138982cbb4e9397d26d107f',
        userId: '5c1b0f1d3b428de40c40eecd',
        params: {
          condition: {
            RecordId: '5c1b0f1d3b428de40c40eecd'
          }
        }
      };
      // 账号2
      // const requestData = {
      //   'tenantId':'532ad4c34138982cbb4e9397d26d107f',
      //   'userId':'5c20919d18f692289df0fd51',
      //   'params': {
      //     'condition': {
      //       'RecordId':'5c20919d18f692289df0fd51'
      //     }
      //   }
      // }
      this.http
        .post(
          'http://192.168.1.20:8081/portal-web/sxb/getUserInfo',
          requestData
        )
        .subscribe(
          res => {
            if ((res as any).code === 'true') {
              resultData.id = (res as any).userName;
              resultData.userSig = (res as any).userSig;
              resultData.token = (res as any).token;
              Act1Plugin.Login(resultData);
            }
          },
          () => {
            alert('getUserInfo failed');
          }
        );
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
