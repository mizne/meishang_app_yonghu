import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EveryFirstCategoryPage } from './every-first-category.page';

const routes: Routes = [
  {
    path: '',
    component: EveryFirstCategoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EveryFirstCategoryPage]
})
export class EveryFirstCategoryPageModule {}
