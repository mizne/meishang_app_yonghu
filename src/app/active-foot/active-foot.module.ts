import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ActiveFootPage } from './active-foot.page';
import { MatListModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: ActiveFootPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatListModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ActiveFootPage]
})
export class ActiveFootPageModule {}
