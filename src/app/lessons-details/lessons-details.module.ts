import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";


import { LessonsDetailsPage } from "./lessons-details.page";
import { Wechat } from "@ionic-native/wechat/ngx";
 import { QQSDK, QQShareOptions } from '@ionic-native/qqsdk/ngx';
const routes: Routes = [
  {
    path: "",
    component: LessonsDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LessonsDetailsPage],
  providers: [
    Wechat
,QQSDK
  ]
})
export class LessonsDetailsPageModule {}
