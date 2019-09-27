import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EveryCateoryPage } from './every-cateory.page';

const routes: Routes = [
  {
    path: '',
    component: EveryCateoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EveryCateoryPage]
})
export class EveryCateoryPageModule {}
