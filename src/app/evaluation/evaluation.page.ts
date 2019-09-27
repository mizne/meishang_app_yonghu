import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.page.html',
  styleUrls: ['./evaluation.page.scss'],
})
export class EvaluationPage implements OnInit {
  stars: boolean[];
  public text;
  public tenantId;
  public userId;
  public token;
  public exhibitionId;
  public VisitorId;
  public Logo;
  public NickName;
  public proId;
  public ProductInfo;

  constructor(
    public nav: NavController,
    public toastController: ToastController,
    public router: Router,
    private http: HttpClient,
    public storage: Storage,
    private loc: Location
  ) { }

  ngOnInit() {
    this.stars = [true, true, true, true, true];
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('UserId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('token'),
      this.storage.get('Logo'),
      this.storage.get('NickName'),
    ]).then(([tenantId, exhibitionId, userId, VisitorId, token, Logo, NickName]) => {
      this.tenantId = tenantId;
      this.exhibitionId = exhibitionId;
      this.userId = userId;
      this.VisitorId = VisitorId;
      this.token = token;
      this.Logo = Logo;
      this.NickName = NickName;
    });
    const url = this.router.url;
    const splitURL = url.split('/');
    this.proId = splitURL[2];
    this.getProduct();
  }
  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  getProduct() {
    this.http.post(AppComponent.apiUrl + 'v2/data/queryList/Product', {
      TenantId: this.tenantId,
      UserId: this.userId,
      params: {
        condition: {
          RecordId: this.proId
        }
      }
    }, { headers: { Authorization: 'Bearer ' + this.token } })
      .subscribe(ress => {
        const res = (ress as any);
        if (res.resCode === 0) {
          this.ProductInfo = res.result[0];
        }
      });
  }

  submit() {
    this.http.post(AppComponent.apiUrl + 'v2/data/insert/ProductVisitInfoMessage', {
      tenantId: this.tenantId,
      userId: this.userId,
      params: {
        record: {
          ExhibitionId: this.exhibitionId,
          ExhibitorId: this.ProductInfo.ExhibitorId,
          ExhibitorExhibitionInfoId: this.ProductInfo.ExhibitorExhibitionInfoId,
          ProductId: this.ProductInfo.RecordId,
          VisitorId: this.VisitorId,
          ProductVisitInfoId: '',
          Logo: this.Logo,
          Name: this.NickName,
          Content: this.text,
          IsEvaluate: true,
          ProductType: '商品',
          SourceType: '商城'
        }
      }
    }, { headers: { Authorization: 'Bearer ' + this.token } })
      .subscribe(ress => {
        const res = (ress as any);
        if (res.resCode === 0) {
          this.presentToast('评论成功！');
          this.loc.back();
        }
      });
  }

  // 弹框提示
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'middle'
      // color:'#a2a4ab',
    });
    toast.present();
  }
}
