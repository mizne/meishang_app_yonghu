import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NavController, IonContent } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-help-serve',
  templateUrl: './help-serve.page.html',
  styleUrls: ['./help-serve.page.scss'],
})
export class HelpServePage implements OnInit, AfterViewInit {
  public sendContent;
  public EEInfoId;
  public messageList;
  public Logo;
  public storeLogo;
  public timer;
  @ViewChild(IonContent, {static: false}) ionContent: IonContent;

  constructor(public nav: NavController, private http: HttpClient,
              public storage: Storage, public router: Router, private loc: Location) { }

  ngOnInit() {
    const url = this.router.url;
    const splitURL = url.split('/');
    this.EEInfoId = splitURL[2];
    this.queryMessage();
    this.queryStoreLogo();
  }

  ionViewWillEnter() {
    this.queryMessage();
    this.timer = setInterval(() => {
      this.queryMessage();
    }, 3000);
  }

  ngAfterViewInit() {
    console.log(this.ionContent);
  }

  // 返回上一页
  canGoBack() {
    clearInterval(this.timer);
    this.loc.back();
  }

  sendMessage() {
    if (this.sendContent === '' || this.sendContent === undefined) {
      return;
    }
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('NickName'),
      this.storage.get('Logo')
    ]).then(([tenantId, userId, exhibitionId, visitorRecordId, nickName, logo]) => {
      const queryOrderData = {
        userId,
        tenantId,
        params: {
          record: {
            ExhibitionId: exhibitionId,
            Type: '0',
            Content: this.sendContent,
            NickName: nickName,
            Logo: logo,
            VisitorSender: visitorRecordId,
            Storeeceiver: this.EEInfoId
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/insert/MsgInfo', queryOrderData)
        .subscribe(res => {
          if ((res as any).resMsg === 'success') {
            this.sendContent = '';
            this.queryMessage();
          }
        });
    });
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function() {
      that.ionContent.scrollToBottom();
    }, 800);
  }

  queryMessage() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId'),
      this.storage.get('VisitorRecordId'),
      this.storage.get('Logo')
    ]).then(([tenantId, userId, exhibitionId, visitorRecordId, logo]) => {
      this.Logo = logo;
      const queryOrderData = {
        userId,
        tenantId,
        params: {
          condition: {
            ExhibitionId: exhibitionId,
            $or: [
              {
                VisitorReceiver: visitorRecordId,
                StoreSender: this.EEInfoId
              },
              {
                VisitorSender: visitorRecordId,
                Storeeceiver: this.EEInfoId
              }]
          },
          options: {
            sort: {
              CreatedAtMesc: 1
            }
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/MsgInfo', queryOrderData)
        .subscribe(res => {
          if ((res as any).resMsg === 'success') {
            this.messageList = (res as any).result;
          }
        });
    });
  }

  queryStoreLogo() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, userId, exhibitionId]) => {
      const queryOrderData = {
        userId,
        tenantId,
        params: {
          condition: {
            ExhibitionId: exhibitionId,
            RecordId: this.EEInfoId
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/ExhibitorExhibitionInfo', queryOrderData)
        .subscribe(res => {
          if ((res as any).resMsg === 'success') {
            this.storeLogo = (res as any).result[0].Logo;
          }
        });
    });
  }
}
