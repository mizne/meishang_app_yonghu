import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyWalletPage } from './my-wallet.page';
import { MatButtonModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: MyWalletPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatButtonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyWalletPage]
})
export class MyWalletPageModule {}
