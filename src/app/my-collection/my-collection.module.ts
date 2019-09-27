import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { MyCollectionPage } from "./my-collection.page";
import {
  MatButtonModule,
  MatTabsModule,
  MatSidenavModule,
  MatListModule,
  MatDividerModule,
  MatIconModule,
  MatMenuModule
} from "@angular/material";

const routes: Routes = [
  {
    path: "",
    component: MyCollectionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatButtonModule,
    MatTabsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyCollectionPage]
})
export class MyCollectionPageModule {}
