import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderPaySuccessPage } from './order-pay-success.page';

const routes: Routes = [
  {
    path: '',
    component: OrderPaySuccessPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderPaySuccessPage]
})
export class OrderPaySuccessPageModule {}
