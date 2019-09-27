import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChangeTelPage } from './change-tel.page';
import { MatDividerModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: ChangeTelPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatDividerModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
  // ChangeTelPage
})
export class ChangeTelPageModule {}
