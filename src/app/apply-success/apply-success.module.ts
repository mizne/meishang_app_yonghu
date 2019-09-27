import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ApplySuccessPage } from './apply-success.page';
import { MatListModule, MatButtonModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: ApplySuccessPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatListModule,
    MatButtonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ApplySuccessPage]
})
export class ApplySuccessPageModule {}
