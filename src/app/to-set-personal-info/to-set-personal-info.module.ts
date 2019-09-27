import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ToSetPersonalInfoPage } from './to-set-personal-info.page';

const routes: Routes = [
  {
    path: '',
    component: ToSetPersonalInfoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ToSetPersonalInfoPage]
})
export class ToSetPersonalInfoPageModule {}
