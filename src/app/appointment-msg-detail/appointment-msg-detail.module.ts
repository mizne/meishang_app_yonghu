import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AppointmentMsgDetailPage } from './appointment-msg-detail.page';

const routes: Routes = [
  {
    path: '',
    component: AppointmentMsgDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AppointmentMsgDetailPage]
})
export class AppointmentMsgDetailPageModule {}
