import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddressPage } from './address.page';
import { MatRadioModule, MatCheckboxModule, MatDividerModule, MatIconModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: AddressPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDividerModule,
    MatIconModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddressPage]
})
export class AddressPageModule {}
