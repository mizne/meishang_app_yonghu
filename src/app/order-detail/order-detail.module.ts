import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderDetailPage } from './order-detail.page';
import { MatDividerModule, MatListModule, MatButtonModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: OrderDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderDetailPage]
})
export class OrderDetailPageModule {}
