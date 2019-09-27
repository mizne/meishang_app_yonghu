import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AccountSafePage } from './account-safe.page';
import { MatButtonModule, MatDividerModule } from '@angular/material';
import {  MatIconModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: AccountSafePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatButtonModule,
    MatIconModule ,
    MatDividerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AccountSafePage]
})
export class AccountSafePageModule {}
