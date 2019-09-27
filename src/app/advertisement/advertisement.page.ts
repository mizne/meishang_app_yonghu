import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Network } from '@ionic-native/network/ngx';
@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.page.html',
  styleUrls: ['./advertisement.page.scss'],
})
export class AdvertisementPage implements OnInit {
  public backGroundPic;
  public timer;
  constructor(
    public router: Router,
    public storage: Storage,
    public http: HttpClient,
    private route: ActivatedRoute,
    public network: Network
  ) {
    this.route.data.subscribe(banner => {
      this.backGroundPic = banner.adBanner;
    });
  }

  ngOnInit() {
    this.timer = setTimeout(() => {
      this.router.navigateByUrl('/tabs/tabs/tab1', { replaceUrl: true });
    }, 6000);
  }

  ionViewWillEnter() {
    // alert(this.network.type);
    // if (this.network.type === 'none' || this.network.type === 'unknown' || this.network.type === null) {
    //   alert('暂无网络，请在设置中开启网络');
    // } else {
    // }
  }

  skipPic() {
    clearTimeout(this.timer);
    this.router.navigateByUrl('/tabs/tabs/tab1', { replaceUrl: true });
  }
}
