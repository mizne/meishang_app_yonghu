import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Routes, RouterModule } from "@angular/router";
import { GoToAddCartPage } from "../go-to-add-cart/go-to-add-cart.page";
import { IonicModule } from "@ionic/angular";

import { MatButtonModule, MatCheckboxModule } from "@angular/material";

import { GoodsDetailsPage } from "./goods-details.page";
import { Wechat } from "@ionic-native/wechat/ngx";

import { QuillModule } from "ngx-quill";
import { QuillEditorWrapperComponent } from "../quill-editor-wrapper/quill-editor-wrapper.component";
import { QQSDK, QQShareOptions } from "@ionic-native/qqsdk/ngx";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
const routes: Routes = [
  {
    path: "",
    component: GoodsDetailsPage
  }
];

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    MatButtonModule,
    QuillModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [GoodsDetailsPage, QuillEditorWrapperComponent],
  providers: [Wechat, QQSDK]
  // entryComponents: [GoToAddCartPage]
})
export class GoodsDetailsPageModule {}
