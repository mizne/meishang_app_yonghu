import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MySharePage } from './my-share.page';
import { Wechat } from "@ionic-native/wechat/ngx";
import { QQSDK, QQShareOptions } from '@ionic-native/qqsdk/ngx';

const routes: Routes = [
  {
    path: '',
    component: MySharePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [],
   providers: [
    Wechat
    , QQSDK
  ]
})
export class MySharePageModule {}
