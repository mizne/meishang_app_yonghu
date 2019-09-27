import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CommentsOfShopPage } from './comments-of-shop.page';

const routes: Routes = [
  {
    path: '',
    component: CommentsOfShopPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CommentsOfShopPage]
})
export class CommentsOfShopPageModule {}
