import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Wechat } from '@ionic-native/wechat/ngx';
// import 'tcplayer';
// declare var TcPlayer: any;

// import { QQSDK, QQShareOptions } from '@ionic-native/qqsdk/ngx';
@Component({
  selector: 'app-wechatshare',
  templateUrl: './wechatshare.page.html',
  styleUrls: ['./wechatshare.page.scss']
})
export class WechatsharePage implements OnInit, AfterViewInit {
  public player1: any;
  public player2: any;
  constructor(private wechat: Wechat) {} // private qq: QQSDK

  ngOnInit() {
    this.goToTest();
  }

  ngAfterViewInit() {
  }

  ionViewWillEnter() {
    this.goToTest();
    const test = document.getElementsByTagName('video')[0];
    console.log(document.getElementsByTagName('video'));
    // test.addEventListener('webkitbeginfullscreen', this.onVideoBeginsFullScreen, false);
    test.addEventListener('webkitbeginfullscreen', (e) => {
      console.log('-------------');
      alert('-----------');
      (screen as any).lockOrientation('landscape-primary');
    }, false);
    // setTimeout(() => {
    // }, 1000);
  }

  onVideoBeginsFullScreen() {
    console.log('-------------');
    (screen as any).lockOrientation('landscape-primary');
  }

  checkFull() {
    var isFull = document.fullscreenEnabled || (window as any).fullScreen ||
                (document as any).webkitIsFullScreen || (document as any).msFullscreenEnabled;
    if (isFull === undefined) {
      isFull = false;
    }
    return isFull;
  }
  // ngAfterViewInit() {

  //   // this.getProductDetails()
  //   // console.log(this.productVideo[0].ViedoSrc+'=============================')

  //     this.player1 = new TcPlayer('id_test_video1', {
  //       'mp4':'https://meishang-mobile-bucket.obs.cn-east-2.myhuaweicloud.com/f5551553-1573-4308-9e31-465e7736c636.mp4', //请替换成实际可用的播放地址
  //       'autoplay': false, 
  //     //  'x5_orientation':1,
  //     //  'h5_flv':'true',
  //     //   'x5_type':'h5',
  //     //   'x5_fullscreen':'false',
  //       // 'controls': 'controls',     //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
  //       'poster': 'https://meishang-mobile-bucket.obs.cn-east-2.myhuaweicloud.com/c0c177dd-c685-4e53-a057-2d4595484c0be',
  //       // 'poster': { 'style': 'default', 'src': 'https://meishang-mobile-bucket.obs.cn-east-2.myhuaweicloud.com/a7bebb51-79bd-4301-8552-d9f9582b529ee'  },
  //       'width': '480',//视频的显示宽度，请尽量使用视频分辨率宽度
  //   'height': '320'//视频的显示高度，请尽量使用视频分辨率高度
  //     });
  //   // this.player2 = new TcPlayer('id_test_video2', {
  //   //   'mp4': 'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/1561559514490-0.750-video.mp4', //请替换成实际可用的播放地址
  //   //   'autoplay': false,
  //   //   'x5_orientation': 2,    //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
  //   //   'poster': 'https://meishang-mobile-bucket.obs.cn-east-2.myhuaweicloud.com/23f7c927-f366-4bbf-926d-a7d6a8d20634e',
  //   //   // 'width': '480',//视频的显示宽度，请尽量使用视频分辨率宽度
  //   //   // 'height': '320'//视频的显示高度，请尽量使用视频分辨率高度
  //   // });

  //   console.log(this.player1)


  // }
  goToTest() {
    // test.addEventListener('click', (event) => {
    //   document.documentElement.requestFullscreen();
    //   screen.orientation.lock('landscape');
    // });
    // screen.orientation.addEventListener('change', (e) => {
    //   screen.orientation.lock('landscape');
    // }, false);
    // screen.orientation.lock('landscape');

    // test.addEventListener('fullscreenchange', (e) => {
    //   screen.orientation.lock('landscape');
    //   console.log('经过全屏操作');
    //   // if (document.fullscreen) {
    //   //   screen.orientation.lock('landscape');
    //   //   console.log('经过全屏操作');
    //   // } else {
    //   // }
    // }, true);

    // document.addEventListener('fullscreenchange', (e) => {
    //   console.log('fullscreenchange', e);
    //   screen.orientation.lock('landscape');
    //   console.log('经过全屏操作');
    // });
    // document.addEventListener('mozfullscreenchange', (e) => {
    //   console.log('mozfullscreenchange ', e);
    //   screen.orientation.lock('landscape');
    //   console.log('经过全屏操作');
    // });
    // document.addEventListener('webkitfullscreenchange', (e) => {
    //   console.log('webkitfullscreenchange', e);
    //   screen.orientation.lock('landscape');
    //   console.log('经过全屏操作');
    // });
    // document.addEventListener('msfullscreenchange', (e) => {
    //   console.log('msfullscreenchange', e);
    //   screen.orientation.lock('landscape');
    //   console.log('经过全屏操作');
    // });


    // if ((screen as any).lockOrientation('landscape-primary') ||
    //     (screen as any).mozLockOrientation('landscape-primary') ||
    //     (screen as any).msLockOrientation('landscape-primary')) {
    //   alert('方向锁定成功');
    // } else {
    //   alert('方向锁定失败');
    // }

    // test.on('webkitfullscreenchange mozfullscreenchange fullscreenchange',function(e){
    //   var isFullScreen = document.fullscreen;
    // });
    // console.log(test)

    // if (test.onfullscreenchange){
    //   alert('====haha5====')
    //   test.webkitEnterFullscreen();

    // }
    // if (test.requestFullscreen()) {
    //   alert('====haha1=====')
    //   test.requestFullscreen();
      
    // } else if (test.webkitEnterFullscreen) {
    //   alert('====haha2=====')
    //   test.webkitEnterFullscreen();
    // } else if (test.webkitEnterFullScreen ){
    //   alert('====haha3=====')
    //   test.webkitEnterFullScreen();
    // }else{
    //   alert('====haha4=====')
    // }
  }

  goToShare3() {
    console.log('===========goToShare====');
    alert('goToShare');

    alert(this.wechat);
    alert(JSON.stringify(this.wechat));
    this.wechat
      .share({
        //     message: {
        //       title: '我是小花谁怕谁',
        //         description: '从前有座山我是卖报的小行家',
        //        mediaTagName: 'Media Tag Name(optional)',
        //   thumb: 'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/1559207275600-0.767-image.png',
        //         media: {
        //           type:this.wechat.Type.WEBPAGE,

        //             webpageUrl: 'https://www.baidu.com'    // webpage
        //        }
        //     },
        // scene: this.wechat.Scene.TIMELINE   // share to Timeline
        //  scene:type=='session'? Wechat.Scene.SESSION : Wechat.Scene.TIMELINE   // SESSION ：分享到微信，TIMELINE：分享到朋友圈
        text: 'This is just a plain string',
        scene: 1
      })
      .then(res => {
        alert('wechat share success!! ' + JSON.stringify(res));
      })
      .catch(e => {
        alert(e);
        alert('wechat share failure; ' + e);
      });
  }

  goToShare1() {
    console.log('===========goToShare====');
    alert('goToShare');

    alert(this.wechat);
    // alert(this.wechat.Type.WEBPAGE)
    this.wechat
      .share({
        message: {
          //     title: '我是小花谁怕谁',
          //       description: '从前有座山我是卖报的小行家',
          //      mediaTagName: 'Media Tag Name(optional)',
          thumb:
            'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/1559207275600-0.767-image.png',
          //
          media: {
            type: 7,

            webpageUrl: 'https://blog.csdn.net/yu17310133443' // webpage
          }
        },
        // scene: this.wechat.Scene.SESSION  , // share to Timeline
        scene: this.wechat.Scene.TIMELINE // share to Timeline
        // SESSION ：分享到微信，TIMELINE：分享到朋友圈
        // text: 'This is just a plain string',
        // scene: this.wechat.Scene.TIMELINE
      })
      .then(res => {
        alert('======success======');
        alert('wechat share success!! ' + JSON.stringify(res));
      })
      .catch(e => {
        alert(e);
        alert('wechat share failure; ');
      });
  }
  goToShare2() {
    console.log('===========goToShare====');
    alert('goToShare');

    alert(this.wechat);
    this.wechat
      .share({
        message: {
          title: '我是小花谁怕谁',
          description: '从前有座山我是卖报的小行家',
          mediaTagName: 'Media Tag Name(optional)',
          thumb:
            'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/1559207275600-0.767-image.png',
          media: {
            type: this.wechat.Type.WEBPAGE,

            webpageUrl: 'https://www.baidu.com' // webpage
          }
        },
        scene: 1 // share to Timeline
        //  scene:type=='session'? Wechat.Scene.SESSION : Wechat.Scene.TIMELINE   // SESSION ：分享到微信，TIMELINE：分享到朋友圈
        // text: 'This is just a plain string',
        // scene: this.wechat.Scene.TIMELINE
      })
      .then(res => {
        alert('wechat share success!! ' + JSON.stringify(res));
      })
      .catch(e => {
        alert(e);
        alert('wechat share failure; ' + e.message);
        alert('wechat share failure; ' + e);
      });
  }

  goToShare11() {
    console.log('===========goToShare====');
    alert('goToShare');

    alert(this.wechat);
    // alert(this.wechat.Type.WEBPAGE)
    this.wechat
      .share({
        message: {
          title: '我是小花谁怕谁',
          description: '从前有座山我是卖报的小行家',
          mediaTagName: 'Media Tag Name(optional)',
          thumb:
            'http://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/1db2d1d5-6791-4994-964e-f512c9e7bcbe.png',

          media: {
            type: 7,

            webpageUrl: 'http://reg.xiaovbao.cn/appdownload' // webpage
          }
        },
        // scene: this.wechat.Scene.SESSION  , // share to Timeline
        scene: 1 // share to Timeline
        // SESSION ：分享到微信，TIMELINE：分享到朋友圈
        // text: 'This is just a plain string',
        // scene: this.wechat.Scene.TIMELINE
      })
      .then(res => {
        alert('wechat share success!! ' + JSON.stringify(res));
      })
      .catch(e => {
        alert(e);
        alert('wechat share failure; ' + e.message);
      });
  }

  goToShare22() {
    console.log('===========goToShare====');
    alert('goToShare');
    alert(this.wechat);
    // alert(this.wechat.Type.WEBPAGE)
    this.wechat
      .share({
        message: {
          title: '美尚荟APP',
          description: '',
          mediaTagName: '',
          thumb:
            'http://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/1db2d1d5-6791-4994-964e-f512c9e7bcbe.png',

          media: {
            type: 7,

            webpageUrl: 'http://reg.xiaovbao.cn/appdownload' // webpage
          }
        },
        // scene: this.wechat.Scene.SESSION  , // share to Timeline
        scene: 0 // share to Timeline
        // SESSION ：分享到微信，TIMELINE：分享到朋友圈
        // text: 'This is just a plain string',
        // scene: this.wechat.Scene.TIMELINE
      })
      .then(res => {
        alert('wechat share success!! ' + JSON.stringify(res));
      })
      .catch(e => {
        alert(e);
        alert('wechat share failure; ' + e.message);
      });
  }

  goToShare33() {
    console.log('===========goToShare====');
    alert('goToShare');

    alert(this.wechat);
    // alert(this.wechat.Type.WEBPAGE)
    this.wechat
      .share({
        message: {
          title: '我是小花谁怕谁',
          description: '从前有座山我是卖报的小行家',
          mediaTagName: 'Media Tag Name(optional)',
          thumb:
            'https://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/1559207275600-0.767-image.png',

          media: {
            type: 7,

            webpageUrl: 'https://www.baidu.com' // webpage
          }
        },
        // scene: this.wechat.Scene.SESSION  , // share to Timeline
        scene: 1 // share to Timeline
        // SESSION ：分享到微信，TIMELINE：分享到朋友圈
        // text: 'This is just a plain string',
        // scene: this.wechat.Scene.TIMELINE
      })
      .then(res => {
        alert('wechat share success!! ' + JSON.stringify(res));
      })
      .catch(e => {
        alert(e);
        alert('wechat share failure; ' + e.message);
      });
  }

  goToShareForQQ() {
    // 分享QQ
    // const options: QQShareOptions = {
    //   client: this.qq.ClientType.QQ,
    //   scene: this.qq.Scene.QQ,
    //   title: 'This is a title for cordova-plugin-qqsdk',
    //   url: 'http://reg.xiaovbao.cn/appdownload',
    //   image: 'http://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/f8fb78e1-ffd9-4106-b4f5-465488395ffd.png',
    //   description: '来自美尚荟APP的分享',
    //   flashUrl: 'http://stream20.qqmusic.qq.com/30577158.mp3',
    // }
    // this.qq.shareNews(options)
    //   .then(() => {
    //     console.log('shareNews success');
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  }

  goToShareForZone() {
    // 分享QQ空间
    //   const options: QQShareOptions = {
    //     client: this.qq.ClientType.QQ,
    //     scene: this.qq.Scene.QQZone,
    //     title: 'This is a title for cordova-plugin-qqsdk',
    //     url: 'http://reg.xiaovbao.cn/appdownload',
    //     image: 'http://baizhanke-1253522040.cos.ap-chengdu.myqcloud.com/f8fb78e1-ffd9-4106-b4f5-465488395ffd.png',
    //     description: '来自美尚荟APP的分享',
    //     flashUrl: 'http://stream20.qqmusic.qq.com/30577158.mp3',
    //   }
    // this.qq.shareNews(options)
    //   .then(() => {
    //     console.log('shareNews success');
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  }
}
